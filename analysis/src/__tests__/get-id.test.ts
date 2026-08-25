import getId from "../utils/get-id";
import { Deck } from "../utils/types";

describe("getId", () => {
  it("should generate a consistent hash for the same deck", () => {
    const deck: Deck = {
      id: "test-id",
      name: "Test Deck",
      cards: [
        {
          name: "Pikachu",
          count: 4,
          set: "base",
          number: "58",
        },
        {
          name: "Charizard ex",
          count: 2,
          set: "base",
          number: "12",
        },
      ],
      pokemon: 6,
      differentPokemon: 2,
      winCount: 0,
      lossCount: 0,
      totalGames: 0,
      date: "2024-03-20",
      tournamentExPercent: 0,
      noTrainerPercent: 0,
      wins: [],
      losses: [],
    };

    const hash1 = getId(deck);
    const hash2 = getId(deck);
    expect(hash1).toBe(hash2);
  });

  it("should generate different hashes for different decks", () => {
    const deck1: Deck = {
      id: "test-id-1",
      name: "Test Deck 1",
      cards: [
        {
          name: "Pikachu",
          count: 4,
          set: "base",
          number: "58",
        },
      ],
      pokemon: 4,
      differentPokemon: 1,
      winCount: 0,
      lossCount: 0,
      totalGames: 0,
      date: "2024-03-20",
      tournamentExPercent: 0,
      noTrainerPercent: 0,
      wins: [],
      losses: [],
    };

    const deck2: Deck = {
      id: "test-id-2",
      name: "Test Deck 2",
      cards: [
        {
          name: "Pikachu",
          count: 3,
          set: "base",
          number: "58",
        },
      ],
      pokemon: 3,
      differentPokemon: 1,
      winCount: 0,
      lossCount: 0,
      totalGames: 0,
      date: "2024-03-20",
      tournamentExPercent: 0,
      noTrainerPercent: 0,
      wins: [],
      losses: [],
    };

    const hash1 = getId(deck1);
    const hash2 = getId(deck2);
    expect(hash1).not.toBe(hash2);
  });
});
