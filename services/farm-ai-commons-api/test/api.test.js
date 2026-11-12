// The Worker end to end, with upstream calls answered from fixtures.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import worker from '../src/index.js';
import { handleRpc } from '../src/mcp.js';

const fx = (f) => readFileSync(new URL('./fixtures/' + f, import.meta.url), 'utf8');
const SECRET = 'testkey00000000000000000000000000';

function era5Json(from, to, perDay) {
  const time = [];
  const precipitation_sum = [];
  for (let d = new Date(from + 'T00:00:00Z'); d <= new Date(to + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + 1)) {
    time.push(d.toISOString().slice(0, 10));
    precipitation_sum.push(perDay);
  }
  return { latitude: -44.75, longitude: 170.5, daily: { time, precipitation_sum } };
}

function fakeFetch({ linzFails = false, era5Fails = false } = {}) {
  const calls = [];
  const f = async (url) => {
    const u = String(url);
    calls.push(u);
    if (u.includes('data.linz.govt.nz')) {
      if (linzFails) return new Response(`<x schemaLocation="https://data.linz.govt.nz/services;key=${SECRET}/x">bad</x>`, { status: 400 });
      return new Response(u.includes('layer-50772') ? fx('linz-parcel.json') : fx('linz-address.json'));
    }
    if (u.includes('gis.ecan.govt.nz')) return new Response(fx('ecan-sites.json'));
    if (u.includes('data.ecan.govt.nz')) return new Response(fx('ecan-405610.csv'));
    if (u.includes('open-meteo')) {
      if (era5Fails) return new Response('{"error":true}', { status: 429 });
      const p = new URL(u).searchParams;
      return new Response(JSON.stringify(era5Json(p.get('start_date'), p.get('end_date'), 1)));
    }
    return new Response('nope', { status: 404 });
  };
  f.calls = calls;
  return f;
}

async function call(path, { method = 'GET', body, opts } = {}) {
  const saved = globalThis.fetch;
  globalThis.fetch = fakeFetch(opts);
  try {
    const env = { TEST_TODAY: '2026-11-05', LINZ_LDS_KEY: SECRET, LIMITER: { limit: async () => ({ success: true }) } };
    const req = new Request('https://api.example' + path, { method, body: body ? JSON.stringify(body) : undefined, headers: { 'cf-connecting-ip': '1.2.3.4' } });
    const res = await worker.fetch(req, env, { waitUntil() {} });
    const text = await res.text();
    return { res, text, json: text ? JSON.parse(text) : null };
  } finally {
    globalThis.fetch = saved;
  }
}

test('GET / lists endpoints and attribution', async () => {
  const { res, json } = await call('/');
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('access-control-allow-origin'), '*');
  assert.ok(json.mcp.url.endsWith('/mcp'));
  assert.equal(json.attribution.length, 3);
});

test('find returns the address and its parcel with LINZ attribution', async () => {
  const { res, json } = await call('/api/find?address=101%20Bledisloe%20Street%2C%20Kurow');
  assert.equal(res.status, 200);
  assert.equal(json.matches[0].address, '101 Bledisloe Street, Kurow');
  assert.equal(json.matches[0].parcel.area_ha, 0.1);
  assert.match(json.attribution[0], /LINZ/);
});

test('bad input is a 400 with a usable message', async () => {
  assert.equal((await call('/api/find?address=a')).res.status, 400);
  const r = await call('/api/rain?lat=44&lon=170');
  assert.equal(r.res.status, 400);
  assert.match(r.json.error, /inside New Zealand/);
});

test('LINZ failure never leaks the key', async () => {
  const { res, text } = await call('/api/find?address=101%20Bledisloe%20Street', { opts: { linzFails: true } });
  assert.equal(res.status, 502);
  assert.ok(!text.includes(SECRET));
  assert.ok(!text.includes('key='));
});

test('card for an address joins all three sources', async () => {
  const { res, json } = await call('/api/card?address=101%20Bledisloe%20Street%2C%20Kurow');
  assert.equal(res.status, 200);
  assert.equal(json.gauge.site_no, 405610);
  assert.equal(json.gauge_rain.to, '2026-11-04');
  // 1 mm a day from 1 July to 31 Oct (5 days before 5 Nov) = 123 mm.
  assert.equal(json.era5.season_mm, 123);
  assert.equal(json.era5.to, '2026-10-31');
  assert.ok(json.era5.percent_of_normal > 0);
  assert.match(json.card, /Rain card for 101 Bledisloe Street, Kurow/);
  assert.equal(json.attribution.length, 3);
  // The same figures as rows, for the course player.
  assert.deepEqual(json.rows.map((r) => r.label), [
    'Nearest council rain gauge', 'Gauge rain since 1 July',
    'Climate grid rain since 1 July', 'Grid normal for those dates', 'Grid rain against normal',
  ]);
  assert.match(json.rows[1].value, /^\d+ mm \(to 4 Nov 2026\)$/);
  assert.equal(json.rows[2].value, '123 mm (to 31 Oct 2026)');
  assert.equal(json.rows[4].value, `${json.era5.percent_of_normal}% of normal`);
  for (const row of json.rows) {
    assert.ok(row.label.length <= 40 && row.value.length <= 60, `${row.label}: ${row.value}`);
    assert.ok(json.card.includes(row.value.match(/^\d+ mm/)?.[0] ?? ''), `${row.value} is in the card text`);
  }
});

