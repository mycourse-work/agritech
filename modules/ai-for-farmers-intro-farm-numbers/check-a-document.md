# Check a kill sheet or invoice against its source

Allow 3 minutes. All Example Station details are invented.

Document reading can fail before the maths begins. A blurred scan may hide a decimal. A summary may combine rows with different units or periods.

Use this fictional packing invoice extract. It has no money or processor data:

| Line | Quantity | Unit | Source note |
| --- | --- | --- | --- |
| A | 20 | pieces | Clear |
| B | 30 | pieces | Clear |
| C | Unknown | pieces | Blurred |

```text
Extract a draft table from this invented invoice.
Keep the blurred quantity unknown. Show the clear-row subtotal
separately. Do not present it as the document total.
```

The clear-row subtotal is 50 pieces. The full total remains unknown. Compare each extracted row with the source and seek a readable original for C. Never fill a gap using a previous invoice.

## Apply the checks to a kill sheet

A kill sheet is a processor document. For a real private check, confirm permission to use it and work from the original. Ask AI to explain headings or list questions for the processor. Check animal or lot references, document date, counts, units and whether a value is a total or average. Compare any extracted value with its exact row.

For this public demo, no real kill sheet or processor outcome is used. The packing extract teaches the source-checking skill.

Keep a query list for unclear entries. A plausible explanation of a deduction or result still needs evidence from the processor.

<div class="reflection" data-id="farm-numbers-check-a-document" data-min-chars="15">
<p class="reflection-prompt">The AI gives a total of 50 pieces. How should you label that number?</p>
<div class="reflection-answer"><p>It is the subtotal of the two clear rows. The full document total is unknown because C is unreadable.</p></div>
</div>
