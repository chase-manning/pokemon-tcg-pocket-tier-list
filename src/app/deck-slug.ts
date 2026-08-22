/** Deck route IDs, e.g. "venusaur-ex-a1-004&bulbasaur-a1-001" -> "venusaur-ex-a1-004&bulbasaur-a1-001". */
export const deckSlug = (name: string): string =>
  name.toLowerCase().replace(/\s/g, "-");
