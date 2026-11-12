// The four course data operations. The HTTP routes and the MCP tools both call these.

import { ATTRIBUTION, cleanAddress, inNZ, nzToday, rainCardRows, rainCardText } from './lib.js';
import { era5Season, findAddresses, gaugeRain, parcelAt, UpstreamError } from './sources.js';

export class BadInput extends Error {}

export function readLatLon(lat, lon) {
  const a = Number(lat);
  const o = Number(lon);
  if (lat === undefined || lat === null || lat === '' || lon === undefined || lon === null || lon === '' || !inNZ(a, o)) {
    throw new BadInput('lat and lon must be decimal degrees inside New Zealand, for example lat=-44.728&lon=170.467.');
  }
  return [a, o];
}

function cleanOrThrow(address) {
  const clean = cleanAddress(address);
  if (!clean) throw new BadInput('address must be 3 to 200 characters, for example "101 Bledisloe Street, Kurow".');
  return clean;
}

export async function findFarm(ctx, address) {
  const clean = cleanOrThrow(address);
  const matches = await findAddresses(ctx, clean);
  const withParcels = await Promise.all(matches.map(async (m) => ({ ...m, parcel: await parcelAt(ctx, m.lat, m.lon) })));
  return {
    query: clean,
    matches: withParcels,
    note: withParcels.length
      ? 'An address finds one land parcel, often the house lot. The farm may cover more parcels than this.'
      : 'No address matched. Try the number and road name, then the town, for example "101 Bledisloe Street, Kurow".',
    attribution: [ATTRIBUTION.linz],
  };
}

export async function rainSinceJuly(ctx, lat, lon, today = ctx.today ?? nzToday()) {
  const { gauge, rain } = await gaugeRain(ctx, lat, lon, today);
  return {
    location: { lat, lon },
    gauge,
    rain,
    note: gauge
      ? 'Daily totals from the nearest open Environment Canterbury rain gauge. Today is left out until the day is complete.'
      : 'No open council rain gauge within 35 km. The card reads Environment Canterbury gauges for now; other regional councils show theirs on their own websites.',
    attribution: gauge ? [ATTRIBUTION.ecan] : [],
  };
}

export async function rainNormal(ctx, lat, lon, today = ctx.today ?? nzToday()) {
  const era5 = await era5Season(ctx, lat, lon, today);
  return {
    location: { lat, lon },
    era5,
    note: 'ERA5 is a climate reanalysis on a grid of about 25 km. These figures are for the nearest ~25 km climate grid cell, compared with that same cell\'s 1991-2020 normal for the same dates. ERA5 runs about 6 days behind.',
    attribution: [ATTRIBUTION.era5],
  };
}

export async function makeRainCard(ctx, { address, lat, lon, place }, today = ctx.today ?? nzToday()) {
  let point;
  let label;
  if (address !== undefined && address !== null && address !== '') {
    const found = await findFarm(ctx, address);
    if (!found.matches.length) throw new BadInput(found.note);
    point = found.matches[0];
    label = point.address;
  } else {
    const [a, o] = readLatLon(lat, lon);
    point = { lat: a, lon: o };
    label = cleanAddress(place) || `${Math.abs(a).toFixed(4)} S, ${o.toFixed(4)} E`;
  }
  const [parcel, rain, normal] = await Promise.all([
    point.parcel !== undefined ? point.parcel : parcelAt(ctx, point.lat, point.lon).catch(() => null),
    gaugeRain(ctx, point.lat, point.lon, today).catch(() => ({ gauge: null, rain: null, failed: true })),
    era5Season(ctx, point.lat, point.lon, today).catch(() => null),
  ]);
  if (rain.failed && !normal) throw new UpstreamError('ECan and Open-Meteo');
  const card = rainCardText({ place: label, parcel, gauge: rain.gauge, gaugeRain: rain.rain, era5: normal, today, gaugeFailed: !!rain.failed });
  const rows = rainCardRows({ gauge: rain.gauge, gaugeRain: rain.rain, era5: normal, gaugeFailed: !!rain.failed });
  const attribution = [ATTRIBUTION.linz];
  if (rain.gauge) attribution.push(ATTRIBUTION.ecan);
  if (normal) attribution.push(ATTRIBUTION.era5);
  return {
    place: label,
    location: { lat: point.lat, lon: point.lon },
    made: today,
    parcel,
    gauge: rain.gauge,
    gauge_rain: rain.rain,
    era5: normal,
    missing: [rain.failed ? 'gauge rain (ECan did not answer)' : null, normal ? null : 'ERA5 normal (Open-Meteo did not answer)'].filter(Boolean),
    card,
    rows,
    attribution,
  };
}
