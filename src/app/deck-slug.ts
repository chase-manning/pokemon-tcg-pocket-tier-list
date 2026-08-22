/** Deck route IDs, e.g. "Greninja ex & Oricorio" -> "greninja-ex-&-oricorio". */
export const deckSlug = (name: string): string =>
  name.toLowerCase().replace(/\s/g, "-");
