// Bakes saved rain cards for the field-day districts into the Rain card widget,
// so it still has something to show if the live API can't be reached.
// Usage: node scripts/bake-fallback.mjs [api-base]
// Re-run it close to the field day so the saved figures are recent.

import { readFileSync, writeFileSync } from 'node:fs';
import { DISTRICTS } from './districts.mjs';

const API = (process.argv[2] || 'https://farm-ai-commons-api.mail-5bc.workers.dev').replace(/\/+$/, '');
const WIDGET = new URL('../../../widgets/fac-rain-card.html', import.meta.url);
const START = '/*FALLBACK*/';
const END = '/*END FALLBACK*/';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const districts = [];
let saved = null;

for (const d of DISTRICTS) {
  const place = `${d.name} district`;
  let body = null;
  for (let attempt = 1; attempt <= 3 && !body; attempt++) {
    const res = await fetch(`${API}/api/card?lat=${d.lat}&lon=${d.lon}&place=${encodeURIComponent(place)}`);
    if (res.ok) body = await res.json();
    else { console.log(`${d.id}: HTTP ${res.status}, attempt ${attempt}`); await sleep(5000 * attempt); }
  }
  if (!body) { console.log(`${d.id}: skipped`); continue; }
  if (body.missing?.length) console.log(`${d.id}: missing ${body.missing.join('; ')}`);
  // A town-centre point lands on a town section, which says nothing about a farm.
  const card = body.card.split('\n').filter((l) => !l.startsWith('Land parcel at this address')).join('\n');
  districts.push({
    id: d.id,
    name: d.name,
    card: {
      place, made: body.made, parcel: null, gauge: body.gauge, gauge_rain: body.gauge_rain, era5: body.era5,
      attribution: body.attribution, card,
    },
  });
  saved = body.made;
  console.log(`${d.id}: gauge ${body.gauge?.name ?? 'none'} ${body.gauge_rain?.total_mm ?? '-'} mm, ERA5 ${body.era5?.percent_of_normal ?? '-'}%`);
}

if (!districts.length) throw new Error('no district cards, widget left as it was');
const html = readFileSync(WIDGET, 'utf8');
const a = html.indexOf(START);
const b = html.indexOf(END);
if (a < 0 || b < a) throw new Error('fallback markers not found in the widget');
const json = JSON.stringify({ saved, districts }).replace(/</g, '\\u003c');
writeFileSync(WIDGET, html.slice(0, a + START.length) + json + html.slice(b));
console.log(`baked ${districts.length} districts, saved ${saved}`);
