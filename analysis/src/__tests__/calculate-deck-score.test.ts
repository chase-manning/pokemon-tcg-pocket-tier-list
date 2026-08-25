import { calculateDeckScore } from "../utils/calculate-deck-score";
import { Deck } from "../utils/types";

describe("calculateDeckScore", () => {
  it("should calculate deck score correctly", () => {
    const mockCards = {
      Pikachu: { winCount: 10, totalGames: 20, score: 0.8 },
      Charizard: { winCount: 15, totalGames: 20, score: 0.9 },
    };

    const mockDeck: Deck = {
      id: "test-1",
      name: "Test Deck",
      cards: [
        { name: "Pikachu", count: 2, set: "base", number: "1" },
        { name: "Charizard", count: 1, set: "base", number: "2" },
      ],
      pokemon: 3,
      differentPokemon: 2,
      winCount: 10,
      lossCount: 5,
      totalGames: 15,
      date: "2024-01-01",
      tournamentExPercent: 0,
      noTrainerPercent: 0,
      wins: [],
      losses: [],
    };

    const matchingGames = 20;
    const allGames = 100;

    const score = calculateDeckScore(
      mockDeck,
      mockCards,
      matchingGames,
      allGames
    );
    expect(score.score).toBeGreaterThan(0);
    expect(score.popularity).toBeGreaterThan(0);
  });
});
