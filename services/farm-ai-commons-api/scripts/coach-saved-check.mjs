// What a rain card must have before it goes in a saved-runs file. The course player drops a
// saved card with no rows or no text, and then the lesson has no "saved figures" to fall back on.
// Returns '' for a good card, or the reason it can't be saved.
export function cardProblem(card) {
  if (!card || typeof card !== 'object') return 'no rain card';
  if (!Array.isArray(card.rows) || !card.rows.length) return 'the card has no rows (is the rain card rows change deployed to the rain API?)';
  if (card.rows.some((r) => !r || typeof r.label !== 'string' || !r.label || typeof r.value !== 'string' || !r.value)) return 'the card has a row with no label or no value';
  if (typeof card.text !== 'string' || !card.text.trim()) return 'the card has no text';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(card.made || '')) return `the card's date is not a plain date (${card.made})`;
  const down = card.rows.find((r) => r.value === 'Not available');
  if (down) return `a data source was down when the card was made (${down.label})`;
  return '';
}
