// Rate limits for a room full of phones.
//
// A field day puts 120 phones behind one woolshed wifi address, and phones on mobile data often
// share an address too. A limit keyed by IP alone treats the whole room as one caller. So there
// are two layers:
//
//   1. Per session (fair share). A caller that sends a session id (?sid=...) gets its own small
//      bucket, so one phone stuck in a retry loop can't use up the room's allowance.
//   2. Per IP (ceiling). High on purpose. It stops a script, not a woolshed.
//
// A session id is made up by the caller, so it is never the wall. The per-IP ceiling and, for
// feedback, the daily budget are the walls.
//
// The coach Worker (course.platform workers/coach) calls this API from Cloudflare's own addresses.
// When it sends the shared key in x-coach-key, its calls are limited by the session id it passes on
// and skip the per-IP ceiling, so every farmer isn't lumped under one address.

export const DATA_PER_IP_PER_MIN = 600;
export const DATA_PER_SESSION_PER_MIN = 30;
export const FEEDBACK_PER_IP_PER_MIN = 300;

const SESSION_RE = /^[A-Za-z0-9_-]{16,64}$/;

/** A caller-made session id, or null when it's missing or the wrong shape. */
export function sessionId(value) {
  return typeof value === 'string' && SESSION_RE.test(value) ? value : null;
}

/** Same-length, constant-time string compare. */
function sameKey(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** True when the request carries the coach Worker's shared key (COACH_KEY secret, 24+ characters). */
export function fromCoach(env, request) {
  const key = env.COACH_KEY;
  return typeof key === 'string' && key.length >= 24 && sameKey(request.headers.get('x-coach-key'), key);
}

async function take(limiter, key) {
  if (!limiter) return true;
  const { success } = await limiter.limit({ key });
  return success === true;
}

/**
 * Data API limits. Returns null when the call may go ahead, or 'session' / 'ip' for the layer that
 * said no.
 */
export async function checkDataLimits(env, request) {
  const sid = sessionId(new URL(request.url).searchParams.get('sid'));
  if (sid && !(await take(env.SESSION_LIMITER, 'sid:' + sid))) return 'session';
  // The coach Worker has already limited this device. Don't count the room against one address.
  if (sid && fromCoach(env, request)) return null;
  const ip = request.headers.get('cf-connecting-ip') || 'unknown';
  return (await take(env.LIMITER, ip)) ? null : 'ip';
}
