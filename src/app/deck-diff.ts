import type { CardType } from "./cards-api";

export const countById = (cards: CardType[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const card of cards) counts.set(card.id, (counts.get(card.id) ?? 0) + 1);
  return counts;
};

export interface ListDiff {
  removed: CardType[];
  added: CardType[];
}

export const diffLists = (
  reference: CardType[],
  candidate: CardType[]
): ListDiff => {
  const refCounts = countById(reference);
  const candCounts = countById(candidate);
  const byId = new Map<string, CardType>();
  for (const card of reference) if (!byId.has(card.id)) byId.set(card.id, card);
  for (const card of candidate) if (!byId.has(card.id)) byId.set(card.id, card);

  const removed: CardType[] = [];
  const added: CardType[] = [];

  for (const [id, ref] of refCounts) {
    const card = byId.get(id)!;
    for (let i = ref - (candCounts.get(id) ?? 0); i > 0; i--) removed.push(card);
  }
  for (const [id, cand] of candCounts) {
    const ref = refCounts.get(id) ?? 0;
    const card = byId.get(id)!;
    for (let i = cand - ref; i > 0; i--) added.push(card);
  }

  return { removed, added };
};

export const oneSwapAlternatives = <L extends { cards: CardType[]; score: number }>(
  bestList: L,
  lists: L[],
  limit: number
): Array<{ list: L; diff: ListDiff }> =>
  lists
    .map((list) => ({ list, diff: diffLists(bestList.cards, list.cards) }))
    .filter(({ diff }) => diff.removed.length + diff.added.length === 2)
    .sort((a, b) => b.list.score - a.list.score)
    .slice(0, limit)
    // Sorting and slicing before dropping non-swaps keeps the original
    // render order and count.
    .filter(({ diff }) => diff.removed.length === 1 && diff.added.length === 1);
