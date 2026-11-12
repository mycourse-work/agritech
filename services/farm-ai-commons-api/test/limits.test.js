// Field-day limits: 120 phones on one woolshed wifi share one IP address.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import worker from '../src/index.js';
import {
  checkDataLimits, DATA_PER_IP_PER_MIN, DATA_PER_SESSION_PER_MIN, FEEDBACK_PER_IP_PER_MIN, fromCoach, sessionId,
} from '../src/limits.js';

/** A counting limiter with the same shape as the Workers rate limiting binding (one window). */
function limiter(limit) {
  const used = new Map();
  return {
    used,
    limit: async ({ key }) => {
      const n = (used.get(key) ?? 0) + 1;
      used.set(key, n);
      return { success: n <= limit };
    },
  };
}

const COACH_KEY = 'coach-shared-key-0123456789abcdef';
const sid = (n) => 'phone-' + String(n).padStart(4, '0') + '-abcdefgh';
const get = (path, headers = {}) => new Request('https://api.example' + path, { headers: { 'cf-connecting-ip': '203.0.113.7', ...headers } });
const env = (extra = {}) => ({ LIMITER: limiter(DATA_PER_IP_PER_MIN), SESSION_LIMITER: limiter(DATA_PER_SESSION_PER_MIN), ...extra });

test('sessionId takes 16 to 64 url-safe characters and nothing else', () => {
  assert.equal(sessionId('abcdefghijklmnop'), 'abcdefghijklmnop');
  assert.equal(sessionId('a'.repeat(64)), 'a'.repeat(64));
  for (const bad of [null, undefined, '', 'short', 'a'.repeat(65), 'has space in it here', 'semi;colon;semi;colon', 42]) {
    assert.equal(sessionId(bad), null, String(bad));
  }
});

test('a woolshed: 120 phones on one IP each find a farm and get a card, with a retry, in one minute', async () => {
  const e = env();
  let refused = 0;
  for (let phone = 0; phone < 120; phone++) {
    for (const path of ['/api/find?address=x', '/api/card?lat=1&lon=2', '/api/card?lat=1&lon=2']) {
      if (await checkDataLimits(e, get(path + '&sid=' + sid(phone)))) refused++;
    }
  }
  assert.equal(refused, 0);
  assert.equal(e.LIMITER.used.get('203.0.113.7'), 360);
});

test('the old limit (60 a minute per IP) would have refused most of that room', async () => {
  const e = { LIMITER: limiter(60) };
  let refused = 0;
  for (let i = 0; i < 240; i++) if (await checkDataLimits(e, get('/api/find?address=x'))) refused++;
  assert.equal(refused, 180);
});

test('one phone stuck retrying is stopped by its own session bucket, and the room carries on', async () => {
  const e = env();
  const results = [];
  for (let i = 0; i < DATA_PER_SESSION_PER_MIN + 20; i++) results.push(await checkDataLimits(e, get('/api/card?lat=1&lon=2&sid=' + sid(1))));
  assert.equal(results.filter((r) => r === 'session').length, 20);
  assert.equal(results.filter((r) => r === null).length, DATA_PER_SESSION_PER_MIN);
  // Refused session calls don't eat the room's per-IP allowance.
  assert.equal(e.LIMITER.used.get('203.0.113.7'), DATA_PER_SESSION_PER_MIN);
  assert.equal(await checkDataLimits(e, get('/api/card?lat=1&lon=2&sid=' + sid(2))), null);
});

test('the per-IP ceiling still stops a script, with or without session ids', async () => {
  const e = env();
  let refused = 0;
  for (let i = 0; i < DATA_PER_IP_PER_MIN + 50; i++) {
    if ((await checkDataLimits(e, get('/api/find?address=x&sid=' + sid(i)))) === 'ip') refused++;
  }
  assert.equal(refused, 50);
  assert.equal(await checkDataLimits(e, get('/api/find?address=x')), 'ip');
});

test('no session id, or a bad one, is limited per IP only', async () => {
  const e = env();
  assert.equal(await checkDataLimits(e, get('/api/find?address=x')), null);
  assert.equal(await checkDataLimits(e, get('/api/find?address=x&sid=short')), null);
  assert.equal(e.SESSION_LIMITER.used.size, 0);
  assert.equal(e.LIMITER.used.get('203.0.113.7'), 2);
});

