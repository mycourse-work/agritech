# Kill sheets, invoices and exports

The kill sheet for your last line of lambs lands in your inbox as a PDF. You want to know how many graded, whether any were condemned and what they averaged. An AI chat tool can pull that out in seconds, and get one of them wrong just as quickly.

> **On the farm:** A kill sheet is the processor's record of every animal you sent. The downgrade and condemned notes are often worth more than the averages, because they point to grass seed, bruising or disease you can deal with before next season.

## Learning outcomes

By the end of this lesson, you will be able to:

- Ask an AI tool to summarise a kill sheet or processor statement and list the rows behind each figure.
- Check a summary's head count, totals, averages and downgrades against the source rows.
- Match columns, units and date formats before combining exports from two farm apps.

## What's on a kill sheet

On a dairy farm the kill sheets are mostly for cull cows. If you finish lambs or steers, you'll see more of them. Layouts differ between processors, but most carry the same core fields for each animal:

| Field | What it means |
| --- | --- |
| Tag or tally number | Which animal the row belongs to |
| Hot weight (kg) | Carcass weight on the chain, before chilling |
| Grade | The processor's grade code. Codes vary, so ask yours for the key. |
| Notes | Downgrades with a reason, trim, or "condemned" |

A condemned carcass failed inspection and doesn't get a grade. A downgraded carcass keeps a grade, just a lower one. Both notes are easy for a quick summary to lose. The same goes for a milk statement or processor invoice: every figure in a summary should trace back to a line on the document.

## Worked example: a summary you can check

Jack, the 2IC at Ridgeback Farm, sent six steers from the runoff to the works last week. He uploads the kill sheet PDF and asks:

```text
This is the kill sheet for the six steers I sent last week. Summarise it:
- head processed, how many graded and how many condemned
- each downgrade, with the tag and reason
- total and average hot weight of the graded carcasses only
After every figure, list the tags you used.
If a value is unreadable or missing, say so and leave it out. Don't guess it.
```

The last two lines matter most. Listing the tags means every number can be traced, and "don't guess it" stops a smudged figure turning into a made-up one.

A good answer reads like this:

```text
6 steers processed: 5 graded, 1 condemned (tag 306).
Downgrade: tag 304, dark cutting.
Total hot weight, 5 graded carcasses: 1,542.0 kg
(tags 301, 302, 303, 304, 305)
Average: 1,542.0 ÷ 5 = 308.4 kg
No unreadable or missing values.
```

Every figure names its tags, so you can put your finger on the rows and check them.

## Five checks before you trust it

You don't need to recheck every number. These five checks are quick and cover the usual slips:

1. **Count the rows.** The head count on the summary should match the rows on the sheet.
2. **Re-add one total.** Use the tags it listed and your phone calculator.
3. **Match every note.** Each downgrade or condemned note on the sheet should appear in the summary.
4. **Ask what's inside each average.** A condemned carcass doesn't belong in the average weight of graded carcasses.
5. **Find the blanks.** An unreadable or empty cell is unknown. If the summary shows it as 0 kg, it's wrong.

Now try it on a summary that hasn't been checked yet.

:::widget kill-sheet-check
title: Check the kill sheet summary
description: Compare an AI summary of a kill sheet for eight lambs from the runoff with the sheet itself. Mark each line OK or Wrong, then see what you caught.
:::

## Combining exports from two apps

Some questions span two apps. How did the R1 heifers grow while they were on the river flats? The weights sit in your herd app and the covers in your pasture app. Both export a CSV file and an AI tool can read both. The risk is that it joins them confidently on columns that don't really match.

Here's what Jack's two exports looked like:

| | Herd app export | Pasture app export |
| --- | --- | --- |
| Group name | Mob: "R1 heifers" | Grazing group: "R1H" |
| Date | 03/04/2026 | 2026-04-03 |
| Main figure | Liveweight (kg per animal) | Cover (kg DM/ha) |
| Place | Not recorded | Paddock: "P5 River Flat" |

Before anything gets combined, ask for a column map:

```text
I've attached two CSV exports, one from my herd app and one from my pasture app.
Before combining anything:
1. List every column in each file, with its units and date format.
2. Suggest which columns match between the files, and say how sure you are.
3. Flag anything that could be read two ways.
Don't merge the files until I've confirmed the matches.
```

Then check what it flags. "R1 heifers" and "R1H" are probably the same mob, but only you know for sure. A date like 03/04 is 3 April in New Zealand format and 4 March in American format, and exports don't always follow NZ settings. Liveweight per animal and cover per hectare can sit side by side, but they can't be added together.

Keep the original exports untouched and work on copies. The tool only sees the file you gave it and can't fetch newer data, so note the export date.

## Try it

Jack's AI merged the two exports and came back with: "R1 heifers gained 9.5 kg per head on P5 River Flat between 3 April and 17 April, while cover dropped from 2,600 to 1,500 kg DM/ha."

<div class="reflection" data-id="ai-for-farmers-intro-farm-numbers-kill-sheets-invoices-and-exports" data-min-chars="40">
<div class="reflection-prompt">Before Jack uses this, what should he check, and what would he ask the AI?</div>
<div class="reflection-answer">

**Model response:** I'd check the group match first: is "R1H" really the R1 heifers, and were they on P5 for the whole fortnight? Then the dates: did both files read 03/04 as 3 April? I'd ask the AI to show the two weigh dates and liveweights behind the 9.5 kg, and the two cover readings with their dates, so I can find each one in the original exports.

</div>
</div>

## Key takeaways

- Ask for the tags or rows behind every figure in a kill sheet or statement summary.
- Count rows, re-add one total and match every downgrade and condemned note.
- A condemned carcass stays out of the graded average, and a blank weight is unknown.
- Before combining two exports, get a column map with units and date formats, and confirm it yourself.
- Keep the original files and note when each export was made.

The summary takes the tool ten seconds and you two minutes to check. Those two minutes are where you find the grass seed note that changes what you do with next year's lambs.
