// Upstream calls (LINZ, ECan, Open-Meteo), each cached in the Workers Cache API.
// Upstream error bodies are never passed on: the LINZ ones echo the API key.

import {
  addressCql, cellKey, cumulativeNormal, era5SeasonTotal, nearestGauge, nzToday, addDays,
  parseEcanDailyCsv, parseEcanSites, seasonStart, daysBetween, gaugeSeasonTotal, normalTo, percentOf,
  snapToGrid,
} from './lib.js';
import NORMALS from '../data/normals.json' with { type: 'json' };

const HOUR = 3600;
const TTL = { linz: 7 * 24 * HOUR, sites: 24 * HOUR, rain: 3 * HOUR, era5: 12 * HOUR, normal: 30 * 24 * HOUR };

export class UpstreamError extends Error {
  constructor(source) {
    super(`${source} did not answer. Try again in a minute.`);
    this.source = source;
  }
}

// Fetch with a cache key that never contains secrets.
async function cached(ctx, key, ttl, source, load) {
  const cache = ctx.cache;
  const req = new Request('https://cache.farm-ai-commons.internal/' + encodeURIComponent(key));
  if (cache) {
    const hit = await cache.match(req);
    if (hit) return hit.json();
  }
  let value;
  try {
    value = await load();
  } catch (e) {
    if (e instanceof UpstreamError) throw e;
    throw new UpstreamError(source);
  }
  if (cache) {
    const res = new Response(JSON.stringify(value), {
      headers: { 'content-type': 'application/json', 'cache-control': `public, max-age=${ttl}` },
    });
    const put = cache.put(req, res);
    if (ctx.waitUntil) ctx.waitUntil(put); else await put;
  }
  return value;
}

async function getOk(ctx, url, source, as = 'json') {
  const res = await ctx.fetch(url, { headers: { 'user-agent': 'farm-ai-commons-api (thecolab.ai course data)' } });
  if (!res.ok) throw new UpstreamError(source);
  return as === 'text' ? res.text() : res.json();
}

function linzUrl(ctx, query) {
  if (!ctx.env.LINZ_LDS_KEY) throw new UpstreamError('LINZ');
  return `https://data.linz.govt.nz/services;key=${ctx.env.LINZ_LDS_KEY}/wfs?service=WFS&version=2.0.0&request=GetFeature&outputFormat=json&srsName=EPSG:4326&${query}`;
}

// ---------- LINZ ----------

export async function findAddresses(ctx, clean) {
  const cql = addressCql(clean);
  return cached(ctx, 'linz-addr:' + clean.toLowerCase(), TTL.linz, 'LINZ', async () => {
    const q = `typeNames=data.linz.govt.nz:layer-123113&count=5&propertyName=full_address,territorial_authority,shape&cql_filter=${encodeURIComponent(cql)}`;
    const json = await getOk(ctx, linzUrl(ctx, q), 'LINZ');
    return (json.features ?? []).map((f) => ({
      address: f.properties.full_address,
      district: f.properties.territorial_authority,
      lat: round(f.geometry.coordinates[1], 6),
      lon: round(f.geometry.coordinates[0], 6),
    }));
  });
}

export async function parcelAt(ctx, lat, lon) {
  return cached(ctx, `linz-parcel:${lat.toFixed(6)},${lon.toFixed(6)}`, TTL.linz, 'LINZ', async () => {
    // LINZ CQL with EPSG:4326 takes POINT(lat lon).
    const cql = `INTERSECTS(shape,POINT(${lat} ${lon}))`;
    const q = `typeNames=data.linz.govt.nz:layer-50772&count=1&propertyName=id,appellation,land_district,calc_area&cql_filter=${encodeURIComponent(cql)}`;
    const json = await getOk(ctx, linzUrl(ctx, q), 'LINZ');
    const p = json.features?.[0]?.properties;
    if (!p) return null;
    return {
      parcel_id: p.id,
      appellation: p.appellation || 'Parcel without a legal description',
      land_district: p.land_district,
      area_ha: round((p.calc_area || 0) / 10000, p.calc_area >= 100000 ? 1 : 2),
    };
  });
}

// ---------- ECan ----------

const ECAN_SITES = 'https://gis.ecan.govt.nz/arcgis/rest/services/Public/WaterQualityandMonitoring/FeatureServer/5/query?where=1%3D1&outFields=SITENUMBER,SITE,SITENAME,ALTITUDE,LAST_SAMPLE&returnGeometry=true&outSR=4326&f=json';

export async function ecanSites(ctx) {
  return cached(ctx, 'ecan-sites', TTL.sites, 'ECan', async () => parseEcanSites(await getOk(ctx, ECAN_SITES, 'ECan'), ctx.nowMs ?? Date.now()));
}

export async function gaugeRain(ctx, lat, lon, today = nzToday()) {
  const gauge = nearestGauge(await ecanSites(ctx), lat, lon);
  if (!gauge) return { gauge: null, rain: null };
  const start = seasonStart(today);
  const period = daysBetween(start, today) <= 170 ? '6_Months' : '1_Year';
  const rows = await cached(ctx, `ecan-rain:${gauge.site_no}:${period}:${today}`, TTL.rain, 'ECan', async () => {
    const url = `https://data.ecan.govt.nz/data/78/Rainfall/Rainfall%20for%20individual%20site/CSV?SiteNo=${gauge.site_no}&Period=${period}`;
    return parseEcanDailyCsv(await getOk(ctx, url, 'ECan', 'text'));
  });
  return { gauge, rain: gaugeSeasonTotal(rows, start, today) };
}

// ---------- ERA5 via Open-Meteo ----------

function archiveUrl(lat, lon, from, to) {
  return `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${from}&end_date=${to}&daily=precipitation_sum&models=era5&timezone=Pacific%2FAuckland`;
}

async function cellNormal(ctx, cellLat, cellLon) {
  const key = cellKey(cellLat, cellLon);
  if (NORMALS.cells[key]) return NORMALS.cells[key];
  // Outside the baked table: work it out once and keep it for 30 days.
  return cached(ctx, 'era5-normal:' + key, TTL.normal, 'Open-Meteo', async () => {
    const json = await getOk(ctx, archiveUrl(cellLat, cellLon, '1991-01-01', '2020-12-31'), 'Open-Meteo');
    return cumulativeNormal(json.daily.time, json.daily.precipitation_sum);
  });
}

export async function era5Season(ctx, lat, lon, today = nzToday()) {
  const cellLat = snapToGrid(lat);
  const cellLon = snapToGrid(lon);
  const from = seasonStart(today);
  // ERA5 runs about 6 days behind; ask up to 5 days ago and drop the empty tail.
  const to = addDays(today, -5);
  if (to < from) return null;
  const series = await cached(ctx, `era5-season:${cellKey(cellLat, cellLon)}:${from}:${today}`, TTL.era5, 'Open-Meteo', async () => {
    const json = await getOk(ctx, archiveUrl(cellLat.toFixed(2), cellLon.toFixed(2), from, to), 'Open-Meteo');
    return era5SeasonTotal(json.daily.time, json.daily.precipitation_sum);
  });
  if (!series.to) return null;
  const cum = await cellNormal(ctx, cellLat, cellLon);
  const normal = normalTo(cum, series.to);
  return {
    cell_lat: cellLat,
    cell_lon: cellLon,
    from,
    to: series.to,
    season_mm: series.total_mm,
    normal_mm: normal,
    percent_of_normal: percentOf(series.total_mm, normal),
    normal_period: '1991-2020',
  };
}

function round(v, dp) {
  const f = 10 ** dp;
  return Math.round(v * f) / f;
}
