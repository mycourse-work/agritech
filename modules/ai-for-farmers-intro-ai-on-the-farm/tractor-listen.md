# Tractor listen: farm paperwork, Amazon Quick and Halter's behind-the-scenes AI

A 10-minute conversation to play on the tractor or in the ute. Sam and Jess talk through the farming section of AWS's Auckland Cloud and AI Day keynote (September 2026), then turn it into small jobs you can try this week.

<audio controls preload="none" style="width: 100%; margin: 1.5rem 0;" aria-label="Podcast: farm paperwork, Amazon Quick and Halter's behind-the-scenes AI">
  <source src="./assets/ai-for-farmers-podcast-ep1.mp3" type="audio/mpeg">
  Your browser does not support audio playback. The full transcript is below.
</audio>


Sam and Jess pick through the agriculture section of AWS's September Auckland keynote, covering Amazon Quick and Halter's internal assistant, Clank. They turn those examples into small farm-admin practice tasks, with checks on sources and data permissions, and finish with three things to try this week.

## Chapters

Approximate times use 150 spoken words per minute, excluding pauses and any music; estimated spoken duration is 10:09.

- 00:00 The missing contractor note
- 01:19 Amazon Quick and customers named on stage
- 03:00 Halter's internal assistant, Clank
- 04:32 Give a small task enough context
- 05:50 Try a fictional document helper
- 07:31 Data permission and checking the whole job
- 08:48 Three things to try this week and course modules

## Sources

- **Keynote:** AWS Cloud and AI Day Auckland keynote, 22 September 2026, New Zealand International Convention Centre. The agriculture section covered Amazon Quick and a talk from Halter. Speakers' remarks are paraphrased and attributed; they are what speakers said, not independent verification of company results.
- **AWS public documentation:** [Amazon Quick custom chat agents](https://docs.aws.amazon.com/quick/latest/userguide/custom-agents.html) and [Spaces](https://docs.aws.amazon.com/quick/latest/userguide/working-with-spaces.html). These document the product capabilities behind the proposed fictional handbook exercise; they do not establish an existing connection to a farmer's records.
- **Halter:** [Public technology description](https://www.halterhq.com/our-technology). The Clank examples in this episode come from the keynote and concern Halter's internal work. The keynote's ideas about future farmer access are not presented as a currently available Clank product.
- **Foundation for Arable Research:** [AWS's public Ask FAR case study](https://aws.amazon.com/solutions/case-studies/generative-ai-far/), describing an assistant for finding relevant crop research.
- **DairyNZ:** [Using artificial intelligence on farm](https://www.dairynz.co.nz/people/productive-workplaces/using-artificial-intelligence-on-farm/). The guidance is cited through the supplied research, checked on 9 October 2026; this episode's direct URL check returned HTTP 403.
- **Farm Data Code:** [Public code and guidance](https://www.farmdatacode.org.nz/), covering disclosure of data rights, sharing and storage practices.
- **Supporting research:** public product and guidance pages listed above, read on 9 October 2026.
- **Course:** the episode points to all four modules of Introduction to AI for Farmers. Practice examples are fictional, and the course has a route without a Quick account.

## Independence

This episode and Introduction to AI for Farmers are independent. AWS, Halter, LIC, Foodstuffs North Island, Xero, 2degrees and other organisations named do not endorse or partner with the course. Company names identify the source of a claim or a public product example.

## Full transcript

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

**Jess:** Use the farm numbers module for that practice, and read its privacy lesson before sharing real information. The spray drift lab in there is a good one too, as long as you treat it as illustration and keep the real decisions with people.

**Sam:** That's enough to be getting on with. I'm off to find that scrap of paper before the washing machine turns it into a very short report.

**Jess:** Thanks for listening. You'll find the sources and transcript in the show notes, and the exercises in Introduction to AI for Farmers when you're ready to sit down with them.
