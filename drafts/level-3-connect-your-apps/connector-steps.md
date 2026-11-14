# Connect your AI app to your farm data (parked for Module 9)

Moved out of Module 1, lesson 5 on 14 Nov 2026: a farmer who did Level 1 found the connector steps too much for a first module. Module 1 now has a one-line teaser pointing here ("Later in the course (Module 9) you'll plug your rain card straight into your AI app"). Re-check every app's steps and plans before this goes back into a lesson: they change often.

Not served to learners: this folder isn't in any course.json or module manifest.

## Connect the AI for Farmers connector

Some AI apps let you add a connector, so the app can fetch the rain data itself when you ask. The AI for Farmers connector is public and read-only. It has no accounts, and it only returns public data about the address you give it.

Connector address:

> https://farm-ai-commons-api.mail-5bc.workers.dev/mcp

- **Claude** (any plan, including free, which allows one custom connector): on claude.ai in a web browser, open Settings, find **Connectors** and choose **Add custom connector**. Name it AI for Farmers and paste the connector address. Once it's added, it also works in the Claude phone app. Ask your question and include your address.
- **ChatGPT** (paid plans only, on the website, still in beta): open Settings, then **Apps & Connectors**, then **Advanced**, and turn on **Developer mode**. Then create a connector with the connector address. On some plans the tools don't show up yet. If that happens, paste the card instead.
- **Amazon Quick** (Enterprise plan only, and an administrator adds it): in Amazon Quick, open **Connectors**, choose the **Create for your team** tab, then **Model Context Protocol (MCP)**. Name it AI for Farmers, paste the connector address as the MCP server endpoint, choose **Public network** and no authentication, then share it with the people who need it. If the tools don't show up, paste the card instead.
- **Gemini, Copilot and others:** so far, custom connectors are only on some paid or work plans. Paste the card instead.

You don't need the connector to finish this build. Pasting the card gives the AI the same numbers. You'll come back to connectors in Level 3.

