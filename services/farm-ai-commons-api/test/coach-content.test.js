// Module 1's coach activities (modules/fac-01-what-ai-is/coach.json) against the lessons that
// use them and the limits of the course.platform coach Worker, which drops an activity it
// can't accept. The limits here are copied from workers/coach in course.platform.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { cardProblem } from '../scripts/coach-saved-check.mjs';

const DIR = new URL('../../../modules/fac-01-what-ai-is/', import.meta.url);
const coach = JSON.parse(readFileSync(new URL('coach.json', DIR), 'utf8'));
const lessons = readdirSync(DIR).filter((f) => f.endsWith('.md'));
const read = (f) => readFileSync(new URL(f, DIR), 'utf8');
const acts = Object.entries(coach.activities);

test('every coach block in a lesson has an activity, and every activity is used once', () => {
  const used = [];
  for (const f of lessons) {
    for (const m of read(f).matchAll(/^:::coach[ \t]+(\S+)[ \t]*$/gm)) used.push(m[1]);
  }
  assert.deepEqual([...used].sort(), Object.keys(coach.activities).sort());
  assert.equal(used.length, 5);
});

test('Module 1 has no reflection boxes left', () => {
  for (const f of lessons) assert.doesNotMatch(read(f), /reflection-block|reflection-prompt/, f);
});

test('each activity is inside the coach Worker\'s limits', () => {
  const max = (v, n, what) => assert.ok(typeof v === 'string' && v.length > 0 && v.length <= n, `${what}: ${String(v).length} of ${n}`);
  for (const [id, a] of acts) {
    assert.match(id, /^[a-z0-9][a-z0-9-]{0,63}$/, id);
    assert.ok(a.kind === 'chat' || a.kind === 'try', id);
    max(a.title, 80, `${id} title`);
    max(a.context, 1200, `${id} context`);
    assert.ok(a.lookFor.length >= 1 && a.lookFor.length <= 5, `${id} lookFor`);
    for (const l of a.lookFor) max(l, 160, `${id} lookFor`);
    for (const w of a.watchFor || []) max(w, 200, `${id} watchFor`);
    assert.ok((a.watchFor || []).length <= 3, `${id} watchFor`);
    if (a.kind === 'chat') {
      max(a.question, 300, `${id} question`);
      assert.ok((a.pushOn || '').length <= 200, `${id} pushOn`);
      assert.ok(a.turns >= 1 && a.turns <= 3, `${id} turns`);
      assert.ok(a.starters === undefined || (a.starters.length <= 4 && a.starters.every((s) => s.length <= 32)), `${id} starters`);
      max(a.example, 400, `${id} example`);
    } else {
      max(a.task, 300, `${id} task`);
      max(a.scope, 200, `${id} scope`);
      max(a.offTask, 200, `${id} offTask`);
      max(a.starterPrompt, 500, `${id} starterPrompt`);
      assert.ok(a.runs.length >= 1 && a.runs.length <= 4, `${id} runs`);
      for (const r of a.runs) {
        assert.match(r.id, /^[a-z0-9][a-z0-9-]{0,31}$/, `${id} run id`);
        max(r.label, 60, `${id} run label`);
        assert.ok(r.data.length <= 2 && r.data.every((d) => /^[a-z][a-z0-9_]{0,19}\.[a-z][a-z0-9_]{0,29}$/.test(d)), `${id} run data`);
      }
      assert.ok(a.maxRuns >= a.runs.length && a.maxRuns <= 5, `${id} maxRuns`);
      max(a.closing.question, 300, `${id} closing question`);
      max(a.closing.example, 400, `${id} closing example`);
    }
  }
});

test('learner-facing coach copy has no em or en dashes', () => {
  assert.doesNotMatch(JSON.stringify(coach), /[–—]/);
});

test('the rain activity names a saved-runs file inside the module', () => {
  assert.match(coach.activities['fac-01-rain'].saved, /^[a-z0-9-]+\/[a-z0-9-]+\.json$/);
});

test('the bake script saves a rain card only if the player will keep it', () => {
  const good = {
    place: 'Kurow district',
    made: '2026-12-07',
    rows: [
      { label: 'Nearest gauge', value: 'Kurow, 3 km' },
      { label: 'Gauge since 1 July', value: '212 mm to 6 Dec' },
      { label: 'Grid against normal', value: '118%' },
    ],
    text: 'RAIN CARD ...',
    attribution: 'Environment Canterbury',
  };
  assert.equal(cardProblem(good), '');
  // A gauge too far away is a fact about the place, so the card is still good.
  assert.equal(cardProblem({ ...good, rows: [{ label: 'Council gauge', value: 'None within 35 km' }, good.rows[2]] }), '');
  assert.match(cardProblem(null), /no rain card/);
  // The rain API before the card rows change: text only.
  assert.match(cardProblem({ ...good, rows: undefined }), /no rows/);
  assert.match(cardProblem({ ...good, rows: [] }), /no rows/);
  assert.match(cardProblem({ ...good, rows: [{ label: 'Nearest gauge' }] }), /no label or no value/);
  assert.match(cardProblem({ ...good, text: ' ' }), /no text/);
  assert.match(cardProblem({ ...good, made: '7 Dec 2026' }), /not a plain date/);
  assert.match(cardProblem({ ...good, rows: [{ label: 'Council gauge', value: 'Not available' }, good.rows[2]] }), /source was down.*Council gauge/);
  assert.match(cardProblem({ ...good, rows: [good.rows[0], { label: 'Climate grid', value: 'Not available' }] }), /source was down.*Climate grid/);
});