test('card still comes back when ERA5 is down', async () => {
  const { res, json } = await call('/api/card?lat=-44.728&lon=170.467&place=Test%20farm', { opts: { era5Fails: true } });
  assert.equal(res.status, 200);
  assert.equal(json.era5, null);
  assert.match(json.card, /ERA5\): not available/);
  assert.deepEqual(json.missing, ['ERA5 normal (Open-Meteo did not answer)']);
  assert.deepEqual(json.rows.at(-1), { label: 'Climate grid (ERA5)', value: 'Not available right now' });
  assert.equal(json.rows.length, 3);
});

test('unknown path 404, wrong method 405, OPTIONS 204', async () => {
  assert.equal((await call('/nope')).res.status, 404);
  assert.equal((await call('/api/find', { method: 'POST', body: {} })).res.status, 405);
  assert.equal((await call('/mcp')).res.status, 405);
  assert.equal((await call('/api/find', { method: 'OPTIONS' })).res.status, 204);
});

test('rate limit answers 429', async () => {
  const env = { LIMITER: { limit: async () => ({ success: false }) } };
  const res = await worker.fetch(new Request('https://api.example/'), env, { waitUntil() {} });
  assert.equal(res.status, 429);
  assert.equal(res.headers.get('retry-after'), '60');
});

test('MCP initialize, list, call', async () => {
  const init = await call('/mcp', { method: 'POST', body: { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 't', version: '1' } } } });
  assert.equal(init.json.result.protocolVersion, '2025-06-18');
  assert.ok(init.json.result.capabilities.tools);

  const note = await call('/mcp', { method: 'POST', body: { jsonrpc: '2.0', method: 'notifications/initialized' } });
  assert.equal(note.res.status, 202);

  const list = await call('/mcp', { method: 'POST', body: { jsonrpc: '2.0', id: 2, method: 'tools/list' } });
  assert.deepEqual(list.json.result.tools.map((t) => t.name), ['find_farm', 'rain_since_july', 'rain_normal', 'make_rain_card']);

  const card = await call('/mcp', { method: 'POST', body: { jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'make_rain_card', arguments: { address: '101 Bledisloe Street, Kurow' } } } });
  assert.equal(card.json.result.isError, false);
  assert.match(card.json.result.content[0].text, /^Rain card for/);

  const bad = await call('/mcp', { method: 'POST', body: { jsonrpc: '2.0', id: 4, method: 'tools/call', params: { name: 'rain_normal', arguments: { lat: 1, lon: 2 } } } });
  assert.equal(bad.json.result.isError, true);

  const parse = await call('/mcp', { method: 'POST', body: undefined });
  assert.equal(parse.res.status, 400);
});

test('handleRpc rejects junk and unknown methods', async () => {
  assert.equal((await handleRpc({}, { foo: 1 })).error.code, -32600);
  assert.equal((await handleRpc({}, { jsonrpc: '2.0', id: 9, method: 'resources/list' })).error.code, -32601);
  assert.equal((await handleRpc({}, { jsonrpc: '2.0', id: 9, method: 'tools/call', params: { name: 'x' } })).error.code, -32602);
});

test('live normals stop at the daily budget for this data centre', async () => {
  const { era5Season, LIVE_NORMALS_PER_DAY } = await import('../src/sources.js');
  const store = new Map();
  const cache = {
    match: async (req) => (store.has(req.url) ? new Response(store.get(req.url)) : undefined),
    put: async (req, res) => { store.set(req.url, await res.text()); },
  };
  const f = fakeFetch();
  const ctx = { fetch: f, cache, today: '2026-11-04' };
  // Cells far from any baked one: each needs a live 30-year pull.
  const lats = Array.from({ length: LIVE_NORMALS_PER_DAY + 1 }, (_, i) => -36 - i * 0.25);
  for (const lat of lats.slice(0, -1)) assert.ok((await era5Season(ctx, lat, 175, ctx.today)).normal_mm > 0);
  await assert.rejects(era5Season(ctx, lats.at(-1), 175, ctx.today), /Open-Meteo/);
  assert.equal(f.calls.filter((u) => u.includes('start_date=1991')).length, LIVE_NORMALS_PER_DAY);
});
