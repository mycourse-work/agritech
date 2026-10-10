# Choose documents and write instructions

<video controls poster="/api/content/ai-for-farmers-intro/@modules/ai-for-farmers-intro-build-a-helper/assets/ai-for-farmers-intro-build-a-helper-poster.jpg" playsinline preload="metadata" aria-label="Module 4: Build your own farm helper" style="width: 100%; max-width: 800px; border-radius: 12px; margin: 1.5rem auto; display: block;">
  <source src="./assets/ai-for-farmers-intro-build-a-helper.mp4" type="video/mp4">
  <track kind="captions" src="./assets/ai-for-farmers-intro-build-a-helper.vtt" srclang="en-NZ" label="English (NZ)" default>
  Your browser cannot play this video.
</video>

A new worker asks the same questions all month. Where does the vet sign in? Who do I tell about a flat tyre? Can this cow's milk go in the vat? A farm helper answers them on a phone at 5 am, straight from your own farm documents, so nobody has to stop work to explain.

> **On the farm:** DairyNZ describes farmers [building custom chatbots from their farm policies](https://www.dairynz.co.nz/people/productive-workplaces/using-artificial-intelligence-on-farm/) so staff can ask questions on their phones. The helper only knows what you load and only behaves as well as your instructions. Get those right and it saves you a stack of interruptions.

## Learning outcomes

By the end of this lesson, you will be able to:

- Explain what a farm helper is and where common AI tools offer one.
- Choose which farm documents to load and which to keep out.
- Write six instruction lines that keep the helper to your documents.
- Predict how a helper answers when the documents are silent or disagree.

## What a helper is

A helper is an AI chat assistant you set up once with your own files and a short set of standing instructions. Anyone you share it with can then ask it questions, and it answers from those files.

ChatGPT calls these custom GPTs or Projects. Claude has Projects, Google Gemini has Gems, Microsoft Copilot has agents, and Amazon Quick links a space of documents to a chat agent. Every one asks for a name, the documents and the instructions. What you can upload and share depends on the tool and your plan, so check before you spend an evening on it.

In this module you'll build one for Ridgeback Farm, a made-up dairy farm. Hannah Cole owns and runs it, Jack Reid is 2IC, Priya Nair rears the calves and Tom Walsh milks at weekends.

## Choose the documents

Start with the questions staff actually ask, then pick the documents that answer them. At Ridgeback, three files cover most of it:

- [Handbook for new staff](./assets/example-station-handbook.md): who's who, induction, visitors, animal health, emergencies.
- [Equipment and maintenance list](./assets/example-station-equipment.md): where each machine lives, daily checks, what to do when something breaks.
- [Jobs for the week](./assets/example-station-tasks.md): who's doing what, plus Jack's Sunday notes.

Read them before you go on. Two of them disagree, and neither says so.

| Load it | Keep it out |
| --- | --- |
| The current version, dated at the top | Old versions and drafts |
| Lists and rules staff use day to day | Staff contact lists, pay, IRD numbers, health details |
| Documents you have the right to share | Other people's reports you may not have the right to share |
| Typed text | Blurry photos of the whiteboard (retype them) |

Keep staff personal details out. Once a helper is shared, anyone can ask it for whatever you loaded. DairyNZ also notes that free tools may use your data, so read the privacy settings first.

The jobs list changes every Sunday. It's fine to load as long as someone swaps it each week, which lesson 3 covers.

## Write the instructions

Instructions are the standing rules the helper reads before every question. Six lines are enough:

```text
You answer questions from Ridgeback Farm staff in short, plain answers.
Answer only from the documents loaded here. Don't use general farming knowledge.
Name the document and section your answer comes from.
If the answer isn't in the documents, say so and tell them to ask Jack or Hannah.
If two documents disagree, show both answers and don't pick one.
For animal treatments, chemicals or anything that could hurt someone, tell them to check with Jack or Hannah first.
```

Without the "only" line, the helper fills gaps with general advice that may suit an overseas farm, or nobody's. Naming the source lets staff check in ten seconds. "That's not in the documents" beats a confident guess about a withholding period. Showing both sides of a disagreement means someone finds the clash before the vet is standing at the wrong shed.

Writing these lines doesn't guarantee the helper follows them. Testing tells you, and that's lesson 3.

### What a good answer looks like

Priya asks on her second day:

```text
Can I take the side-by-side down to check the effluent irrigator?
```

```text
Only once Jack has signed you off on the side-by-side. Wear your seatbelt,
and check the tyres, brakes, oil and seatbelt before your first drive of the day.
Sources: Handbook for new staff, "Your first day"; Equipment and maintenance
list, side-by-side row.
```

It's short, it draws on two documents and it tells Priya where to look. It adds nothing the documents don't say.

## Try it

Hannah wants to add two more files. One is the staff contact list with mobiles, home addresses and next of kin, "so new people can find phone numbers". The other is the 2023 handbook, "because it has more detail on the shed".

<div class="reflection" data-id="ai-for-farmers-intro-build-a-helper-choose-documents" data-min-chars="40">
<div class="reflection-prompt">What would you tell Hannah about each file, and what would you do instead?</div>
<div class="reflection-answer">

**Model response:** Leave both out. Anyone using the helper could ask for the home addresses and next of kin on the contact list, and the handbook already says phone numbers are on the office whiteboard. The 2023 handbook is out of date, so the helper would mix old rules with current ones. If the shed detail still matters, copy it into the current handbook, date it and reload that.

</div>
</div>

## Key takeaways

- A helper is an AI assistant loaded with your documents and standing instructions. The main AI tools all offer one under different names.
- Load current, dated documents you have the right to share. Keep out old versions, drafts and staff personal details.
- Six plain instruction lines cover it: only your documents, name the source, say when something's missing, show both sides, check first on risky jobs.
- Instructions are a request. Testing shows what the helper does with them.

Start with the three or four questions you get asked most. If the helper answers those from your own paperwork, that's fewer interruptions every spring morning.
