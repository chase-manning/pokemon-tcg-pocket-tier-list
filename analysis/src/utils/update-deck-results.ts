import { Deck } from "./types";
import OPPONENTS, { Opponent } from "../opponents";
import { OPPONENT_BATTLE } from "../settings";
import { formatMatch } from "./format-name";

const convertToNames = (ids: string[], idToName: Record<string, string>) => {
  return ids.map((id) => idToName[id]).filter((name) => name);
};

export const updateDeckResults = (
  decks: Deck[],
  idToName: Record<string, string>
): Deck[] => {
  // If it's an opponent battle, we update the winCount and lossCount to only match the local opponents
  if (OPPONENT_BATTLE) {
    const opponents = OPPONENTS.slice(0, 100).map((opponent: Opponent) => {
      const match = Array.isArray(opponent) ? opponent : [opponent];
      return formatMatch(match);
    });
    return decks.map((deck) => {
      const wins = convertToNames(deck.wins, idToName);
      const losses = convertToNames(deck.losses, idToName);
      let winCount = 0;
      let lossCount = 0;
      for (const win of wins) {
        winCount += opponents.filter((opponent) => opponent === win).length;
      }
      for (const loss of losses) {
        lossCount += opponents.filter((opponent) => opponent === loss).length;
      }
      return {
        ...deck,
        winCount,
        lossCount,
        wins,
        losses,
      };
    });
  }

  return decks.map((deck) => ({
    ...deck,
    wins: convertToNames(deck.wins, idToName),
    losses: convertToNames(deck.losses, idToName),
  }));
};
