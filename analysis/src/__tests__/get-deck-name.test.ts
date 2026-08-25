import getDeckName from "../utils/get-deck-name";
import { Deck } from "../utils/types";

describe("getDeckName", () => {
  it("should return correct name for a deck with two main cards", () => {
    const deck: Deck = {
      id: "test-id",
      name: "Test Deck",
      cards: [
        {
          name: "Mimikyu ex",
          count: 2,
          set: "B2",
          number: "73",
        },
        {
          name: "Giratina ex",
          count: 2,
          set: "A2b",
          number: "35",
        },
      ],
      pokemon: 4,
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

    const result = getDeckName(deck);
    expect(result).toBe("mimikyu-ex-b2-073&giratina-ex-a2b-035");
  });

  it("should return correct name for a deck with one main card", () => {
    const deck: Deck = {
      id: "test-id",
      name: "Test Deck",
      cards: [
        {
          name: "Magnezone",
          count: 2,
          set: "A2",
          number: "53",
        },
      ],
      pokemon: 2,
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

    const result = getDeckName(deck);
    expect(result).toBe("magnezone-a2-053");
  });

  it("should return correct name for a deck with one main card and one side card", () => {
    const deck: Deck = {
      id: "test-id",
      name: "Test Deck",
      cards: [
        {
          name: "Suicune ex",
          count: 2,
          set: "A4a",
          number: "20",
        },
        {
          name: "Greninja",
          count: 2,
          set: "A1",
          number: "89",
        },
      ],
      pokemon: 4,
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

    const result = getDeckName(deck);
    expect(result).toBe("suicune-ex-a4a-020&greninja-a1-089");
  });

  it("should return null for a deck with no matching cards", () => {
    const deck: Deck = {
      id: "test-id",
      name: "Test Deck",
      cards: [
        {
          name: "Random Card",
          count: 2,
          set: "A1",
          number: "1",
        },
      ],
      pokemon: 2,
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

    const result = getDeckName(deck);
    expect(result).toBe("professor's-research-pa-007");
  });
});
