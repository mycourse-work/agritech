# Test it and keep it current

The vet's due at 9:30 on Thursday. Priya asks the helper where the vet signs in, and it says the dairy office, citing the handbook. Jack is waiting at the implement shed, because that's what his jobs list says. Nobody had tested the helper with a question where two documents disagree.

> **On the farm:** A helper that's right nine times out of ten still sends someone to the wrong shed on the tenth. Three quick tests, run before you share it and again whenever a document changes, catch most of those first.

## Learning outcomes

By the end of this lesson, you will be able to:

- Run three tests that show the ways a helper goes wrong.
- Judge each answer by opening the source it names.
- Keep a short test record you can repeat.
- Decide when to re-test and who keeps each document up to date.

## Three tests before anyone else uses it

Each test checks a different way a helper goes wrong:

| Test | Question | A pass looks like | A fail looks like |
| --- | --- | --- | --- |
| Answer is in the documents | "The quad has a flat tyre. What do I do?" | Key off, red tag on, tell Jack. Names the equipment list | Tyre-pumping advice, or no source |
| Answer isn't in the documents | "How many days is milk withheld after a cow's treated for mastitis?" | Says it isn't there, points to the treatment book, says ask Jack or Hannah | Any number of days |
| Two documents disagree | "Where do visitors sign in?" | Shows both places and says check with Jack or Hannah | Picks one place, even with a source |

The second test matters most on a dairy farm. The withholding period depends on the product and dose, so the documents don't give one. A good helper sends Priya to the treatment book. A bad one guesses, and treated milk could end up in the vat.

### Check the source every time

Open the document the helper names and find the section. A pass means the words there say what the answer says. A helper can name the right file and still add a detail that isn't in it.

Here's the conflict test failing and passing:

```text
Fail:
Visitors sign in at the dairy office and wait there for Hannah or Jack.
Source: Handbook for new staff, "Visitors and contractors".
```

```text
Pass:
The documents disagree. The handbook says visitors sign in at the dairy office
("Visitors and contractors"). This week's jobs list says the implement shed
("Notes for the week"). Check with Jack or Hannah before you send anyone.
```

The fail looks fine and names a real source. You only spot it because you already knew the jobs list said otherwise, which is why you write the test questions, and the answers you expect, before you run them.

:::widget helper-lab
title: Build and test a farm helper
description: Load the documents, pick the instruction lines, run the three tests and judge each answer.
:::

## Keep a test record

Write down every test. It takes a minute, and next time you can run the same questions.

```text
Ridgeback helper test record, 11 October 2026 (Hannah)
Documents: handbook (3 Mar 2026), equipment list (28 Sep 2026),
jobs list (week of 12 Oct)

1. Quad flat tyre: PASS. Matches equipment list, "If something is broken".
2. Milk withholding days: PASS. Said not in documents, pointed to
   treatment book.
3. Visitor sign-in: FAIL. Said dairy office only.
   Fix: Jack and I agreed sign-in stays at the dairy office.
   Jack corrected the jobs list. Re-tested: PASS.
```

Test 3 didn't need a new instruction. The documents disagreed, so Hannah settled which was right and Jack corrected his list. When a conflict test fails, fix the documents first.

## Keep it current

Re-run your three tests, plus any new ones, whenever:

- you load a new version of any document
- you change an instruction line
- the AI tool changes how helpers work

At Ridgeback, the jobs list changes every Sunday. Jack uploads the new week, removes last week's and runs the three questions before Monday milking. If last week's list stays loaded, the helper will tell Priya about jobs that are already done.

### Who owns what

Give each document one owner, with their name and the date at the top. Hannah owns the handbook and decides farm rules like visitor sign-in. Jack owns the equipment list and the jobs list. Whoever changes a document re-runs the tests and adds a line to the record. When staff spot a wrong answer, they tell that document's owner.

## Try it

Jack uploads the jobs list for the week of 19 October. In the notes, he's written: "Contractors sign in at the calf shed this week while the dairy office is painted." He hasn't touched the handbook.

<div class="reflection" data-id="ai-for-farmers-intro-build-a-helper-test-and-keep-current" data-min-chars="40">
<div class="reflection-prompt">What should happen before Monday milking, and what result would you expect from the visitor sign-in test?</div>
<div class="reflection-answer">

**Model response:** Jack removes last week's list, loads the new one and runs the three tests before milking. The sign-in test should show a disagreement again: the handbook says the dairy office and the jobs list says the calf shed, so check with Jack or Hannah. That's a pass for the helper. Because the change is deliberate and only lasts a week, Hannah might tell the team directly as well. Jack adds the result to the test record.

</div>
</div>

## Key takeaways

- Test three kinds of question: the answer is there, it isn't there, and two documents disagree.
- Open the source the helper names and check the words match the answer.
- Keep a short test record so you can repeat the same questions.
- When documents disagree, the owner decides and fixes the document, then re-tests.
- Re-test whenever a document, an instruction or the tool changes.

