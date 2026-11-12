// Pure helpers: parsing, distance, season dates, normals and the rain card text.
// No network here, so everything in this file is covered by test/lib.test.js.

export const NZ_BOUNDS = { minLat: -47.5, maxLat: -34, minLon: 166, maxLon: 179 };
export const GAUGE_MAX_KM = 35;
export const GAUGE_ACTIVE_DAYS = 14;
export const GRID = 0.25;

export const ATTRIBUTION = {
  linz: 'Address and parcel: LINZ NZ Addresses and NZ Primary Parcels, CC BY 4.0 (data.linz.govt.nz).',
  ecan: 'Gauge rainfall: Environment Canterbury, CC BY 4.0, not for resale (data.ecan.govt.nz).',
  era5: 'Climate grid: ERA5 via Open-Meteo, CC BY 4.0. Contains modified Copernicus Climate Change Service information.',
};

export function inNZ(lat, lon) {
  return Number.isFinite(lat) && Number.isFinite(lon) &&
    lat >= NZ_BOUNDS.minLat && lat <= NZ_BOUNDS.maxLat &&
    lon >= NZ_BOUNDS.minLon && lon <= NZ_BOUNDS.maxLon;
}

export function haversineKm(lat1, lon1, lat2, lon2) {
  const r = Math.PI / 180;
  const dLat = (lat2 - lat1) * r;
  const dLon = (lon2 - lon1) * r;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.min(1, Math.sqrt(a)));
}

// ---------- dates (all NZ local, as YYYY-MM-DD strings) ----------

