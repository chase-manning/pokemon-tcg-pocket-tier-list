import { fixPokeballCards } from "../utils/fix-pokeball-cards";
import { Deck } from "../utils/types";

describe("fixPokeballCards", () => {
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

  it("should fix Poké Ball card with number 111", () => {
    const deck: Deck = {
      ...mockDeck,
      cards: [
        { name: "Poké Ball", count: 1, set: "SVI", number: "111" },
        { name: "Poké Ball", count: 1, set: "P-A", number: "5" },
      ],
    };

    const result = fixPokeballCards([deck]);

    expect(result[0].cards).toEqual([
      { name: "Poké Ball", count: 1, set: "P-A", number: "5" },
      { name: "Poké Ball", count: 1, set: "P-A", number: "5" },
    ]);
  });

  it("should not modify other cards", () => {
    const deck: Deck = {
      ...mockDeck,
      cards: [
        { name: "Poké Ball", count: 1, set: "SVI", number: "111" },
        { name: "Charizard", count: 1, set: "SVI", number: "1" },
      ],
    };

    const result = fixPokeballCards([deck]);

    expect(result[0].cards).toEqual([
      { name: "Poké Ball", count: 1, set: "P-A", number: "5" },
      { name: "Charizard", count: 1, set: "SVI", number: "1" },
    ]);
  });

  it("should not modify Poké Ball cards with different numbers", () => {
    const deck: Deck = {
      ...mockDeck,
      cards: [
        { name: "Poké Ball", count: 1, set: "SVI", number: "110" },
        { name: "Poké Ball", count: 1, set: "SVI", number: "112" },
      ],
    };

    const result = fixPokeballCards([deck]);

    expect(result[0].cards).toEqual([
      { name: "Poké Ball", count: 1, set: "SVI", number: "110" },
      { name: "Poké Ball", count: 1, set: "SVI", number: "112" },
    ]);
  });
});
