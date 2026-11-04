// Builds data/normals.json: the ERA5 1991-2020 daily rain normal for every ~25 km grid cell
// within 35 km of an active ECan rain gauge, plus the field-day districts.
// Each cell holds 365 running totals from 1 July, in tenths of a mm.
// Run: node scripts/build-normals.mjs
// Open-Meteo counts a 30-year pull as about 78 calls per cell (limits: 600 a minute,
// 5,000 an hour, 10,000 a day), so this runs in 5-cell batches, nearest to Kurow first,
// keeps what it has fetched, and stops at the hourly or daily cap. Run it again later to finish.

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { cellKey, cumulativeNormal, GAUGE_MAX_KM, GRID, haversineKm, parseEcanSites, snapToGrid } from '../src/lib.js';
import { DISTRICTS } from './districts.mjs';

const SITES = 'https://gis.ecan.govt.nz/arcgis/rest/services/Public/WaterQualityandMonitoring/FeatureServer/5/query?where=1%3D1&outFields=SITENUMBER,SITE,SITENAME,ALTITUDE,LAST_SAMPLE&returnGeometry=true&outSR=4326&f=json';
const BATCH = 5;
const FILE = new URL('../data/normals.json', import.meta.url);
const KUROW = [-44.7303, 170.4697];

const sites = parseEcanSites(await (await fetch(SITES)).json());
console.log(`active ECan rain gauges: ${sites.length}`);

const cells = new Map();
function addCell(lat, lon) {
  const k = cellKey(lat, lon);
  if (!cells.has(k)) cells.set(k, [snapToGrid(lat), snapToGrid(lon)]);
}
for (const s of sites) {
  for (let i = -3; i <= 3; i++) {
    for (let j = -3; j <= 3; j++) {
      const la = snapToGrid(s.lat) + i * GRID;
      const lo = snapToGrid(s.lon) + j * GRID;
      if (haversineKm(s.lat, s.lon, la, lo) <= GAUGE_MAX_KM) addCell(la, lo);
    }
  }
}
for (const d of DISTRICTS) addCell(d.lat, d.lon);
console.log(`cells: ${cells.size}`);

const out = existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf8')).cells : {};
const list = [...cells.entries()]
  .filter(([k]) => !out[k])
  .sort((a, b) => haversineKm(...KUROW, ...a[1]) - haversineKm(...KUROW, ...b[1]));
console.log(`already built: ${Object.keys(out).length}, to fetch: ${list.length}`);

function save() {
  const sorted = Object.fromEntries(Object.keys(out).sort().map((k) => [k, out[k]]));
  writeFileSync(FILE, JSON.stringify({
    source: 'ERA5 via Open-Meteo archive API (models=era5). Contains modified Copernicus Climate Change Service information. CC BY 4.0.',
    normal_period: '1991-2020',
    grid_degrees: GRID,
    built: new Date().toISOString().slice(0, 10),
    values: 'Per cell "lat,lon" (cell centre): 365 running totals of the mean daily rain from 1 July, in tenths of a mm. 29 Feb shares 28 Feb.',
    cells_wanted: cells.size,
    cells: sorted,
  }) + '\n');
}

for (let b = 0; b < list.length; b += BATCH) {
  const batch = list.slice(b, b + BATCH);
  const lats = batch.map(([, c]) => c[0].toFixed(2)).join(',');
  const lons = batch.map(([, c]) => c[1].toFixed(2)).join(',');
  const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lats}&longitude=${lons}&start_date=1991-01-01&end_date=2020-12-31&daily=precipitation_sum&models=era5&timezone=Pacific%2FAuckland`;
  let res;
  let stop = false;
  for (let attempt = 0; attempt < 3; attempt++) {
    res = await fetch(url);
    if (res.status !== 429) break;
    const reason = (await res.json().catch(() => ({}))).reason || '';
    if (/hourly|daily/i.test(reason)) { console.log(`stopping: ${reason}`); stop = true; break; }
    console.log('minute limit, pausing 65 s');
    await new Promise((r) => setTimeout(r, 65000));
  }
  if (stop) break;
  if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
  let data = await res.json();
  if (!Array.isArray(data)) data = [data];
  data.forEach((d, i) => {
    out[batch[i][0]] = cumulativeNormal(d.daily.time, d.daily.precipitation_sum);
  });
  save();
  console.log(`${Object.keys(out).length}/${cells.size}`);
  await new Promise((r) => setTimeout(r, 40000));
}
save();
console.log(`wrote data/normals.json: ${Object.keys(out).length} of ${cells.size} cells`);
