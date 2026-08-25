import { updateDeckResults } from "../utils/update-deck-results";
import { Deck } from "../utils/types";

describe("updateDeckResults", () => {
  const mockDeck: Deck = {
    id: "test-id",
    cards: [],
    pokemon: 0,
    differentPokemon: 0,
    winCount: 0,
    lossCount: 0,
    totalGames: 0,
    date: new Date().toISOString(),
    tournamentExPercent: 0,
    noTrainerPercent: 0,
    wins: [],
    losses: [],
    name: "Test Deck",
  };

  it("should update wins and losses with deck names", () => {
    const deck: Deck = {
      ...mockDeck,
      wins: ["win-id-1", "win-id-2", "invalid-win"],
      losses: ["loss-id-1", "invalid-loss"],
    };

    const idToName = {
      "win-id-1": "Win Deck 1",
      "win-id-2": "Win Deck 2",
      "loss-id-1": "Loss Deck 1",
    };

    const result = updateDeckResults([deck], idToName);

    expect(result[0].wins).toEqual(["Win Deck 1", "Win Deck 2"]);
    expect(result[0].losses).toEqual(["Loss Deck 1"]);
  });

  it("should handle decks with no wins or losses", () => {
    const deck: Deck = {
      ...mockDeck,
      wins: [],
      losses: [],
    };

    const idToName = {};

    const result = updateDeckResults([deck], idToName);

    expect(result[0].wins).toEqual([]);
    expect(result[0].losses).toEqual([]);
  });
});