export function nzToday(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Pacific/Auckland', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}

export function addDays(iso, n) {
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function daysBetween(a, b) {
  return Math.round((Date.parse(b + 'T00:00:00Z') - Date.parse(a + 'T00:00:00Z')) / 86400000);
}

// The farming season here runs from 1 July.
export function seasonStart(todayIso) {
  const [y, m] = todayIso.split('-').map(Number);
  return `${m >= 7 ? y : y - 1}-07-01`;
}

// Day index within a 365-day season starting 1 July. 29 Feb shares 28 Feb's slot.
const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
export function seasonDayIndex(iso) {
  const m = Number(iso.slice(5, 7));
  let d = Number(iso.slice(8, 10));
  if (m === 2 && d === 29) d = 28;
  const order = [7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6];
  let idx = 0;
  for (const mm of order) {
    if (mm === m) return idx + d - 1;
    idx += MONTH_DAYS[mm - 1];
  }
  throw new Error('bad date ' + iso);
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export function prettyDate(iso) {
  return `${Number(iso.slice(8, 10))} ${MONTHS[Number(iso.slice(5, 7)) - 1]} ${iso.slice(0, 4)}`;
}

// ---------- ECan ----------

// Rain sites layer (ArcGIS JSON, outSR=4326) -> plain list. Inactive sites dropped.
export function parseEcanSites(json, nowMs = Date.now()) {
  const out = [];
  for (const f of json?.features ?? []) {
    const a = f.attributes ?? {};
    const g = f.geometry ?? {};
    if (!Number.isFinite(a.SITENUMBER) || !Number.isFinite(g.y) || !Number.isFinite(g.x)) continue;
    if (!a.LAST_SAMPLE || nowMs - a.LAST_SAMPLE > GAUGE_ACTIVE_DAYS * 86400000) continue;
    out.push({
      site_no: a.SITENUMBER,
      name: String(a.SITE || a.SITENAME || a.SITENUMBER).trim(),
      lat: g.y,
      lon: g.x,
      altitude_m: Number.isFinite(a.ALTITUDE) ? Math.round(a.ALTITUDE) : null,
    });
  }
  return out;
}

export function nearestGauge(sites, lat, lon, maxKm = GAUGE_MAX_KM) {
  let best = null;
  for (const s of sites) {
    const km = haversineKm(lat, lon, s.lat, s.lon);
    if (km <= maxKm && (!best || km < best.distance_km)) best = { ...s, distance_km: km };
  }
  if (best) best.distance_km = Math.round(best.distance_km * 10) / 10;
  return best;
}

// "site_no,DateTime,RainfallTotal" with rows like "413001,5/08/2026 12:00:00 AM,0" (d/m/yyyy).
export function parseEcanDailyCsv(text) {
  const rows = [];
  const lines = String(text).split(/\r?\n/);
  if (!/^site_no,DateTime,RainfallTotal/i.test(lines[0] || '')) throw new Error('unexpected ECan CSV header');
  for (const line of lines.slice(1)) {
    if (!line.trim()) continue;
    const [, dt, val] = line.split(',');
    const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(dt || '');
    if (!m) continue;
    const date = `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
    const mm = val === undefined || val.trim() === '' ? null : Number(val);
    rows.push({ date, mm: Number.isFinite(mm) ? mm : null });
  }
  return rows;
}

// Sum from season start up to and including the day before today (today is still filling in).
export function gaugeSeasonTotal(rows, startIso, todayIso) {
  const endIso = addDays(todayIso, -1);
  const expected = daysBetween(startIso, endIso) + 1;
  let total = 0;
  let reported = 0;
  let last = null;
  const byMonth = new Map();
  for (const r of rows) {
    if (r.date < startIso || r.date > endIso || r.mm === null) continue;
    total += r.mm;
    reported += 1;
    if (!last || r.date > last) last = r.date;
    const m = byMonth.get(r.date.slice(0, 7)) ?? { month: r.date.slice(0, 7), mm: 0, days_reported: 0 };
    m.mm += r.mm;
    m.days_reported += 1;
    byMonth.set(m.month, m);
  }
  const months = [...byMonth.values()]
    .sort((a, b) => (a.month < b.month ? -1 : 1))
    .map((m) => ({ ...m, mm: Math.round(m.mm * 10) / 10 }));
  return {
    from: startIso,
    to: last,
    total_mm: Math.round(total * 10) / 10,
    days_reported: reported,
    days_in_period: expected,
    months,
  };
}

// ---------- ERA5 ----------

export function snapToGrid(v, step = GRID) {
  return Math.round(v / step) * step;
}

export function cellKey(lat, lon) {
  return `${snapToGrid(lat).toFixed(2)},${snapToGrid(lon).toFixed(2)}`;
}

// Daily climatology from many years of daily totals: mean mm for each season day,
// then running total from 1 July. Returns 365 cumulative values in tenths of a mm.
export function cumulativeNormal(times, values) {
  const sum = new Array(365).fill(0);
  const n = new Array(365).fill(0);
  for (let i = 0; i < times.length; i++) {
    const v = values[i];
    if (v === null || v === undefined || !Number.isFinite(v)) continue;
    const idx = seasonDayIndex(times[i]);
    sum[idx] += v;
    n[idx] += 1;
  }
  const out = [];
  let run = 0;
  for (let i = 0; i < 365; i++) {
    run += n[i] ? sum[i] / n[i] : 0;
    out.push(Math.round(run * 10));
  }
  return out;
}

// Open-Meteo daily series -> season total up to the last day that has a value.
export function era5SeasonTotal(times, values) {
  let total = 0;
  let last = null;
  for (let i = 0; i < times.length; i++) {
    const v = values[i];
    if (v === null || v === undefined || !Number.isFinite(v)) continue;
    total += v;
    last = times[i];
  }
  return { to: last, total_mm: Math.round(total * 10) / 10 };
}

export function normalTo(cumTenths, iso) {
  return Math.round(cumTenths[seasonDayIndex(iso)]) / 10;
}

export function percentOf(value, normal) {
  if (!normal) return null;
  return Math.round((value / normal) * 100);
}

// ---------- the card ----------

function latLonText(lat, lon) {
  return `${Math.abs(lat).toFixed(2)} S ${lon.toFixed(2)} E`;
}

export function rainCardText({ place, parcel, gauge, gaugeRain, era5, today, gaugeFailed = false }) {
  const lines = [];
  lines.push(`Rain card for ${place} (made ${prettyDate(today)})`);
  if (parcel) {
    lines.push(`Land parcel at this address: ${parcel.appellation}, ${parcel.area_ha} ha (LINZ). An address finds one parcel, often the house lot, so the farm may be bigger.`);
  }
  lines.push('');
  lines.push(`Rain since 1 July ${era5?.from?.slice(0, 4) ?? gaugeRain?.from?.slice(0, 4) ?? ''}`.trim());
  if (gauge && gaugeRain && gaugeRain.to) {
    const alt = gauge.altitude_m !== null ? `, ${gauge.altitude_m} m above sea level` : '';
    lines.push(`- Nearest open council rain gauge: ${gauge.name} (ECan site ${gauge.site_no}), ${gauge.distance_km} km away${alt}.`);
    lines.push(`- Gauge total, ${prettyDate(gaugeRain.from)} to ${prettyDate(gaugeRain.to)}: ${fmtMm(gaugeRain.total_mm)} (${gaugeRain.days_reported} of ${gaugeRain.days_in_period} days reported).`);
    if (gaugeRain.months?.length) {
      lines.push(`- Gauge by month: ${gaugeRain.months.map((m) => `${MONTHS[Number(m.month.slice(5, 7)) - 1]} ${fmtMm(m.mm)}`).join(', ')}${gaugeRain.to.slice(0, 7) === gaugeRain.months.at(-1).month ? ` so far (to ${prettyDate(gaugeRain.to).slice(0, -5)})` : ''}.`);
    }
  } else if (gaugeFailed) {
    lines.push('- Council gauge rain: not available right now (the Environment Canterbury data service did not answer).');
  } else {
    lines.push(`- No open council rain gauge within ${GAUGE_MAX_KM} km. The card reads Environment Canterbury gauges for now; other regional councils show theirs on their own websites.`);
  }
  if (era5 && era5.to) {
    lines.push(`- Climate grid (ERA5, the nearest ~25 km climate grid cell, centred ${latLonText(era5.cell_lat, era5.cell_lon)}): ${fmtMm(era5.season_mm)} from ${prettyDate(era5.from)} to ${prettyDate(era5.to)}, which is ${era5.percent_of_normal}% of the 1991-2020 normal for those dates (${fmtMm(era5.normal_mm)}).`);
  } else {
    lines.push('- Climate grid (ERA5): not available right now.');
  }
  if (era5 && era5.to && gauge) {
    lines.push('- A gauge measures one spot. The grid cell averages about 25 km of country, hills included, so its totals run different from the gauge. Compare the gauge with itself and the grid cell with its own normal.');
  }
  lines.push('');
  lines.push('Please use this card when you answer my questions about rain on this farm. If a question needs data the card doesn\'t have, say so.');
  lines.push('');
  lines.push('Sources:');
  if (parcel || place) lines.push(`- ${ATTRIBUTION.linz}`);
  if (gauge) lines.push(`- ${ATTRIBUTION.ecan} Read ${prettyDate(today)}.`);
  if (era5) lines.push(`- ${ATTRIBUTION.era5}`);
  return lines.join('\n');
}

function fmtMm(v) {
  return `${Math.round(v)} mm`;
}

// The same figures as short rows, for an app that shows the card as a table (the course player's
// AI coach). At most 5 rows; a label is at most 40 characters and a value at most 60. They are
// kept short enough to sit on one line each on a 375 px phone (a long gauge name takes two).
export function rainCardRows({ gauge, gaugeRain, era5, gaugeFailed = false }) {
  const rows = [];
  if (gauge && gaugeRain && gaugeRain.to) {
    const away = `, ${gauge.distance_km} km`;
    rows.push({ label: 'Nearest gauge', value: `${clip(gauge.name, 60 - away.length)}${away}` });
    rows.push({ label: 'Gauge since 1 July', value: `${fmtMm(gaugeRain.total_mm)} to ${shortDate(gaugeRain.to)}` });
  } else if (gaugeFailed) {
    rows.push({ label: 'Council gauge', value: 'Not available' });
  } else {
    rows.push({ label: 'Council gauge', value: `None within ${GAUGE_MAX_KM} km` });
  }
  if (era5 && era5.to) {
    rows.push({ label: 'Climate grid since 1 July', value: fmtMm(era5.season_mm) });
    rows.push({ label: `Grid normal to ${shortDate(era5.to)}`, value: fmtMm(era5.normal_mm) });
    rows.push({ label: 'Grid against normal', value: `${era5.percent_of_normal}%` });
  } else {
    rows.push({ label: 'Climate grid', value: 'Not available' });
  }
  return rows;
}

// "2026-11-04" -> "4 Nov". The card's own date carries the year.
function shortDate(iso) {
  return prettyDate(iso).slice(0, -5);
}

function clip(text, max) {
  const s = String(text ?? '').replace(/\s+/g, ' ').trim();
  return s.length > max ? `${s.slice(0, max - 3).trimEnd()}...` : s;
}

// ---------- input cleaning ----------

// Keep letters (macrons folded), digits, spaces, commas, slashes and hyphens. Max 200 chars.
export function cleanAddress(raw) {
  const s = String(raw ?? '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^A-Za-z0-9 ,/\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (s.length < 3 || s.length > 200) return null;
  return s;
}

// Address text -> CQL filter on the ASCII full address. Each word must appear.
export function addressCql(clean) {
  const words = clean.split(/[ ,]+/).filter(Boolean).slice(0, 8);
  if (!words.length) return null;
  return words.map((w) => `full_address_ascii ILIKE '%${w.replace(/'/g, "''")}%'`).join(' AND ');
}
