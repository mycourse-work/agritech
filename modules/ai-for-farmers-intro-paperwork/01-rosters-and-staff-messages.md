# Rosters and staff messages

<video controls poster="/api/content/ai-for-farmers-intro/@modules/ai-for-farmers-intro-paperwork/assets/ai-for-farmers-intro-paperwork-poster.jpg" playsinline preload="metadata" aria-label="Module 2: Farm paperwork made easier" style="width: 100%; max-width: 800px; border-radius: 12px; margin: 1.5rem auto; display: block;">
  <source src="./assets/ai-for-farmers-intro-paperwork.mp4" type="video/mp4">
  <track kind="captions" src="./assets/ai-for-farmers-intro-paperwork.vtt" srclang="en-NZ" label="English (NZ)" default>
  Your browser cannot play this video.
</video>

It's Sunday night, second week of calving. The roster has to be on the shed wall before the 5 am milking, and what you need to write it is spread across a text thread and the back of an envelope.

> **On the farm:** Everyone on the farm reads the roster. If it's wrong, a milking goes short-handed or someone turns up on their day off, and in calving you feel that within hours. AI can turn your notes into a clean table in a minute, as long as it doesn't paper over the gaps.

## Learning outcomes

By the end of this lesson, you will be able to:

- Write a roster prompt that gives the AI each person's availability and the rules the roster must follow.
- Check an AI roster name by name against your own notes.
- Get the AI to flag an uncovered milking instead of inventing cover.
- Turn a checked roster into a staff message with personal reasons left out.

## From notes to a roster

Through this module we'll use Ridgeback Farm, a made-up 380-cow dairy farm milking twice a day. Here's the manager's note for the week starting Monday 3 August:

```text
Wk of 3 Aug. Calving so 2 on every milking.
Sam off Sat + Sun (wedding in Napier)
Priya off Wed + Sun. Can't do Thurs pm (physio)
Ben off Mon. Still learning, needs Sam, Priya or Tom with him
Tom (relief) Sat am+pm, Sun am. Sun pm maybe, letting me know Fri
Spare person on a day goes on calves
```

That note works fine for you. As a prompt it's weak, because it mixes the rules with private reasons the AI doesn't need. Here's the same information written for ChatGPT, Microsoft Copilot, Google Gemini or Claude:

```text
Help me draft a milking roster for the week starting Monday 3 August.
Two people on every milking (AM 5.00 to 8.00, PM 2.30 to 5.00).
- Sam: off Saturday and Sunday.
- Priya: off Wednesday and Sunday. Not available Thursday PM.
- Ben: off Monday. Still learning, so pair him with Sam, Priya or Tom.
- Tom (relief milker): Saturday AM and PM, Sunday AM. Sunday PM not confirmed.
If three people are free for a milking, the third does calf rearing instead.
Give me a table with columns: day, AM milking, PM milking, calves.
Don't put anyone on a day off or a time they're unavailable.
If a milking can't be covered, write UNCOVERED and say why. Don't fill gaps with guesses.
```

The wedding and the physio appointment are gone. Every rule is still there.

### What a good answer looks like

| Day | AM milking | PM milking | Calves |
| --- | --- | --- | --- |
| Mon | Sam, Priya | Sam, Priya | (Ben off) |
| Tue | Sam, Ben | Sam, Ben | Priya |
| Wed | Sam, Ben | Sam, Ben | (Priya off) |
| Thu | Priya, Ben | Sam, Ben | Sam (AM) |
| Fri | Priya, Ben | Priya, Ben | Sam |
| Sat | Tom, Ben | Tom, Ben | Priya |
| Sun | Tom, Ben | **UNCOVERED** | (Sam and Priya off) |

Underneath, a good answer adds: *Sunday PM is uncovered. Ben is the only person free and he needs to be paired. Tom hasn't confirmed.* That line is worth more than the rest of the table.

## Check it before it goes on the wall

Read the table one person at a time, with your note beside it.

1. **Days off.** Follow each person through the week. Nobody should appear on a day they're off.
2. **Pairing rules.** Ben should never milk without Sam, Priya or Tom.
3. **Maybes stay maybes.** This is where AI trips. A common answer puts "Tom (relief)" in Sunday PM because the slot was empty and his name was close by. It looks finished, but it's a guess.
4. **Hours.** Ben ends up on six days straight. The AI followed your rules. Whether that fits his agreement is your call.

That last check stays with you. The AI hasn't seen anyone's employment agreement and can't tell you whether a roster meets your obligations on hours, breaks, leave and public holidays. Employment New Zealand covers [rostering](https://www.employment.govt.nz/pay-and-hours/hours-and-breaks/rostering), [rest and meal breaks](https://www.employment.govt.nz/pay-and-hours/hours-and-breaks/rest-and-breaks) and [leave and holidays](https://www.employment.govt.nz/leave-and-holidays/), and DairyNZ has practical advice on [setting up rosters](https://www.dairynz.co.nz/people/productive-workplaces/rosters/).

## Turn it into a staff message

Once the table is checked, the group-chat message takes seconds:

```text
Turn this roster into a short message for our staff group chat.
Plain, friendly English. One line per person with their milkings and days off.
Say Sunday PM isn't sorted yet and I'll confirm by Friday night.
Don't mention why anyone is off.
```

```text
Hi team, roster for the week starting Mon 3 Aug:
Sam: both milkings Mon to Wed, PM Thu, calves Thu AM and Fri. Off Sat and Sun.
Priya: both milkings Mon and Fri, AM Thu, calves Tue and Sat. Off Wed and Sun.
Ben: both milkings Tue to Sat, AM Sun. Off Mon.
Tom: both milkings Sat, AM Sun.
Sunday PM is still being sorted. I'll confirm by Friday night.
```

Check it against the table, because rewording is where names and days slip.

If someone reads more easily in another language, ask for a translation too. DairyNZ's guidance on [using AI on farm](https://www.dairynz.co.nz/people/productive-workplaces/using-artificial-intelligence-on-farm/) lists translating instructions for staff as a common use. Keep the checked English roster as the master, and have a bilingual team member read the translation before you rely on it for safety or pay.

Keep staff health and personal reasons out of both chats. The AI doesn't need to know about Priya's physio, and neither does the group. DairyNZ also notes that free AI tools may use what you type, so check your privacy settings.

## Try it

It's Friday afternoon. Tom texts to say he can't do Sunday at all now.

<div class="reflection" data-id="paperwork-rosters-and-staff-messages" data-min-chars="40">
<div class="reflection-prompt">What should the updated roster show for Sunday, and what will you ask the AI to do next?</div>
<div class="reflection-answer">

**Model response:** Sunday AM and PM are both uncovered. Ben is the only person free, and he can't milk without Sam, Priya or Tom. I'd tell the AI that Tom is out for Sunday and ask it to mark both milkings UNCOVERED, then draft a short group message asking whether anyone can swap a day. I wouldn't let it move Sam or Priya onto their day off. If someone offers to swap, I'd agree it with them, check it against their agreement and update the roster myself.

</div>
</div>

## Key takeaways

- Give the AI the rules (availability, pairings, people per milking), not the reasons behind them.
- Ask it to write UNCOVERED instead of guessing, then check that it did.
- Check every name against your note, especially relief milkers and "maybe" shifts.
- Checking the roster against employment agreements and the law is the manager's job.
- A translated message is a copy. The checked English roster stays the master.

Ten minutes on a Sunday night beats an hour with a pencil and a rubber. Just make sure the gap on Sunday afternoon is still a gap when the roster goes up in the shed.
