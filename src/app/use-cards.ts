import { useQuery } from "@tanstack/react-query";
import { CardType, fetchCards } from "./cards-api";
import useFilters from "./use-filters";
import useMissing from "./use-missing";

export interface CardScoreType extends CardType {
  count: number;
  score: number;
  popularity: number;
}

export const setCode = (set: string): string => {
  if (set === "P-A") return "pa";
  if (set === "P-B") return "pb";
  return set.toLowerCase();
};

const cardNameToCount = (name: string): number => {
  const parts = name.split(" ");
  const count = parts[0];
  return parseInt(count ?? "0");
};

const cardNameToId = (name: string): string => {
  const parts = name.split(" ");
  const id = parts[parts.length - 1];
  const padded = id.padStart(3, "0");
  const set = parts[parts.length - 2];
  return `${setCode(set)}-${padded}`;
};

const cardNameToSet = (name: string): string => {
  const parts = name.split(" ");
  return setCode(parts[parts.length - 2]);
};

const useCards = (amount: number = 30): CardScoreType[] | null => {
  const { expansion } = useFilters();
  const { missing: collected } = useMissing();

  const { data: cardData } = useQuery<CardType[]>({
    queryKey: ["cards"],
    queryFn: fetchCards,
  });

  const { data: cards } = useQuery({
    queryKey: ["card-scores"],
    queryFn: async () => {
      const response = await fetch("/data/card-scores.json");
      return (await response.json()) as CardScoreType[];
    },
  });

  if (!cardData || !cards) return null;

  const collectedCounts = collected.reduce<Record<string, number>>((acc, id) => {
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {});

  const sortedCards = cards
      .filter((card: CardScoreType) => {
        const id = cardNameToId(card.name);
        const count = cardNameToCount(card.name);
        const collectedCount = collectedCounts[id] || 0;
        return count - collectedCount > 0;
      })
      .sort((a: CardScoreType, b: CardScoreType) => b.score - a.score);

  const seenIds = new Set<string>();
  const unresolvedIds = new Set<string>();
  const outputCards: CardScoreType[] = [];

  for (const card of sortedCards) {
    const set = cardNameToSet(card.name);
    if (expansion && set !== expansion) continue;

    const id = cardNameToId(card.name);
    if (seenIds.has(id)) continue;
    seenIds.add(id);

    const count = cardNameToCount(card.name);
    const collectedCount = collectedCounts[id] || 0;
    const cardInfo = cardData.find((c: CardType) => c.id === id);
    if (!cardInfo) {
      unresolvedIds.add(id);
      continue;
    }

    const score = Math.sqrt(card.score);

    outputCards.push({
      ...cardInfo,
      score,
      popularity: card.popularity,
      set,
      count: Math.max(0, count - collectedCount),
    });
  }

  if (unresolvedIds.size > 0) {
    console.warn(
        `Skipped ${unresolvedIds.size} scored card id(s) missing from the card data: ${Array.from(
            unresolvedIds
        ).join(", ")}`
    );
  }

  return outputCards
      .sort((a: CardScoreType, b: CardScoreType) => b.popularity - a.popularity)
      .slice(0, amount)
      .sort((a: CardScoreType, b: CardScoreType) => b.score - a.score);
};

export default useCards;