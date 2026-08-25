import { populateDeckNames } from "../utils/populate-deck-names";
import { Deck } from "../utils/types";

jest.mock("../utils/get-deck-name", () => ({
  __esModule: true,
  default: (deck: Deck) => (deck.id === "valid-id" ? "Test Deck Name" : null),
}));

describe("populateDeckNames", () => {
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

  it("should populate deck names and create idToName mapping", () => {
    const validDeck: Deck = {
      ...mockDeck,
      id: "valid-id",
    };
    const invalidDeck: Deck = {
      ...mockDeck,
      id: "invalid-id",
    };
    const decks = [validDeck, invalidDeck];

    const { decks: resultDecks, idToName } = populateDeckNames(decks);

    expect(resultDecks).toHaveLength(1);
    expect(resultDecks[0].name).toBe("Test Deck Name");
    expect(idToName).toEqual({
      "valid-id": "Test Deck Name",
    });
  });

  it("should skip decks that don't get a name", () => {
    const invalidDeck1: Deck = {
      ...mockDeck,
      id: "invalid-id-1",
    };
    const invalidDeck2: Deck = {
      ...mockDeck,
      id: "invalid-id-2",
    };
    const decks = [invalidDeck1, invalidDeck2];

    const { decks: resultDecks, idToName } = populateDeckNames(decks);

    expect(resultDecks).toHaveLength(0);
    expect(idToName).toEqual({});
  });
});
