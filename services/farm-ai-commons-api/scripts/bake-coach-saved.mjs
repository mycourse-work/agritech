// Bakes saved runs for the "Ask about your rain" activity (modules/fac-01-what-ai-is/coach.json,
// fac-01-rain), so the lesson still has real answers to show when the AI or the rain data can't
// be reached on the field day. Every answer in the file is a real one from the live coach: this
// script is a plain client of the course site, the same as a learner's device. It holds no key.
//
// Usage: node scripts/bake-coach-saved.mjs <course-origin> [consent-version]
//   e.g. node scripts/bake-coach-saved.mjs https://farm-ai-commons.mycourse.work
//
// Needs the coach to be live for the course (course.platform coach Worker, router hook and the
// tenant's features.coach) and this module's coach.json synced. It makes about 32 AI calls (two
// runs and two coach notes for each of 8 districts), which count against the tenant's coach
// budget. Re-run it close to the field day so the saved figures are recent, then commit the file.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
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

  const runs = [];
  for (const [i, spec] of [coldRun, cardRun].entries()) {
    const withPlace = spec.data.length ? { place } : {};
    const run = await call('run', device, { consent: CONSENT, run: spec.id, n: i + 1, prompt, ...withPlace });
    if (!run.answer) throw new Error(`run ${spec.id}: no answer (${run.reason})`);
    if (run.offTask) throw new Error(`run ${spec.id}: the AI called the starter prompt off task`);
    const note = await call('turn', device, {
      consent: CONSENT, mode: 'note', profile, run: { id: spec.id, n: i + 1, prompt, answer: run.answer, ...withPlace },
    });
    if (!note.reply) console.log(`${d.id}: run ${spec.id} has no coach note (${note.reason})`);
    runs.push({ prompt, answer: run.answer, unbacked: run.unbacked || [], note: note.reply || '' });
  }
  return { area: d.name, label: d.name, card: data.card, runs };
}

const sets = [];
for (const d of DISTRICTS) {
  try {
    const set = await bakeDistrict(d);
    sets.push(set);
    console.log(`${d.id}: saved, card made ${set.card.made}, ${set.runs[0].unbacked.length} unbacked figures in the no-data answer`);
  } catch (err) {
    console.log(`${d.id}: skipped, ${err.message}`);
  }
}

if (!sets.length) throw new Error('no district could be saved, nothing written');
const saved = new Date().toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Pacific/Auckland' });
mkdirSync(new URL('.', OUT), { recursive: true });
writeFileSync(OUT, `${JSON.stringify({ saved, sets }, null, 2)}\n`);
console.log(`wrote ${sets.length} of ${DISTRICTS.length} districts to ${OUT.pathname}, saved ${saved}`);
console.log('Read every answer before you commit the file: these are shown to learners word for word.');
