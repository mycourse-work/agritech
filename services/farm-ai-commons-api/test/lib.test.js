import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  addressCql, cellKey, cleanAddress, cumulativeNormal, era5SeasonTotal, gaugeSeasonTotal, haversineKm,
  inNZ, nearestGauge, normalTo, nzToday, parseEcanDailyCsv, parseEcanSites, percentOf, rainCardRows, rainCardText,
  seasonDayIndex, seasonStart, snapToGrid,
} from '../src/lib.js';

const fx = (f) => readFileSync(new URL('./fixtures/' + f, import.meta.url), 'utf8');
const NOW = Date.parse('2026-11-05T00:00:00Z');
const KUROW = [-44.728, 170.4671];

test('haversine matches a known distance', () => {
  // Wellington to Christchurch airports, about 304 km great circle.
  const km = haversineKm(-41.3272, 174.8053, -43.4894, 172.5322);
  assert.ok(Math.abs(km - 304) < 3, `got ${km}`);
  assert.equal(haversineKm(-44, 170, -44, 170), 0);
});

test('parseEcanSites keeps active sites and drops stale ones', () => {
  const sites = parseEcanSites(JSON.parse(fx('ecan-sites.json')), NOW);
  assert.equal(sites.length, 4);
  assert.ok(!sites.some((s) => s.site_no === 999999));
  const mf = sites.find((s) => s.site_no === 405610);
  assert.equal(mf.name, 'Hakataramea at Mount Florence');
  assert.equal(mf.altitude_m, 397);
});

test('nearestGauge picks the closest active gauge within 35 km', () => {
  const sites = parseEcanSites(JSON.parse(fx('ecan-sites.json')), NOW);
  const g = nearestGauge(sites, ...KUROW);
  assert.equal(g.site_no, 405610);
  assert.ok(g.distance_km > 15 && g.distance_km < 25, `got ${g.distance_km}`);
  // Middle of Otago, far from any ECan gauge.
  assert.equal(nearestGauge(sites, -45.5, 169.5), null);
  // A closed gauge right on the point is ignored because it was dropped as stale.
  assert.notEqual(g.site_no, 999999);
});

test('nearestGauge respects the distance cap exactly', () => {
  const sites = [{ site_no: 1, name: 'A', lat: -44, lon: 170, altitude_m: 0 }];
  const near = [-44 + 34.9 / 111.2, 170];
  const far = [-44 + 35.2 / 111.2, 170];
  assert.ok(nearestGauge(sites, ...near));
  assert.equal(nearestGauge(sites, ...far), null);
});

test('parseEcanDailyCsv reads d/m/yyyy rows and blank values', () => {
  const rows = parseEcanDailyCsv('site_no,DateTime,RainfallTotal\n405610,5/08/2026 12:00:00 AM,4.5\n405610,6/08/2026 12:00:00 AM,\n');
  assert.deepEqual(rows, [{ date: '2026-08-05', mm: 4.5 }, { date: '2026-08-06', mm: null }]);
  assert.throws(() => parseEcanDailyCsv('<html>error</html>'), /header/);
});

test('gaugeSeasonTotal sums 1 July to yesterday only', () => {
  const rows = parseEcanDailyCsv(fx('ecan-405610.csv'));
  const t = gaugeSeasonTotal(rows, '2026-07-01', '2026-11-05');
  const manual = rows.filter((r) => r.date >= '2026-07-01' && r.date <= '2026-11-04').reduce((a, r) => a + r.mm, 0);
  assert.equal(t.total_mm, Math.round(manual * 10) / 10);
  assert.equal(t.days_in_period, 127);
  assert.equal(t.to, '2026-11-04');
  assert.ok(t.days_reported <= 127);
  assert.deepEqual(t.months.map((m) => m.month), ['2026-07', '2026-08', '2026-09', '2026-10', '2026-11']);
  const monthSum = t.months.reduce((a, m) => a + m.mm, 0);
  assert.ok(Math.abs(monthSum - t.total_mm) < 0.5);
});

test('season dates', () => {
  assert.equal(seasonStart('2026-11-05'), '2026-07-01');
  assert.equal(seasonStart('2027-03-01'), '2026-07-01');
  assert.equal(seasonStart('2026-07-01'), '2026-07-01');
  assert.equal(seasonDayIndex('2026-07-01'), 0);
  assert.equal(seasonDayIndex('2026-12-31'), 183);
  assert.equal(seasonDayIndex('2027-06-30'), 364);
  assert.equal(seasonDayIndex('2028-02-29'), seasonDayIndex('2028-02-28'));
  assert.match(nzToday(new Date('2026-11-04T12:30:00Z')), /^2026-11-05$/);
});

test('cumulativeNormal averages each day across years and runs from 1 July', () => {
  const times = [];
  const values = [];
  for (const y of [2001, 2002]) {
    for (let d = new Date(Date.UTC(y, 0, 1)); d.getUTCFullYear() === y; d.setUTCDate(d.getUTCDate() + 1)) {
      times.push(d.toISOString().slice(0, 10));
      values.push(y === 2001 ? 1 : 3); // mean 2 mm a day
    }
  }
  const cum = cumulativeNormal(times, values);
  assert.equal(cum.length, 365);
  assert.equal(cum[0], 20); // 2.0 mm on 1 July, in tenths
  assert.equal(cum[364], 7300);
  assert.equal(normalTo(cum, '2026-07-10'), 20);
});

