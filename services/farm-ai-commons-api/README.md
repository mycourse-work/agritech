# Farm AI Commons course data API

A public, read-only Cloudflare Worker that serves the farm data used in the Farm AI Commons course. It answers plain HTTP for the course widgets and speaks MCP so farmers can add it to their own AI app as a connector.

- Live: https://farm-ai-commons-api.mail-5bc.workers.dev
- MCP connector address: https://farm-ai-commons-api.mail-5bc.workers.dev/mcp (streamable HTTP, stateless, JSON responses, no auth)

## Endpoints

| HTTP | MCP tool | What it returns |
| --- | --- | --- |
| `GET /api/find?address=` | `find_farm` | Up to 5 LINZ address matches, each with the parcel under it |
| `GET /api/rain?lat=&lon=` | `rain_since_july` | Nearest active ECan rain gauge within 35 km and its total since 1 July, by month |
| `GET /api/normal?lat=&lon=` | `rain_normal` | ERA5 rain since 1 July for the ~25 km grid cell, against the 1991-2020 normal for the same dates |
| `GET /api/card?address=` or `?lat=&lon=&place=` | `make_rain_card` | All of the above as one plain-text card to paste into any AI |

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

## Run and deploy

```sh
node --test test/                 # 24 tests, upstreams stubbed from test/fixtures
npm run build:normals             # optional, fills data/normals.json
wrangler deploy                   # needs the LINZ_LDS_KEY secret set (wrangler secret put, via stdin)
node scripts/bake-fallback.mjs    # saved district cards into widgets/fac-rain-card.html
```

Re-run `bake-fallback.mjs` shortly before a field day so the saved cards in the Rain card widget are recent.
