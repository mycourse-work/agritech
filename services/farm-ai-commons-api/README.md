# AI for Farmers course data API

A public, read-only Cloudflare Worker that serves the farm data used in the AI for Farmers course (formerly Farm AI Commons). It answers plain HTTP for the course widgets and speaks MCP so farmers can add it to their own AI app as a connector.

- Live: https://farm-ai-commons-api.mail-5bc.workers.dev
- MCP connector address: https://farm-ai-commons-api.mail-5bc.workers.dev/mcp (streamable HTTP, stateless, JSON responses, no auth)

## Endpoints

| HTTP | MCP tool | What it returns |
| --- | --- | --- |
| `GET /api/find?address=` | `find_farm` | Up to 5 LINZ address matches, each with the parcel under it |
| `GET /api/rain?lat=&lon=` | `rain_since_july` | Nearest active ECan rain gauge within 35 km and its total since 1 July, by month |
| `GET /api/normal?lat=&lon=` | `rain_normal` | ERA5 rain since 1 July for the ~25 km grid cell, against the 1991-2020 normal for the same dates |
| `GET /api/card?address=` or `?lat=&lon=&place=` | `make_rain_card` | All of the above as one plain-text card to paste into any AI |

`POST /api/feedback` is for the course player only, not MCP: see [AI feedback](#ai-feedback-on-free-text-answers) below.

`GET /` lists the endpoints and the attribution lines. Every response carries `access-control-allow-origin: *`.

## Data and licences

- LINZ NZ Addresses (layer 123113) and NZ Primary Parcels (layer 50772), CC BY 4.0.
- Environment Canterbury rainfall by site, CC BY 4.0, not for resale.
- ERA5 via Open-Meteo, CC BY 4.0. Contains modified Copernicus Climate Change Service information.

Every response that uses a source carries its attribution line, and so does the card.

## Limits and caching

- 60 requests a minute per IP (Workers rate limiting binding, which is approximate).
- Cache API TTLs: LINZ 7 days, ECan site list 24 h, gauge rain 3 h, ERA5 season 12 h, ERA5 normals 30 days.
- 1991-2020 normals come from `data/normals.json` when a cell is baked in, otherwise they're fetched once and cached. `npm run build:normals` bakes the cells near active ECan gauges; it stops at Open-Meteo's hourly cap, so run it again later to finish.
- Upstream error bodies are never passed on. LINZ errors echo the API key, and a test checks it can't leak.

## AI feedback on free-text answers

The course's free-text questions (reflection blocks with `data-feedback-url` and `data-feedback-id`) post `{ "id", "answer" }` here when the learner taps **Get feedback**. The Worker looks up that question's rubric in `modules/fac-01-what-ai-is/feedback.json` (bundled at build time), asks Claude Haiku (`FEEDBACK_MODEL`, default `claude-haiku-5-5`) for one or two encouraging, specific lines, and returns `{ "feedback": "..." }`. The player shows that above the example answer.

- **Fallback:** anything that goes wrong returns `200 { "feedback": null }` and the player shows the example on its own. This covers no `ANTHROPIC_API_KEY`, the rate limit, the daily budget, a model error, a reply slower than 4.5 s or an empty reply. The player also gives up after 5 s.
- **Input:** the answer is capped at 500 characters (the player cuts it, and the Worker refuses longer ones). Unknown ids get a 404.
- **Prompt injection:** the answer goes inside `<learner_answer>` tags with `<` and `>` swapped for `‹ ›`, so it can't close the tag. The system prompt says the answer is data, never instructions. Replies are cut to plain text of 300 characters at most.
- **Limits:** `FEEDBACK_LIMITER` allows 5 a minute per IP. A Durable Object (`FeedbackBudget`, one global instance) counts model calls per NZ day and stops at `FEEDBACK_DAILY_USD / FEEDBACK_USD_PER_CALL`, which is 1,000 calls at the defaults of $2 and $0.002. If the counter can't be reached, there's no model call.
- **Thinking:** the request turns thinking off (`thinking: { type: "disabled" }`). Haiku 5.5 thinks by default, and on harder answers the thinking used up all 150 output tokens, so the learner got no feedback. If `FEEDBACK_MODEL` is set to Sonnet 5.5, the request sends `{ type: "between_tools" }` instead, because that model refuses `disabled`.
- **Cost:** a typical call is about 500 input and 50 output tokens. At $1/$5 per million tokens (the Haiku 4.5 list price; check Haiku 5.5's) that's about $0.0008 an answer. The worst case is under $0.002.
- **Privacy:** answers go to the Anthropic API and nowhere else. They aren't stored, and the only log line is `{ event, id, outcome }`.
- **Optional:** set `FEEDBACK_ORIGINS` (comma-separated host suffixes, e.g. `mycourse.work,thecolab.ai`) to refuse feedback for pages on other sites. It's unset by default because the preview runs on a changing trycloudflare host. The Origin header can be faked outside a browser, so the budget is the real guard.

Turn it on (the endpoint returns `null` until then):

```sh
wrangler secret put ANTHROPIC_API_KEY   # paste the key at the prompt (stdin), never as an argument
wrangler deploy                         # first deploy also creates the FeedbackBudget Durable Object
```

## Run and deploy

```sh
node --test test/                 # 41 tests, upstreams stubbed from test/fixtures
npm run build:normals             # optional, fills data/normals.json
wrangler deploy                   # needs the LINZ_LDS_KEY secret set (wrangler secret put, via stdin)
node scripts/bake-fallback.mjs    # saved district cards into widgets/fac-rain-card.html
```

Re-run `bake-fallback.mjs` shortly before a field day so the saved cards in the Rain card widget are recent.