test('era5SeasonTotal stops at the last day with data', () => {
  const t = era5SeasonTotal(['2026-07-01', '2026-07-02', '2026-07-03'], [1.2, 3, null]);
  assert.deepEqual(t, { to: '2026-07-02', total_mm: 4.2 });
});

test('grid snapping and percent', () => {
  assert.equal(snapToGrid(-44.728), -44.75);
  assert.equal(cellKey(-44.728, 170.4671), '-44.75,170.50');
  assert.equal(percentOf(70, 100), 70);
  assert.equal(percentOf(5, 0), null);
});

test('address cleaning and CQL', () => {
  assert.equal(cleanAddress('  101 Bledisloe St, Kurow  '), '101 Bledisloe St, Kurow');
  assert.equal(cleanAddress('Ōamaru'), 'Oamaru');
  assert.equal(cleanAddress("x'); DROP--"), 'x DROP--');
  assert.equal(cleanAddress('ab'), null);
  assert.equal(cleanAddress('a'.repeat(201)), null);
  const cql = addressCql("101 O'Neill Road");
  assert.ok(!cql.includes("O'N"));
  assert.equal(addressCql(cleanAddress('101 Bledisloe, Kurow')), "full_address_ascii ILIKE '%101%' AND full_address_ascii ILIKE '%Bledisloe%' AND full_address_ascii ILIKE '%Kurow%'");
});

test('inNZ bounds', () => {
  assert.ok(inNZ(-44.7, 170.4));
  assert.ok(!inNZ(44.7, 170.4));
  assert.ok(!inNZ(NaN, 170));
});

test('rain card text carries the review wording and sources', () => {
  const card = rainCardText({
    place: '101 Bledisloe Street, Kurow',
    parcel: { appellation: 'Section 2 Block III TN OF Kurow', area_ha: 0.1 },
    gauge: { name: 'Hakataramea at Mount Florence', site_no: 405610, distance_km: 19.9, altitude_m: 397 },
    gaugeRain: { from: '2026-07-01', to: '2026-11-04', total_mm: 168.4, days_reported: 127, days_in_period: 127, months: [{ month: '2026-07', mm: 30.2 }, { month: '2026-11', mm: 2 }] },
    era5: { cell_lat: -44.75, cell_lon: 170.5, from: '2026-07-01', to: '2026-10-30', season_mm: 210, normal_mm: 300, percent_of_normal: 70 },
    today: '2026-11-05',
  });
  assert.match(card, /nearest ~25 km climate grid cell/);
  assert.match(card, /often the house lot/);
  assert.match(card, /168 mm \(127 of 127 days reported\)/);
  assert.match(card, /70% of the 1991-2020 normal/);
  assert.match(card, /Gauge by month: Jul 30 mm, Nov 2 mm so far \(to 4 Nov\)\./);
  assert.match(card, /not for resale/);
  assert.match(card, /Copernicus/);
  assert.doesNotMatch(card, /[–—]/); // no en or em dashes
});

test('rain card rows are short and say what is missing', () => {
  const gauge = { name: 'Hakataramea at Mount Florence', site_no: 405610, distance_km: 19.9, altitude_m: 397 };
  const gaugeRain = { from: '2026-07-01', to: '2026-11-04', total_mm: 168.4 };
  const era5 = { from: '2026-07-01', to: '2026-10-30', season_mm: 210, normal_mm: 300, percent_of_normal: 70 };
  assert.deepEqual(rainCardRows({ gauge, gaugeRain, era5 }), [
    { label: 'Nearest council rain gauge', value: 'Hakataramea at Mount Florence, 19.9 km away' },
    { label: 'Gauge rain since 1 July', value: '168 mm (to 4 Nov 2026)' },
    { label: 'Climate grid rain since 1 July', value: '210 mm (to 30 Oct 2026)' },
    { label: 'Grid normal for those dates', value: '300 mm (1991-2020)' },
    { label: 'Grid rain against normal', value: '70% of normal' },
  ]);
  assert.deepEqual(rainCardRows({ gauge: null, gaugeRain: null, era5: null }), [
    { label: 'Council rain gauge', value: 'None within 35 km' },
    { label: 'Climate grid (ERA5)', value: 'Not available right now' },
  ]);
  assert.deepEqual(rainCardRows({ gauge: null, gaugeRain: null, era5, gaugeFailed: true })[0], { label: 'Council rain gauge', value: 'Not available right now' });
  // A long gauge name is cut so the value stays within 60 characters.
  const long = rainCardRows({ gauge: { ...gauge, name: 'A very long gauge name that goes on and on past what a phone row can hold' }, gaugeRain, era5 });
  assert.ok(long[0].value.length <= 60, long[0].value);
  assert.match(long[0].value, /\.\.\., 19\.9 km away$/);
  for (const row of long) assert.doesNotMatch(row.label + row.value, /[–—]/);
});

test('rain card without a gauge says so plainly', () => {
  const card = rainCardText({ place: 'Somewhere, Otago', parcel: null, gauge: null, gaugeRain: null, era5: null, today: '2026-11-05' });
  assert.match(card, /No open council rain gauge within 35 km/);
  assert.match(card, /ERA5\): not available/);
});
