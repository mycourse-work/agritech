# Build: Ask about your farm

Time to ask AI about your own place. You'll ask it about this season's rain twice: once with nothing to go on, and once with real numbers for your area. Then you'll compare the two answers.

![A clear plastic rain gauge on a wooden fence post, sheep grazing in a green paddock and snowy mountains behind.](./assets/fac-build-rain-gauge.webp)

> **On the farm:** Rain since 1 July sets up your spring: grass growth, when to sell, whether to buy in feed. It's a question every farmer has an answer to, so you'll know straight away if AI is guessing.

## What you'll need

- Your farm's address
- About 10 minutes
- A chat AI app on your phone or computer, for the last part only (any of them, see the last lesson)

## Ask it twice

Tap below to start. It goes one screen at a time:

1. Ask the AI about your district's rain, with no data.
2. Find your farm and get your rain card: real figures for your area.
3. Ask the same question again, this time with the card.
4. Compare the two answers.

:::coach fac-01-rain
:::

> **Good to know:** An address finds one parcel, and that's often the house block. Your farm may span several titles. For rain that doesn't matter much, because the nearest gauge and the climate grid cover the whole area. Later modules use your full farm boundary.

## What's on your rain card

- **Your nearest open council rain gauge** (Canterbury and North Otago for now), and how far it is from your address.
- **Rain at that gauge since 1 July.**
- **How this season compares with normal**, from the ERA5 climate record for the nearest ~25 km climate grid cell. It compares this season in that cell with the 1991 to 2020 average for the same dates in the same cell, as a percentage.
- **Where every number came from**, and the date the card was made.

> **Note:** A gauge measures the rain that falls in one spot. A climate grid cell averages about 25 km by 25 km, so it can read quite a bit wetter or drier than any one gauge. That's why the card compares the cell with its own long-term average, and shows the gauge total separately, rather than putting one against the other.

## The lesson in the build

With no data, AI is vague, or sure about numbers it can't back up. With your data it can work from real figures. Every module after this one adds more of your farm's own data, starting from the farm you just put on the map.

## Now do it in your own AI app

The AI in this course is for practice. The apps on your phone are the ones you'll use, so run the same test there.

**If you did the activity above:** its last card has your prompt and your rain card. Copy them, open your own chat AI, start a fresh chat, paste and send.

**If you didn't,** or you want to do the whole build by hand:

**Step 1: Ask it cold.** Open your chat AI, start a fresh chat and ask this, with your district in place of Kurow. Don't attach anything and don't add any figures. Note any numbers it gives and how sure it sounds.

> How much rain has the Kurow district had since 1 July, and is that normal?

**Step 2: Make your rain card.** Type your farm's address into the rain card below. It looks the address up in the national address and parcel maps from LINZ, and shows a total for each month as well.

:::widget fac-rain-card
title: Rain card
description: Type your farm address to see rain since 1 July for your area, compared with normal, as a card you can copy into any AI.
:::

If the live data won't load, open **No signal? Use saved figures for a district** under the address box (it opens by itself if the live figures fail). It shows figures saved for the field-day districts, and says the date they were saved.

**Step 3: Ask again with the card.** Tap **Copy card**, start a fresh chat, paste the card into the message box and type the same question under it:

> How much rain has my district had since 1 July, and is that normal? Use the rain card above, and say which numbers you used.

**Step 4: Compare.** Put the two answers side by side. What did it get wrong, or leave out, without the data?

### Or connect the AI for Farmers connector (optional)

Some AI apps let you add a connector, so the app can fetch the rain data itself when you ask. The AI for Farmers connector is public and read-only. It has no accounts, and it only returns public data about the address you give it.

Connector address:

> https://farm-ai-commons-api.mail-5bc.workers.dev/mcp

- **Claude** (any plan, including free, which allows one custom connector): on claude.ai in a web browser, open Settings, find **Connectors** and choose **Add custom connector**. Name it AI for Farmers and paste the connector address. Once it's added, it also works in the Claude phone app. Ask your question and include your address.
- **ChatGPT** (paid plans only, on the website, still in beta): open Settings, then **Apps & Connectors**, then **Advanced**, and turn on **Developer mode**. Then create a connector with the connector address. On some plans the tools don't show up yet. If that happens, paste the card instead.
- **Amazon Quick** (Enterprise plan only, and an administrator adds it): in Amazon Quick, open **Connectors**, choose the **Create for your team** tab, then **Model Context Protocol (MCP)**. Name it AI for Farmers, paste the connector address as the MCP server endpoint, choose **Public network** and no authentication, then share it with the people who need it. If the tools don't show up, paste the card instead.
- **Gemini, Copilot and others:** so far, custom connectors are only on some paid or work plans. Paste the card instead.

You don't need the connector to finish this build. Pasting the card gives the AI the same numbers. You'll come back to connectors in Level 3.

## Where the data comes from

- **Address and parcel:** LINZ Data Service, NZ Addresses and NZ Primary Parcels (CC BY 4.0).
- **Daily rain:** Environment Canterbury open data, rainfall by site (CC BY 4.0). The card uses the nearest Environment Canterbury gauge. In North Otago it uses one within 35 km if there is one. Otago Regional Council's live rain data isn't available as open data, so for the rest of Otago the card says so and points you to their website.
- **Normal rain:** ERA5 reanalysis from the Copernicus Climate Change Service, served through Open-Meteo (CC BY 4.0). Contains modified Copernicus Climate Change Service information.
