# Feed, rain and forecasts

<video controls poster="/api/content/ai-for-farmers-intro/@modules/ai-for-farmers-intro-farm-numbers/assets/ai-for-farmers-intro-farm-numbers-poster.jpg" playsinline preload="metadata" aria-label="Module 3: Farm numbers" style="width: 100%; max-width: 800px; border-radius: 12px; margin: 1.5rem auto; display: block;">
  <source src="./assets/ai-for-farmers-intro-farm-numbers.mp4" type="video/mp4">
  <track kind="captions" src="./assets/ai-for-farmers-intro-farm-numbers.vtt" srclang="en-NZ" label="English (NZ)" default>
  Your browser cannot play this video.
</video>

The farm walk's done and your notes are a column of plate meter readings, one paddock you didn't get to, and a rain gauge nobody checked on Monday. An AI chat tool will turn that into a tidy table in under a minute. Left to itself, it may also turn "didn't check" into zero and add Thursday's forecast to the rain you've already had.

> **On the farm:** Feed decisions run on a handful of numbers: average pasture cover, how fast it's growing and how much rain has actually fallen. If one of them is out, you open the wrong paddock, feed out a week early or hold stock on too long.

## Learning outcomes

By the end of this lesson, you will be able to:

- Turn rough farm walk notes into a pasture cover table in kg DM/ha using an AI chat tool.
- Keep measured rain and forecast rain in separate columns.
- Spot a summary that has treated a blank as a zero.
- Ask the AI to show its working and units, then check one figure yourself.

## Where AI earns its keep

ChatGPT, Microsoft Copilot, Google Gemini and Claude all handle the dull part of farm numbers well. They read messy notes, line figures up in a table, sort paddocks by cover for a feed wedge and do simple sums.

What they don't know is what your notes meant. "Not walked" means something to you. To the tool it's a missing number, and some tools fill missing numbers in without saying so.

## Worked example: Hannah's farm walk

The examples come from Ridgeback Farm, the same made-up dairy farm as earlier modules, plus its runoff block where Jack finishes a few lambs and steers. Hannah walked six paddocks with a plate meter on Tuesday and typed this into her phone:

```text
Farm walk Tue 13 Oct, plate meter, kg DM/ha
P1 2650, P2 2400, P3 1850, P4 not walked (gate tied up), P5 3100, P6 1600
Shed gauge: Sat 12mm, Sun 4, Mon ?, Tue 0
MetService: 25-30mm Thursday
```

She pasted it into a chat with this request:

```text
Here are my farm walk notes and rain gauge readings. Make two tables.
Table 1: paddock and cover in kg DM/ha, sorted highest to lowest.
Table 2: day and rain measured at the shed gauge in mm.
If I didn't take a reading, write "not recorded". Don't use zero for it.
Put the forecast on its own line, never in the measured column.
Then give the average cover of the paddocks I actually walked.
Show the sum, how many paddocks you divided by, and the units.
```

### What a good answer looks like

| Paddock | Cover (kg DM/ha) |
| --- | --- |
| P5 | 3,100 |
| P1 | 2,650 |
| P2 | 2,400 |
| P3 | 1,850 |
| P6 | 1,600 |
| P4 | not recorded |

```text
Average cover, 5 walked paddocks:
(3,100 + 2,650 + 2,400 + 1,850 + 1,600) ÷ 5 = 11,600 ÷ 5 = 2,320 kg DM/ha

Measured at shed gauge: Sat 12 mm, Sun 4 mm, Mon not recorded, Tue 0 mm
Total of the three readings: 16 mm
Forecast (MetService): 25-30 mm Thursday. Not added to any total.
```

Because the working is right there, you can check it on your phone's calculator in ten seconds.

### What a bad answer looks like

```text
Average cover 1,933 kg DM/ha. About 46 mm of rain this week.
```

Both figures are wrong, and neither looks odd. Dividing 11,600 by six counts P4 as a paddock with no grass on it. The 46 mm adds the top of Thursday's forecast to the 16 mm Hannah measured. A spring cover of 1,933 kg DM/ha is believable, so nothing makes you stop and look. That's why you ask for the working.

## Blanks are not zeros

Tuesday's 0 mm is a real reading: Hannah looked and the gauge was dry. Monday's question mark means nobody looked, and Monday could have been 2 mm or 20 mm.

Tell the tool what a blank means before it starts. "Not recorded" keeps the gap visible, so you can fill it from a nearby station or leave it. Lesson 3 covers where to find measured weather data.

## Measured, forecast and estimated

Farm numbers come in three kinds, and a summary should never blend them.

| Kind | Examples | What to keep with it |
| --- | --- | --- |
| Measured | Rain gauge, plate meter, scales | Date and where it was taken |
| Forecast | MetService rain, wind or frost outlook | Who issued it and when |
| Estimated | Eye-balled cover, an assumed growth rate | Who made the estimate |

Ask the AI to label each number with its kind. If a growth rate you never gave it turns up in the table, ask where it came from.

## Show the working, check the units

Make these a habit whenever numbers are involved:

- Ask for the sum, the count and the units every time a total or average appears.
- Re-do one figure yourself. If it doesn't match, check them all.
- Watch the units. Cover is kg DM/ha, feed on hand is kg DM and growth is kg DM/ha/day. A dropped "/ha" changes what the number means.

A straight average also treats a 2 ha paddock the same as a 12 ha one. If your paddocks vary a lot in size, give the tool the hectares and ask for an area-weighted average cover.

## Try it

Sam sends you his notes from the back block: "P2 2200, P3 –, P7 2900. Rain Wed 8mm, Thu didn't check, Fri 22 forecast." The AI comes back with "Average cover 1,700 kg DM/ha. 30 mm of rain this week."

<div class="reflection" data-id="ai-for-farmers-intro-farm-numbers-feed-rain-and-forecasts" data-min-chars="40">
<div class="reflection-prompt">What's wrong with each figure, and what would you ask the AI to do instead?</div>
<div class="reflection-answer">

**Model response:** The 1,700 is 5,100 ÷ 3, so P3's dash has been counted as zero. The two walked paddocks average 2,550 kg DM/ha. The 30 mm adds Friday's 22 mm forecast to the 8 mm measured on Wednesday, and Thursday wasn't checked. I'd ask it to mark P3 and Thursday as "not recorded", average only the paddocks Sam walked, show the sum and count, and keep the forecast on its own line.

</div>
</div>

## Key takeaways

- AI tools turn farm walk notes into sorted cover tables in kg DM/ha in seconds.
- Tell the tool a blank means "not recorded", and check it didn't use zero.
- Keep measured, forecast and estimated numbers apart.
- Ask for the sum, count and units behind every average, then re-do one yourself.
- A believable number can still be wrong. The working is how you catch it.

Hannah still walks the paddocks. The tool just saves her the half hour of tidying the numbers afterwards, and asking for the working costs her one extra line in the prompt.
