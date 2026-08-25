import { SortBy } from "../components/FilterContext";
import { MatchupType } from "../contexts/DecksContext";
import { FullDeckType } from "../contexts/DecksContext";

export const getSortValue = (deck: FullDeckType, sortBy: SortBy): number => {
  if (sortBy === SortBy.SCORE) return deck.score;
  if (sortBy === SortBy.POPULARITY) return deck.popularity;
  if (sortBy === SortBy.STRENGTH) return deck.strength;
  if (sortBy === SortBy.WIN_RATE) {
    return deck.matchups.find((m: MatchupType) => m.name === "Total")?.winRate ?? 0;
  }
  return 0;
};
