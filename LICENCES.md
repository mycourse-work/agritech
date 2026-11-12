# Licences and third-party terms: Farm AI Commons Module 1

**This is a checklist, not legal advice.** It lists what Module 1 (`modules/fac-01-what-ai-is`, the course page in `courses/farm-ai-commons` and the `fac-*` widgets) uses from other people, and what their terms say. Terms pages were read on 5–6 Nov 2026 and quotes are marked "checked 6 Nov 2026". Where a page didn't say, or we couldn't read it, this file says so instead of guessing. Get a lawyer to look before anything commercial depends on it.

**Where this file lives and why.** At the repo root, on purpose. The `sync-to-r2` workflow (`.github/workflows/sync-to-r2.yml` here calls the shared one in `mycourse-work/.github`, which we read on 6 Nov 2026) only uploads files changed under `modules/`, `courses/` and `widgets/`. The player only reads `course.json`, module manifests and the lesson files they list (RESEARCH.md section 1). So this file is never published to learners. Don't move it into `modules/` or `courses/`.

**Out of scope:** the other module, `modules/ai-for-farmers-intro-build-a-helper`, and the mycourse.work platform itself (Clerk sign-in, R2, D1, router).

**Not shipped (dev and QA only):** Wrangler, Playwright, faster-whisper, wav2vec2 phoneme checks, ffmpeg/x264 and headless Chromium used to render the videos. None of these reach learners, and the videos they render are our output.

## Summary

