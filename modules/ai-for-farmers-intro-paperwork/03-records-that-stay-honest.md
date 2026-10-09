# Records that stay honest

The notebook in the dairy shed is the most honest record on the farm. By Friday it's also close to unreadable: half-sentences, a coffee ring, and "NAIT??" circled twice.

> **On the farm:** Sooner or later someone else checks your records, whether that's OSPRI, an auditor, your processor or WorkSafe. AI is good at turning a scrappy page into a tidy log you can find things in. It can't make something happen that didn't, and a tidy log that says "done" when the job wasn't done causes more trouble than the scrappy page ever did.

## Learning outcomes

By the end of this lesson, you will be able to:

- Turn rough shed notes into a tidy log that keeps done, planned and unconfirmed separate.
- Spot when an AI summary has turned "planned" into "done".
- Explain why a summary sits beside the original record and never replaces it.
- List what still needs confirming before NAIT, maintenance, Farm Environment Plan or visitor records are complete.

## Four records, one rule

These are the records AI most often gets asked to tidy on a farm:

- **NAIT movement records.** Movements of cattle and deer between NAIT locations must be recorded in NAIT within 48 hours, according to [OSPRI's guidance on recording movements](https://www.ospri.co.nz/farmers-and-livestock-owners/moving-animals/recording-animal-movements). AI can remind you a movement is due. Only the entry in NAIT counts.
- **Maintenance logs.** What was done, when and by whom. "Sam will swap it Saturday" is a plan, not a repair.
- **Farm Environment Plan (FEP) evidence.** Dated photos, receipts and notes showing an action happened, like fencing or planting along a waterway. A sentence saying the planting was "maintained" proves nothing.
- **Visitor sign-in and induction.** WorkSafe's fact sheet on [visitors and events on farms](https://www.worksafe.govt.nz/topic-and-industry/agriculture/keeping-safe-on-farms/visitors-and-events-on-farms/) explains farmers' duties for work areas and farm buildings. The signed sheet is the record. A summary of who came through isn't.

The rule is the same for all four. AI can summarise and tidy, but "planned" never becomes "done", and a summary never replaces the record.

## Worked example: the shed notebook

Here's Thursday's page from the Ridgeback Farm shed notebook:

```text
Thu 6/8
vat 2 seal leaking again - Sam to swap Sat
moved 22 R1 hfrs to run block (Jack). NAIT??
teat spray drum changed
creek fence - fixed hot wire. need to check planting guards + photos for FEP
feed rep came 10ish, signed in? think so
```

And a prompt that keeps it honest:

```text
Turn these notebook lines into a tidy farm log for Thursday 6 August.
Columns: item, status, who, follow-up.
Status can only be Done, Planned or Not confirmed.
Only mark something Done if the note says it happened.
The run block is a separate NAIT location.
After the table, list everything not yet confirmed and who should check it.
Don't add anything that isn't in the notes.
```

### What a good answer looks like

| Item | Status | Who | Follow-up |
| --- | --- | --- | --- |
| Vat 2 seal leaking | Planned: swap Saturday | Sam | Log the swap once it's done |
| 22 R1 heifers moved to run block | Done (the move) | Jack | NAIT entry not confirmed |
| Teat spray drum changed | Done | Not noted | None |
| Creek fence hot wire fixed | Done | Not noted | None |
| Creek planting guards | Not confirmed | Not noted | Check guards, take FEP photos |
| Feed rep visit, about 10 am | Visit done, sign-in not confirmed | Not noted | Check the visitor book |

**Not yet confirmed:**

- NAIT movement for the 22 heifers. Check it's recorded. A Thursday move needs to be in NAIT by Saturday night.
- Vat 2 seal swap. Sam, Saturday.
- Planting guards along the creek, plus dated photos for the FEP.
- Feed rep sign-in. Check the visitor book, and if he didn't sign in, sort it with him next visit.

Look at what the good answer refuses to do. A careless prompt, or a careless read, gets you lines like these:

- "Vat 2 seal replaced."
- "22 heifers moved and recorded in NAIT."
- "Visitor signed in and inducted."
- "Riparian planting maintained."

Each one reads well, and each one is either wrong or unknown. That's the trap. When AI tidies a note, the wording drifts toward "done", because finished jobs make tidier sentences.

## Keep the original beside the summary

Take a photo of the notebook page and keep it with the log. If a question comes up in three months, the page is what you show, along with the NAIT entry, the visitor book or the FEP photos. The log helps you find things, but it doesn't prove anything on its own.

The same goes for a weekly summary to your manager or farm owner. It's a good use of AI. Paste in the week's logs, ask for a half-page summary with an "open items" list at the end, then check every "done" against the source before you send it.

## Try it

The AI's weekly FEP summary says: "Creek riparian planting maintained and protected. All plant guards checked." Thursday's notebook says "need to check planting guards", and nothing later in the week mentions them.

<div class="reflection" data-id="paperwork-records-that-stay-honest" data-min-chars="40">
<div class="reflection-prompt">What do you change in the summary, and what has to happen before the FEP record can say the guards were checked?</div>
<div class="reflection-answer">

**Model response:** I'd change it to "Creek planting guards: not yet checked" and move it to the open items list with a name and a day against it. The hot-wire repair can stay as done because the note says so. The guards only become "checked" once someone has walked the creek, and the FEP evidence is the dated photos from that check, not the summary.

</div>
</div>

## Key takeaways

- Tell the AI which statuses it can use, and that "Done" needs proof in the notes.
- Read every "done" in a summary and find the line in the source that supports it.
- Keep a "not yet confirmed" list with a name against each item.
- The record is the NAIT entry, the visitor book, the photo or the receipt. The summary is a finding aid.
- Keep the original page with the tidy version.

A tidy log is worth having. Just make sure it only says what the notebook says.