Once staff see the helper send them to the treatment book instead of guessing, they'll ask it first and save the 5 am phone calls for things that need you.

## Bonus listen

<audio controls preload="none" style="width: 100%; margin: 1.5rem 0;" aria-label="Bonus listen: small AI jobs for farm paperwork">
  <source src="./assets/ai-for-farmers-podcast-ep1.mp3" type="audio/mpeg">
  Your browser does not support audio playback. The full transcript is below.
</audio>

A 10-minute conversation for the ute or the tractor. Two presenters, Sam and Jess, talk through the farming section of the public keynote at AWS Cloud and AI Day Auckland on 22 September 2026, then turn it into small jobs you can try. Their voices are AI-generated. What the keynote speakers said is paraphrased, and you can watch the [public recording](https://www.youtube.com/watch?v=I7g27RIvGIM) yourself. This episode and the course are independent of AWS and Halter.

<details>
<summary>Read the transcript</summary>

**Sam:** You get in from shifting stock, pull off your boots, and remember the contractor wanted a message yesterday. The details are on a scrap of paper somewhere between the ute and the washing machine.

**Jess:** And now you have to turn those details into something another person can understand. That's a reasonable job to try with AI, once you've found the paper.

**Sam:** Finding the paper remains a specialist operation. I'm Sam, and this is a bonus tractor listen for Introduction to AI for Farmers.

**Jess:** I'm Jess. We're picking through the farming ideas from AWS's Cloud and AI Day Auckland keynote, held at the New Zealand International Convention Centre on the twenty-second of September, twenty twenty-six.

**Sam:** There were plenty of big technology claims. What caught my ear was the suggestion that a work assistant could be useful when your workplace is a farm.

**Jess:** We'll look at Amazon Quick, then Halter's story about AI helping its own staff. This episode and the course are independent; none of the companies we discuss endorses or partners with the course.

**Sam:** If you're driving or operating machinery, keep listening and leave the exercises until you're parked. Your phone can wait until you've finished the job.

**Jess:** At the keynote, AWS presented Amazon Quick as an assistant that can use information from files and connected workplace tools. The pitch was less time hunting through scattered information before doing a job.

**Sam:** Which sounds familiar. There's a manual in the shed, a message on the phone, and someone who remembers what happened but is currently out fixing a gate.

**Jess:** AWS named LIC, Foodstuffs North Island, Xero and 2degrees among its Quick customers. That's a statement about those organisations using Quick, with no detail there about access for their farmer customers.

**Sam:** So hearing LIC's name doesn't tell me Quick is already inside my herd records. I'd need to ask what a particular product actually does.

**Jess:** Yes. For a farm example, imagine a helper searching a few documents you've chosen, then drafting a reply with a reference you can open. Quick's public documentation describes custom chat agents and collections of information called Spaces.

**Sam:** Say I want to find the page in a manual that explains a warning light. Can it help me get to that page?

**Jess:** That's a sensible trial with a permitted manual. Check the machine model and the page yourself, and follow the manufacturer's instructions before doing anything to the machine.

**Sam:** I'd be happy with less time searching a PDF. Though I still want it to admit when I've given it the wrong manual.

**Jess:** You can ask it to flag a missing answer. You also need to test that behaviour, because an instruction doesn't guarantee the assistant will follow it.

**Sam:** Then Halter came on stage. Plenty of farmers will recognise the collars and virtual fences. Where did its AI story fit?

**Jess:** At AWS's Auckland keynote in September, Halter's speaker described an internal assistant called Clank. The story centred on work behind the scenes, helping the people who build and support Halter's products.

**Sam:** What sort of work are we talking about?

**Jess:** He described Clank investigating software alerts and working on fixes. Another example involved checking images of circuit boards for a component, while support staff could use it to retrieve information without asking an engineer to run the query.

**Sam:** So a farmer might benefit through the service they receive, while the assistant itself is working inside Halter.

**Jess:** Exactly. The speaker also discussed early ideas for putting more farm-specific intelligence in farmers' hands. That was future-looking, so we shouldn't describe Clank as a farm chatbot you can sign up for today.

**Sam:** Fair enough. I can recognise the problem, though. Someone asks a useful question, and the person with the answer has six other jobs waiting.

**Jess:** Halter's explanation was that its assistant had access to relevant systems and detailed company information. The speaker also described isolating each job in its own computing environment to limit damage.

**Sam:** That's a lot of setup behind a short answer. I can't expect a blank chat window to know the farm just because I've told it I'm busy.

**Jess:** For a small trial, give it the facts it needs for one task. Take that contractor message: say what job you want discussed, what timing you've agreed, and what still needs confirming.

**Sam:** For practice, we could make up a repair job. Ask for a short message requesting a visit, and say the date hasn't been agreed.

**Jess:** Then check the draft for promises you never made. Did it invent a booking, add an urgency you didn't intend, or say you've approved work when you're asking for a quote?

**Sam:** That gives me something specific to check. I'd rather catch a made-up appointment before someone's ute arrives at the gate.

**Jess:** DairyNZ has public guidance on AI for farm admin and on checking what it gives you. There's also Ask FAR, which AWS describes as helping growers find relevant information in the Foundation for Arable Research's material.

**Sam:** So I could use an answer to find something worth reading, then check whether the research fits the question and conditions I've got.

**Jess:** Yes. With your own document helper, you can practise that on something much smaller. The last module, build your own farm helper, uses permitted documents and questions you can check.

**Sam:** Let's make one up. A fictional shed handbook says where the spare parts list is kept, and a maintenance note records a job still waiting on a part.

**Jess:** Ask the helper to list the unfinished jobs and name the document supporting each answer. In Quick, the documented approach is to collect the material in a Space and link it to a custom chat agent.

**Sam:** I don't need to remember the buttons while I'm on the tractor, then. I can follow the example in the course later.

**Jess:** That's right. Check the current steps when you try it. The course also has practice you can do without creating a Quick account.

**Sam:** What do I ask this little shed helper to do when something is missing?

**Jess:** Tell it to identify the gap and ask you for the missing detail. For example, if the note says a repair needs a part but gives no arrival date, the answer should leave the date unknown.

**Sam:** And I deliberately ask when that part will arrive. If it gives me Thursday, I know we've got a problem.

**Jess:** Then open the document and check. A source link is useful, but the passage must support the answer. Also check whether the helper has quietly combined an old note with a newer one.

**Sam:** Old instructions hanging around can cause enough trouble without giving them a confident voice.

**Jess:** Keep document dates visible and remove superseded copies from the practice set. Start with questions you know the answers to, including a question whose answer is absent.

**Sam:** What about the farm's actual records? It's tempting to upload the lot and see what happens.

**Jess:** For this exercise, use fictional information. Before using real records, check who has permission to share them and what the service's terms say about storage and reuse.

**Sam:** That includes staff details and anything we've received from someone else's system? Having a copy doesn't settle every question about using it.

**Jess:** Yes. The Farm Data Code is a public place to start asking about data rights, sharing and storage. The farm numbers module helps you work through those questions.

**Sam:** And if I'm asking about an invoice, I still reach for the calculator. A tidy explanation won't tell me whether it copied a number wrong.

**Jess:** Check the original amount, the units and the arithmetic. The farm numbers module gives you practice with invented documents, including missing or unusual readings.

**Sam:** I'd want to count checking time as part of the trial. If I spend longer correcting the answer than writing the message, that job hasn't improved.

**Jess:** Compare the whole task, including review. A useful trial ends with a message or answer you can use, and a clear view of what needed fixing.

**Sam:** Right, three things to try this week, once you're parked. One: choose a small writing job and use made-up details to ask for a short draft.

**Jess:** Check every date and commitment against what you supplied. The first two modules, AI on the farm and farm paperwork, walk you through a clear request and a checked draft.

**Sam:** Two: try a question against a short fictional document. Ask where the answer came from, then ask something the document doesn't cover.

**Jess:** Open the source and see whether it supports the reply. The farm helper module covers that exercise and the optional Amazon Quick example.

**Sam:** Three: check one result properly. Recalculate a total or compare a drafted note with the original, and note how long the checking took.

**Jess:** Use the farm numbers module for that practice, and read its privacy lesson before sharing real information. The spray drift lab in there is a good one too, as long as you treat it as illustration and keep the real decisions with people. *(Module 3's activity is now the kill sheet check.)*

**Sam:** That's enough to be getting on with. I'm off to find that scrap of paper before the washing machine turns it into a very short report.

**Jess:** Thanks for listening. You'll find the sources and transcript in the show notes, and the exercises in Introduction to AI for Farmers when you're ready to sit down with them.

</details>

### Sources

- [AWS Cloud and AI Day Auckland keynote, public recording](https://www.youtube.com/watch?v=I7g27RIvGIM)
- [AWS Cloud and AI Day Auckland event page](https://aws.amazon.com/events/cloud-days/auckland/)
- [Amazon Quick: custom chat agents](https://docs.aws.amazon.com/quick/latest/userguide/custom-agents.html)
- [Amazon Quick: working with spaces](https://docs.aws.amazon.com/quick/latest/userguide/working-with-spaces.html)
- [Halter: our technology](https://www.halterhq.com/our-technology)
- [AWS case study: Foundation for Arable Research](https://aws.amazon.com/solutions/case-studies/generative-ai-far/)
- [DairyNZ: using artificial intelligence on farm](https://www.dairynz.co.nz/people/productive-workplaces/using-artificial-intelligence-on-farm/)
- [Farm Data Code](https://www.farmdatacode.org.nz/)
