// Farm AI Commons course data API: public, read-only HTTP + MCP on one Worker.

import { ATTRIBUTION } from './lib.js';
import { BadInput, findFarm, makeRainCard, rainNormal, rainSinceJuly, readLatLon } from './ops.js';
import { handleRpc, SERVER_INFO, TOOLS } from './mcp.js';
import { UpstreamError } from './sources.js';
import { feedback } from './feedback.js';
import { checkDataLimits, DATA_PER_IP_PER_MIN } from './limits.js';

export { FeedbackBudget } from './feedback.js';

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, OPTIONS',
  'access-control-allow-headers': 'content-type, accept, mcp-protocol-version, mcp-session-id',
  'access-control-max-age': '86400',
};

function json(body, status = 200, extra = {}) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'x-content-type-options': 'nosniff', ...CORS, ...extra },
  });
}

function about(origin) {
  return {
    name: SERVER_INFO.title,
    about: `Read-only New Zealand farm data for the Farm AI Commons course (thecolab.ai). Free to use, ${DATA_PER_IP_PER_MIN} requests a minute.`,
    http: {
      find_farm: `${origin}/api/find?address=101%20Bledisloe%20Street%2C%20Kurow`,
      rain_since_july: `${origin}/api/rain?lat=-44.728&lon=170.467`,
      rain_normal: `${origin}/api/normal?lat=-44.728&lon=170.467`,
      make_rain_card: `${origin}/api/card?address=101%20Bledisloe%20Street%2C%20Kurow`,
      feedback: `POST ${origin}/api/feedback with JSON { id, answer } (course player only)`,
    },
    mcp: { url: `${origin}/mcp`, transport: 'streamable HTTP (stateless, JSON responses)', tools: TOOLS.map((t) => t.name) },
    attribution: Object.values(ATTRIBUTION),
  };
}

async function route(request, ctx) {
  const url = new URL(request.url);
  const p = url.pathname.replace(/\/+$/, '') || '/';
  const q = url.searchParams;

  if (p === '/mcp') {
    if (request.method !== 'POST') return json(error405(), 405, { allow: 'POST, OPTIONS' });
    let body;
    try {
      const text = await request.text();
      if (text.length > 20000) return json({ jsonrpc: '2.0', id: null, error: { code: -32600, message: 'Request too large' } }, 413);
      body = JSON.parse(text);
    } catch {
      return json({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } }, 400);
    }
    if (Array.isArray(body)) {
      if (body.length > 10) return json({ jsonrpc: '2.0', id: null, error: { code: -32600, message: 'Batch too large' } }, 400);
      const out = (await Promise.all(body.map((m) => handleRpc(ctx, m)))).filter(Boolean);
      return out.length ? json(out) : new Response(null, { status: 202, headers: CORS });
    }
    const out = await handleRpc(ctx, body);
    return out ? json(out) : new Response(null, { status: 202, headers: CORS });
  }

  if (p === '/api/feedback') {
    if (request.method !== 'POST') return json({ error: 'Use POST with JSON: { "id": "...", "answer": "..." }.' }, 405, { allow: 'POST, OPTIONS' });
    const [status, body] = await feedback(ctx, request);
    return json(body, status, { 'cache-control': 'no-store' });
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') return json({ error: 'Use GET.' }, 405, { allow: 'GET, OPTIONS' });

  switch (p) {
    case '/':
      return json(about(url.origin));
    case '/api/find':
      return json(await findFarm(ctx, q.get('address')));
    case '/api/rain':
      return json(await rainSinceJuly(ctx, ...readLatLon(q.get('lat'), q.get('lon'))));
    case '/api/normal':
      return json(await rainNormal(ctx, ...readLatLon(q.get('lat'), q.get('lon'))));
    case '/api/card':
      return json(await makeRainCard(ctx, {
        address: q.get('address') ?? undefined,
        lat: q.get('lat') ?? undefined,
        lon: q.get('lon') ?? undefined,
        place: q.get('place') ?? undefined,
      }));
    default:
      return json({ error: 'Not found. See / for the list of endpoints.' }, 404);
  }
}

function error405() {
  return { error: 'The MCP endpoint takes POST requests with JSON-RPC. Add this URL to your AI app as a custom connector.' };
}

export default {
  async fetch(request, env, execCtx) {
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });

    // Two layers (src/limits.js): a small bucket per session id, and a high ceiling per IP so a
    // woolshed of phones on one wifi address isn't treated as one caller.
    if (await checkDataLimits(env, request)) {
      return json({ error: 'Too many requests. Wait a minute and try again.' }, 429, { 'retry-after': '60' });
    }

    const ctx = {
      env,
      fetch: (u, init) => fetch(u, init),
      cache: typeof caches !== 'undefined' ? caches.default : null,
      waitUntil: (pr) => execCtx.waitUntil(pr),
      // Tests pin the date. Never set in production.
      today: env.TEST_TODAY || undefined,
      nowMs: env.TEST_TODAY ? Date.parse(env.TEST_TODAY + 'T00:00:00Z') : undefined,
    };
    try {
      return await route(request, ctx);
    } catch (e) {
      if (e instanceof BadInput) return json({ error: e.message }, 400);
      if (e instanceof UpstreamError) return json({ error: e.message, source: e.source }, 502);
      return json({ error: 'Something went wrong on the course data server.' }, 500);
    }
  },
};
