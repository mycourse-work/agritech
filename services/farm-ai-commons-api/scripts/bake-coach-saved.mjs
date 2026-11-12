// Bakes saved runs for the "Ask about your rain" activity (modules/fac-01-what-ai-is/coach.json,
// fac-01-rain), so the lesson still has real answers to show when the AI or the rain data can't
// be reached on the field day. Every answer in the file is a real one from the live coach: this
// script is a plain client of the course site, the same as a learner's device. It holds no key.
//
// Usage: node scripts/bake-coach-saved.mjs <course-origin> [consent-version]
//   e.g. node scripts/bake-coach-saved.mjs https://farm-ai-commons.mycourse.work
//
// Needs, all live first:
//   - the coach for the course (course.platform coach Worker, router hook, the tenant's
//     features.coach) and this module's coach.json synced
//   - the rain API with card rows deployed (agritech PR "rain card rows"). Without rows the
//     player drops every saved card, so this script refuses to save a card that has none.
//
// It makes about 24 AI calls (two runs and one coach note for each of 8 districts), which count
// against the tenant's coach budget. Re-run it close to the field day so the saved figures are
// recent, then commit the file.
//
// All or nothing: if any district can't be saved (the AI or a data source was down, or a card
// came back without its gauge or grid figures), the good file is left alone, what was made goes
// to a .partial.json beside it for you to read, and the script exits 1. Run it again later.
//
// How the player picks a set: by the learner's "Nearest town" (it must equal a district name
// here), else the first set, which is Kurow. The "area" of a set is the district name too, so it
// does not match the council area an address lookup gives.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { cardProblem } from './coach-saved-check.mjs';
import { DISTRICTS } from './districts.mjs';

const ORIGIN = (process.argv[2] || '').replace(/\/+$/, '');
if (!/^https:\/\/[a-z0-9.-]+$/i.test(ORIGIN)) {
  console.error('Usage: node scripts/bake-coach-saved.mjs <course-origin> [consent-version]');
  process.exit(2);
}
const CONSENT = Number(process.argv[3] || 1);

const COURSE = 'farm-ai-commons';
const MODULE = 'fac-01-what-ai-is';
const ACTIVITY = 'fac-01-rain';
const MODULE_DIR = new URL(`../../../modules/${MODULE}/`, import.meta.url);
// The learner on the day: the field day is a sheep and beef day.
const FARM_TYPE = 'Sheep and beef';
// The Worker lets a device make 12 calls a minute. Each district is its own device, paced well under that.
const PAUSE_MS = 6000;

const coach = JSON.parse(readFileSync(new URL('coach.json', MODULE_DIR), 'utf8'));
const activity = coach.activities?.[ACTIVITY];
if (!activity?.saved || !activity.starterPrompt) throw new Error(`${ACTIVITY} has no "saved" path or no starter prompt in coach.json`);
const [coldRun, cardRun] = activity.runs;
if (!coldRun || !cardRun || coldRun.data.length || !cardRun.data.length) throw new Error(`${ACTIVITY} should have a run with no data, then a run with data`);
const OUT = new URL(activity.saved, MODULE_DIR);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function call(path, device, body) {
  await sleep(PAUSE_MS);
  const res = await fetch(`${ORIGIN}/api/coach/${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: ORIGIN },
    body: JSON.stringify({ course: COURSE, module: MODULE, activity: ACTIVITY, device, ...body }),
  });
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
  return res.json();
}

async function bakeDistrict(d) {
  const device = `bake-${d.id}-${randomBytes(8).toString('hex')}`;
  const place = { lat: d.lat, lon: d.lon, label: `${d.name} district`, area: d.name };
  const profile = { farmType: FARM_TYPE, town: d.name };
  const prompt = activity.starterPrompt.replaceAll('{town}', d.name);

  const data = await call('data', device, { place });
  if (!data.card) throw new Error(`no rain card (${data.reason})`);
  const problem = cardProblem(data.card);
  if (problem) throw new Error(problem);

  // The player shows a coach note only on a run that has another run after it.
  const specs = [coldRun, cardRun];
  const runs = [];
  for (const [i, spec] of specs.entries()) {
    const withPlace = spec.data.length ? { place } : {};
    const run = await call('run', device, { consent: CONSENT, run: spec.id, n: i + 1, prompt, ...withPlace });
    if (!run.answer) throw new Error(`run ${spec.id}: no answer (${run.reason})`);
    if (run.offTask) throw new Error(`run ${spec.id}: the AI called the starter prompt off task`);
    let note = '';
    if (i < specs.length - 1) {
      const reply = await call('turn', device, {
        consent: CONSENT, mode: 'note', profile, run: { id: spec.id, n: i + 1, prompt, answer: run.answer, ...withPlace },
      });
      if (!reply.reply) throw new Error(`run ${spec.id}: no coach note (${reply.reason})`);
      note = reply.reply;
    }
    runs.push({ prompt, answer: run.answer, unbacked: run.unbacked || [], note });
  }
  return { area: d.name, label: d.name, card: data.card, runs };
}

const sets = [];
const skipped = [];
for (const d of DISTRICTS) {
  try {
    const set = await bakeDistrict(d);
    sets.push(set);
    console.log(`${d.id}: saved, card made ${set.card.made}, ${set.runs[0].unbacked.length} unbacked figures in the no-data answer`);
  } catch (err) {
    skipped.push(d.id);
    console.log(`${d.id}: NOT saved, ${err.message}`);
  }
}

if (!sets.length) {
  console.error('No district could be saved. Nothing written.');
  process.exit(1);
}
const saved = new Date().toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Pacific/Auckland' });
const body = `${JSON.stringify({ saved, sets }, null, 2)}\n`;
mkdirSync(new URL('.', OUT), { recursive: true });
if (skipped.length) {
  const partial = new URL(OUT.href.replace(/\.json$/, '.partial.json'));
  writeFileSync(partial, body);
  console.error(`${skipped.length} of ${DISTRICTS.length} districts were not saved (${skipped.join(', ')}).`);
  console.error(`${OUT.pathname} was left as it was. What was made is in ${partial.pathname}. Do not commit that file. Run this again later.`);
  process.exit(1);
}
writeFileSync(OUT, body);
console.log(`wrote ${sets.length} of ${DISTRICTS.length} districts to ${OUT.pathname}, saved ${saved}`);
console.log('Read every answer before you commit the file: these are shown to learners word for word.');