test('coach Worker calls with the shared key and a session id skip the per-IP ceiling', async () => {
  const e = env({ COACH_KEY, LIMITER: limiter(0) });
  const ok = get('/api/card?lat=1&lon=2&sid=' + sid(3), { 'x-coach-key': COACH_KEY });
  assert.equal(await checkDataLimits(e, ok), null);
  assert.equal(e.LIMITER.used.size, 0);
  // Still limited per session.
  const e2 = env({ COACH_KEY, SESSION_LIMITER: limiter(0) });
  assert.equal(await checkDataLimits(e2, get('/api/card?lat=1&lon=2&sid=' + sid(3), { 'x-coach-key': COACH_KEY })), 'session');
});

test('the shared key does nothing when it is wrong, missing, unset, too short, or sent with no session id', async () => {
  const blocked = (e, req) => checkDataLimits({ SESSION_LIMITER: limiter(99), LIMITER: limiter(0), ...e }, req);
  const withSid = '/api/card?lat=1&lon=2&sid=' + sid(4);
  assert.equal(await blocked({ COACH_KEY }, get(withSid, { 'x-coach-key': COACH_KEY.slice(0, -1) + 'x' })), 'ip');
  assert.equal(await blocked({ COACH_KEY }, get(withSid)), 'ip');
  assert.equal(await blocked({}, get(withSid, { 'x-coach-key': COACH_KEY })), 'ip');
  assert.equal(await blocked({ COACH_KEY: 'short' }, get(withSid, { 'x-coach-key': 'short' })), 'ip');
  assert.equal(await blocked({ COACH_KEY }, get('/api/card?lat=1&lon=2', { 'x-coach-key': COACH_KEY })), 'ip');
  assert.equal(fromCoach({ COACH_KEY: '' }, get('/', { 'x-coach-key': '' })), false);
});

test('the Worker answers 429 with retry-after from either layer, and never says a number that could go stale', async () => {
  for (const e of [
    { LIMITER: limiter(0) },
    { LIMITER: limiter(99), SESSION_LIMITER: limiter(0) },
  ]) {
    const res = await worker.fetch(get('/?sid=' + sid(5)), e, { waitUntil() {} });
    assert.equal(res.status, 429);
    assert.equal(res.headers.get('retry-after'), '60');
    assert.doesNotMatch((await res.json()).error, /\d/);
  }
});

test('a missing limiter binding does not block the data API (same as before)', async () => {
  const res = await worker.fetch(get('/?sid=' + sid(6)), {}, { waitUntil() {} });
  assert.equal(res.status, 200);
  assert.match((await res.json()).about, new RegExp(DATA_PER_IP_PER_MIN + ' requests a minute'));
});

test('wrangler.toml limits match the constants in src/limits.js', () => {
  const toml = readFileSync(new URL('../wrangler.toml', import.meta.url), 'utf8');
  const limitOf = (name) => {
    const block = toml.slice(toml.indexOf(`name = "${name}"`));
    return Number(/limit = (\d+)/.exec(block)[1]);
  };
  assert.equal(limitOf('LIMITER'), DATA_PER_IP_PER_MIN);
  assert.equal(limitOf('SESSION_LIMITER'), DATA_PER_SESSION_PER_MIN);
  assert.equal(limitOf('FEEDBACK_LIMITER'), FEEDBACK_PER_IP_PER_MIN);
  // 120 farmers, 7 questions, three goes each, all inside one minute, all from one address.
  assert.ok(FEEDBACK_PER_IP_PER_MIN >= 120 * 2);
  assert.ok(DATA_PER_IP_PER_MIN >= 120 * 3);
  // Namespaces must be different or the buckets are shared.
  const ids = [...toml.matchAll(/namespace_id = "(\d+)"/g)].map((m) => m[1]);
  assert.equal(new Set(ids).size, ids.length);
});

test('the rain card widget sends a session id on every data call', () => {
  const html = readFileSync(new URL('../../../widgets/fac-rain-card.html', import.meta.url), 'utf8');
  assert.match(html, /"sid="\+SID/);
  // Sent as a query parameter, so no new request header and no CORS preflight.
  assert.doesNotMatch(html, /x-session|x-sid/i);
});