| Item | Used for | Licence | Commercial use OK? | Attribution | Status |
|---|---|---|---|---|---|
| LINZ NZ Addresses + NZ Primary Parcels | Address lookup, parcel in the rain card and connector | CC BY 4.0; LDS terms | Yes (CC BY 4.0) | Required, set wording | Needs action |
| Environment Canterbury rain gauges | Gauge rainfall, sites | CC BY 4.0 + ECan Data Usage Terms | Yes, with conditions (no ads without permission, keep current) | Required | Needs action |
| ERA5 (Copernicus) via Open-Meteo | Season rain, 30-year normals, baked `normals.json` | Data CC BY 4.0; Open-Meteo API free tier is non-commercial | Data yes; free API only if non-commercial | Required, plus a link to Open-Meteo | **Needs Adam's decision** |
| Cloudflare Workers (workers.dev) | Hosts the Farm AI Commons API | Cloudflare Self-Serve Agreement, Free plan | Not banned on Free | None | Needs action (personal subdomain) |
| Cloudflare Quick Tunnel | Preview only | Cloudflare docs | Testing only | None | OK (preview only) |
| Playfair Display (font) | Headings in the 4 widgets (inlined subset), card PDF | SIL OFL 1.1, Reserved Font Name in our copy | Yes | Licence text must go with the font | Needs action |
| Inter (font) | Body text in card PDF; named in widget CSS | SIL OFL 1.1, no RFN | Yes | Licence text with embedded copies | OK (note below) |
| Fonts in videos and images | Text rendered to pixels | SIL OFL 1.1 | Yes | None needed | OK |
| ElevenLabs voice "Paul" | Voiceover for the four lesson videos | ElevenLabs ToS + Voice Library Addendum | Paid plans only | Not stated | **Needs Adam's decision** (which account) |
| Music | Video soundtrack | Our own (made in code, `music.py`) | Yes | None | OK |
| Lesson pictures (GPT Image 2.5) | 10 lesson images, cover, posters, card | OpenAI terms (couldn't read) | Unverified | Unverified | Needs action |
| The Colab brand | Colours, sunburst style, fonts | Ours | Yes | None | OK |
| Product names (ChatGPT, Gemini, Claude, Copilot, Amazon Quick) | Plain text in lessons 1, 4 and 5, the lesson 1 and 4 videos, the quiz and the course welcome page | Each owner's trademark rules | Factual mention only | No logos, no implied link | Needs action (small) |
| Quoted facts and figures | Rain card example, plan details | Our API output, vendor docs | Yes | Already sourced | OK |

## LINZ: NZ Addresses and NZ Primary Parcels

- **Use:** the API (`services/farm-ai-commons-api/src/sources.js`) calls LINZ WFS layers 123113 (NZ Addresses) and 50772 (NZ Primary Parcels) live, using our LDS API key. Results show in the rain card (`widgets/fac-rain-card.html`) and through the MCP connector (lesson 5). Test fixtures in `services/farm-ai-commons-api/test/fixtures` hold small LINZ extracts.
- **Licence:** Creative Commons Attribution 4.0 International, shown on both layer pages: <https://data.linz.govt.nz/layer/123113-nz-addresses/> and <https://data.linz.govt.nz/layer/50772-nz-primary-parcels/>. Layer pages: "You may use this work for commercial purposes." Checked 6 Nov 2026.
- **Attribution:** LINZ asks for set wording (<https://www.linz.govt.nz/products-services/data/licensing-and-using-data/attributing-linz-data>): "Sourced from the LINZ Data Service and licensed for reuse under the CC BY 4.0 licence", or for changed data "Contains data sourced from the LINZ Data Service licensed for reuse under CC BY 4.0". Ours, in `src/lib.js`, reads "Address and parcel: LINZ NZ Addresses and NZ Primary Parcels, CC BY 4.0 (data.linz.govt.nz)." Close, but not the asked-for wording. It is shown in the rain card's "Sources and notes" and in every API response.
- **LDS site terms:** the LINZ Data Service runs on Koordinates, whose terms (<https://koordinates.com/terms-of-use/>, 20 June 2022) say an account is personal to one person, and that you must not sub-license or resell rights or give access to unauthorised people. It isn't clear whether running a public API on one person's key, that passes LINZ data through to anyone, is fine under those site terms. The data licence itself (CC BY 4.0) allows it.
- **Cost:** free.
- **Status:** needs action.
- **Recommended action:** switch the attribution string to LINZ's wording (an API change, not in this lane). Ask LINZ whether a public pass-through API is fine and how a business should hold the key. Koordinates IDs are personal (clause 15: "A single Koordinates ID shared by multiple people (including by and within a Business) is not permitted"), so until LINZ answers, keep the key on one named Colab staff member's own ID.

## Environment Canterbury: rain gauges

- **Use:** the API reads ECan's ArcGIS sites layer (FeatureServer/5) and the rainfall CSV on data.ecan.govt.nz (method 78). The rain card shows the nearest gauge's totals. `scripts/bake-fallback.mjs` baked fallback district cards into `widgets/fac-rain-card.html` on 5 Nov 2026 with ECan figures. Test fixtures hold small extracts.
- **Licence:** the data.ecan.govt.nz footer: "All data unless specifically stated is licensed under a Creative Commons Attribution 4.0 International License." The Data Usage Terms (<https://data.ecan.govt.nz/Catalogue/Agreement>, checked 6 Nov 2026) add conditions:
  - credit Environment Canterbury, and don't use ECan's branding or logo without agreement;
  - "any application development using the information will not contain any advertising unless prior permission" is given;
  - data that is publicly displayed must be "updated so that it is current at all times or is removed";
  - an indemnity, and a note that recent data is provisional.
- **Commercial use:** allowed under CC BY 4.0, within the conditions above. We found **no "not for resale" wording** on the portal or in the Data Usage Terms. Our attribution string says "not for resale", and so did an earlier review, but we couldn't find a source for it.
- **Attribution:** "Gauge rainfall: Environment Canterbury, CC BY 4.0, not for resale (data.ecan.govt.nz)." Shown in the rain card and API responses.
- **Cost:** free.
- **Status:** needs action.
- **Recommended action:** take "not for resale" out of the string unless someone finds where it came from. Keep the course and widget ad-free, or ask ECan first. The baked fallback cards are dated 5 Nov 2026 figures: either re-bake them on a schedule, or label them clearly as an example from that date, so they don't break the "current at all times" clause.

## ERA5 via Open-Meteo: season rain and 30-year normals

- **Use:** the API calls the Open-Meteo archive API (`archive-api.open-meteo.com`, `models=era5`) live for this season's rain, and used it to bake 30-year normals into `services/farm-ai-commons-api/data/normals.json` (65 of 146 cells, 5 Nov 2026). The rain card's baked fallback cards also hold ERA5 figures.
- **Data licence:** ERA5 is Copernicus Climate Change Service data. The CDS dataset page lists "Licence: CC-BY" (<https://cds.climate.copernicus.eu/datasets/reanalysis-era5-single-levels>; version not shown on the page). Open-Meteo says its data is CC BY 4.0 (<https://open-meteo.com/en/licence>). Checked 6 Nov 2026. The Copernicus licence also says not to imply endorsement by ECMWF or the EU (read in research on 5 Nov; the review didn't re-check it).
- **Open-Meteo API terms** (<https://open-meteo.com/en/terms>, checked 6 Nov 2026): the free API is for non-commercial use only. Their list of non-commercial uses includes "Use in educational content". Their list of commercial uses includes "Commercial products or promotional activities" and "Websites or apps that have subscriptions or display advertisements". Free limits: 10,000 calls a day, 5,000 an hour, 600 a minute, and 300,000 a month (not enforced yet, says the pricing FAQ).
- **Is our course commercial?** Unclear. It's free to learners with no ads, which leans non-commercial ("educational content"). But it's run by a company and helps promote The Colab, which could count as "promotional activities". The terms don't settle it. That's a call for Adam.
- **Attribution:** Open-Meteo: "You must include a link next to any location Open-Meteo data are displayed", for example `<a href="https://open-meteo.com/">Weather data by Open-Meteo.com</a>`. Our string, "Climate grid: ERA5 via Open-Meteo, CC BY 4.0. Contains modified Copernicus Climate Change Service information.", names Open-Meteo but **has no link**. Lesson 5 names "ERA5 / Copernicus via Open-Meteo (CC BY 4.0)" in "Where the data comes from", also without a link.
- **Options and costs:**
  1. **Keep the free tier as non-commercial "educational content".** $0. Add the Open-Meteo link. Risk: Open-Meteo may see a company-run course as commercial.
  2. **Pay Open-Meteo.** The pricing page (<https://open-meteo.com/en/pricing>) says "Historical, climate, ensemble, and satellite radiation APIs require the Professional API Plan or higher", so the Standard plan chosen for the El Niño tracker in Oct (later changed back to the free tier) **would not cover** our ERA5 calls. Professional is 5M calls a month. The page didn't show prices when we read it, so get a quote before deciding.
  3. **Get ERA5 another way.** Open-Meteo publishes its data on the AWS Open Data Registry (<https://registry.opendata.aws/open-meteo/>, CC BY 4.0, public S3 bucket, no sign-in), or we could pull ERA5 from the Copernicus CDS ourselves (free account). Either is $0 for data, plus build time and some storage or Worker cost, and drops the Open-Meteo API terms altogether.
- **Status:** needs Adam's decision.
- **Recommended action:** add the Open-Meteo link now whichever option is chosen. For a company-run course, option 3 (AWS bucket or CDS, then bake) is the cleanest long-term, because the normals are baked anyway and only the live season total needs a fresh call.

## Cloudflare: API hosting and preview tunnel

- **Use:** the API runs on Cloudflare Workers at `farm-ai-commons-api.mail-5bc.workers.dev`, a personal workers.dev subdomain, on the Free plan, with a rate-limit binding and the Cache API (`services/farm-ai-commons-api/wrangler.toml`). That address is in lesson 5 and the rain card. The course itself is hosted on our mycourse.work platform (out of scope). Previews use a Cloudflare Quick Tunnel (trycloudflare.com).
- **Terms:** Cloudflare Self-Serve Subscription Agreement (<https://www.cloudflare.com/terms/>, checked 6 Nov 2026). We found nothing banning business use on the Free plan. Section 2.6: "We will have no liability for any harm or damage arising out of or in connection with any Free Services", and Cloudflare can end Free services at its sole discretion, with no service levels. Workers Free allows 100,000 requests a day; past that, requests fail (error 1027) (<https://developers.cloudflare.com/workers/platform/limits/>). Workers Paid starts at US$5 a month with 10M requests included (<https://developers.cloudflare.com/workers/platform/pricing/>). The docs we read didn't say whether the rate-limit binding is on Free. Quick Tunnels: "Quick Tunnels are for testing and development", with no uptime guarantee (<https://developers.cloudflare.com/tunnel/get-started/quick-tunnels/>).
- **Commercial use OK?** Yes as far as we can tell.
- **Attribution:** none.
- **Cost:** $0 now; US$5 a month if we need Paid.
- **Status:** needs action. The address learners paste into their AI tool sits on one person's subdomain and account, and Free stops at 100,000 requests a day.
- **Recommended action:** move the Worker to a Colab-owned account and a custom domain (for example `api.farmaicommons.nz` or a `mycourse.work` subdomain) before launch, then update lesson 5 and the rain card in a later lane. Keep Quick Tunnels for previews only.

## Fonts: Playfair Display and Inter

- **Use:**
  - The 4 `fac-*` widgets inline a Latin subset of Playfair Display as base64 (`widgets-src/fonts/playfair-display-latin-sub.woff2` in the job folder). Its metadata keeps the family name "Playfair Display" and says: 'Copyright 2017 The Playfair Display Project Authors (https://github.com/clauseggers/Playfair-Display), with Reserved Font Name "Playfair Display".' The licence fields are empty.
  - The widget CSS names Inter first in the body stack but doesn't inline it, so learners see Inter only if they already have it.
  - The card PDF (`assets/fac-first-5-questions.pdf`) embeds subsets of Inter and Playfair Display.
  - The videos, posters and pictures have Inter and Playfair text rendered into pixels.
- **Licence:** SIL Open Font License 1.1 (<https://openfontlicense.org/open-font-license-official-text/>, checked 6 Nov 2026).
  - Condition 2: the copyright notice and licence must go with each copy, and "can be included either as stand-alone text files, human-readable headers or in the appropriate machine-readable metadata fields".
  - Condition 3: a Modified Version can't use a Reserved Font Name. The OFL FAQ (<https://openfontlicense.org/ofl-faq/>, 2.6) says subsetting a web font counts as modifying it, which "would not normally allow the use of RFNs".
  - FAQ 1.12: embedding a full or subset font in a PDF is fine.
  - FAQ 1.1 and 1.1.2: using the font to make graphics (1.1 names video titling) needs no permission, and acknowledgement is not required.
  - Today's Playfair (v2, <https://github.com/clauseggers/Playfair/blob/master/OFL.txt>) declares no Reserved Font Name. But our subset came from an older release that does, and it keeps the name.
  - Inter's OFL declares no Reserved Font Name (<https://github.com/rsms/inter/blob/master/LICENSE.txt>).
- **Commercial use OK?** Yes.
- **Attribution:** the licence must travel with embedded copies. No on-screen credit is needed.
- **Cost:** free.
- **Status:** Playfair in the widgets needs action. The PDF, videos and pictures are OK. Inter is OK, but its PDF copy has no licence text either. That is low risk; fix it next time the card is rebuilt.
- **Recommended action:** in a widget lane, either re-subset from the current Playfair v2 release (no RFN), or rename the family in the subset (for example "FAC Serif"). Also put the copyright and OFL notice in the font's metadata or a comment next to the base64. Not changed here because this lane doesn't touch widgets.

## ElevenLabs: voiceover ("Paul")

- **Use:** all four lesson videos (`assets/fac-l1.mp4` to `fac-l4.mp4`) use ElevenLabs text-to-speech: voice "Paul" (`hp7ETPcMxGdsmsPtJd8I`), model `eleven_multilingual_v2`, made with `tools/video/tts.py` in the job folder. That's about 7,800 characters, last made 5 Nov 2026. The key was added on 4 Nov from a different ElevenLabs account to the earlier films. Paul is a shared Voice Library voice (a "professional" clone that another user shares, with a 0-day notice period).
- **Terms:** ElevenLabs Terms of Service (<https://elevenlabs.io/terms-of-use>, checked 6 Nov 2026):
  - section 1(c): Free users "may only use the Services for non-commercial purposes"; paid users "may use the Services for commercial purposes";
  - section 4(c)(ii): "you retain all rights in and to your Output".
  - The Voice Library Addendum (<https://elevenlabs.io/vla>, 6 Mar 2026) says output made "prior to the end of the Notice Period" (section 4) "will continue to exist and remain available for use". Paul's notice period is 0 days, so in practice that means output made before the voice is taken down. It doesn't say whether the voice owner must be credited.
  - Pricing (<https://elevenlabs.io/pricing>): Starter, US$6 a month, is the lowest plan with a commercial licence, and its 30,000 credits cover our ~7,800 characters. Creator is US$22 a month.
  - The terms don't say what happens to commercial rights if the plan is cancelled later.
- **Commercial use OK?** Only if the account was on a paid plan when the audio was made.
- **Attribution:** not required by the terms we read.
- **Cost:** US$6 a month (Starter) or more; the brief says the account is on Creator (US$22). Whose account it is, is the question.
- **Status:** needs Adam's decision.
- **Recommended action:** Adam confirms which account the 4 Nov key belongs to, and that it was on a paid plan (Starter or higher) on 4–5 Nov. Keep a copy of the invoice. If it was a free account, re-make the voiceover on a paid one. Because Paul can disappear at any time, keep the master WAVs so the videos never need the voice again.

## Music

- **Use:** the soundtrack under the four videos.
- **Licence:** ours. `tools/video/music.py` (job folder) makes it from code with numpy: no samples, loops or recordings. It's adapted from our own Farm Commons explainer music.
- **Status:** OK. No action.

## Lesson pictures (GPT Image 2.5)

- **Use:** the 10 `.webp` lesson pictures, `courses/farm-ai-commons/assets/cover.jpg`, the video posters (`fac-l1-poster.jpg` to `fac-l4-poster.jpg`) and the card PNG/PDF. Kev made them with OpenAI's GPT Image 2.5 through a ChatGPT/Codex subscription: text prompts first (`images-incoming`, an editorial screen-print style, "no text/logos"), then a Colab sunburst restyle (`images-colab`, `images-colab-portrait`, 5–6 Nov 2026). No photos or other people's pictures were used as sources. No logos are in any picture.
- **Terms:** we couldn't read OpenAI's Terms of Use or Usage Policies (openai.com blocked our fetch on 6 Nov 2026), so we **haven't confirmed** what they say about who owns output and commercial use. Don't rely on memory for this.
- **Commercial use OK?** Unverified.
- **Attribution:** unverified.
- **Cost:** part of Kev's ChatGPT/Codex subscription. The plan and account weren't checked.
- **Status:** needs action.
- **Recommended action:** someone opens <https://openai.com/policies/row-terms-of-use/> (or the terms for the account's region) and <https://openai.com/policies/usage-policies/> in a browser, and records here what they say about output ownership and commercial use, and which account and plan made the images.

## The Colab brand

- **Use:** colours, the sunburst style, and the Inter and Playfair pairing, from the live thecolab.ai site. No logo is used anywhere in Module 1.
- **Licence:** ours.
- **Status:** OK.

## Product names

- **Use:** plain text only, no logos or screenshots. Named in lesson 1 (`01-ai-in-plain-english.md`) and its video captions, the quiz (`quiz.json`) and the course welcome page (`courses/farm-ai-commons/welcome.md`). Lesson 4 (`04-your-first-conversation.md`) and its video: "Pick any of the main chat apps: ChatGPT, Gemini, Claude, Copilot or Amazon Quick". Lesson 5 (`05-build-ask-about-your-farm.md`) has connector steps for Claude, ChatGPT and Amazon Quick. No farm-tech brands are named (lesson 2 is generic).
- **Terms** (checked 6 Nov 2026):
  - **AWS** (<https://aws.amazon.com/trademark-guidelines/>): fair use "in plain text only (no logos) and used to make true factual statements", with no implied affiliation. Their list says "AWS Quick". We say "Amazon Quick"; their list says it isn't complete.
  - **Microsoft** (<https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks>): word marks can be used "to truthfully convey information" about products. No logos without a licence.
  - **Google** (<https://partnermarketinghub.withgoogle.com/brands/google/trademarks-and-terms/trademark-guidelines-for-proper-usage/>): no implied relationship, spell names exactly, and don't make their name the most prominent thing. We didn't read a Gemini-specific page.
  - **Anthropic** (<https://www.anthropic.com/legal/trademark-guidelines>, Aug 2024): "You may only use our trademarks as specifically permitted by us and only in materials we approve beforehand." It doesn't spell out an exception for plain-text naming, so it's unclear on its face. Whether honest naming is fine anyway is a legal question.
  - **OpenAI** (ChatGPT): brand page not read (blocked fetch).
- **Commercial use OK?** Factual naming is the normal fair use. Nothing in the copy implies endorsement.
- **Status:** needs action (small).
- **Recommended action:** add one line to the course footer or lesson 5, in a copy lane: "ChatGPT, Gemini, Claude, Copilot and Amazon Quick are trademarks of their owners. Farm AI Commons isn't affiliated with or endorsed by them." Keep to text only.
- **Amazon Quick free tier:** the Quick pricing page lists a Free plan: "Free for everyone", US$0 a user a month, 1 user, no AWS account needed (<https://aws.amazon.com/quick/pricing/>, checked 6 Nov 2026). So "works in any free AI chat tool" in `course.json` stands, and lesson 4 can name Quick alongside the others. Lesson 5 says custom MCP connectors need the Enterprise plan. That comes from the AWS MCP user guide (`notes/quick/aws-facts.md`), not the pricing page, which doesn't mention MCP and lists built-in connectors on every plan.

## Quoted facts

- **Use:** the Kurow example in the card and lesson 5 (224 mm, 137% of normal) is our own API output from 5 Nov 2026, built on the LINZ, ECan and ERA5 sources above. The plan and connector details in lesson 5 come from each vendor's help pages (RESEARCH.md section 4.1, `notes/quick/aws-facts.md`). "Since 2023" in lesson 2 is a general statement, not a quote. There are no third-party statistics.
- **Status:** OK. Recheck the lesson 5 connector steps before launch, because vendor menus change often.

## Decisions for Adam

1. **Open-Meteo: is Farm AI Commons commercial?** Choose:
   - (a) keep the free API as "educational content", $0;
   - (b) pay for Professional (Standard doesn't cover historical/ERA5), price to quote;
   - (c) move to ERA5 from the AWS open-data bucket or Copernicus CDS, $0 for data plus build time.
   Whichever you pick, we add a link to open-meteo.com next to the data. We recommend (c) for a company-run course.
2. **ElevenLabs: which account made the voiceover, and was it on a paid plan (Starter or higher) on 4–5 Nov 2026?** If yes, keep the invoice. If no, re-make the voiceover on a paid account.
3. **LINZ: OK to email LINZ** about running a public API on our LDS key, and to ask how a business should hold the key (Koordinates IDs can't be shared, even within a business)? Until then, which named Colab staff member's ID should the key sit on? We'll also change the attribution to LINZ's wording.
4. **ECan: OK to drop "not for resale"** (no source found), and either re-bake the fallback cards on a schedule or label them as a dated example?
5. **Worker address: OK to move the API** from the personal `mail-5bc.workers.dev` subdomain to a Colab account and custom domain before launch? That changes lesson 5 and the rain card.
6. **Playfair font: OK to fix in a widget lane** (re-subset from Playfair v2 or rename, plus add the OFL notice)?
7. **Trademarks: OK to add the one-line "trademarks of their owners, not affiliated" notice** in a copy lane? Anthropic's wording is strict on its face, so you may want a quick legal view.
8. **OpenAI images: can Kev confirm** which account and plan made the pictures, and check OpenAI's current terms on output ownership and commercial use? We couldn't read them.
