import { calculateMatchupResults } from "../utils/calculate-matchup-results";
import { Deck } from "../utils/types";

describe("calculateMatchupResults", () => {
  it("should calculate matchup results correctly", () => {
    const mockDecks: Deck[] = [
      {
        id: "test-1",
        name: "Test Deck",
        cards: [],
        pokemon: 0,
        differentPokemon: 0,
        winCount: 1,
        lossCount: 1,
        totalGames: 2,
        date: "2024-01-01",
        tournamentExPercent: 0,
        noTrainerPercent: 0,
        wins: ["Opponent1"],
        losses: ["Opponent2"],
      },
      {
        id: "test-2",
        name: "Test Deck",
        cards: [],
        pokemon: 0,
        differentPokemon: 0,
        winCount: 1,
        lossCount: 0,
        totalGames: 1,
        date: "2024-01-01",
        tournamentExPercent: 0,
        noTrainerPercent: 0,
        wins: ["Opponent2"],
        losses: [],
      },
    ];

    const result = calculateMatchupResults(mockDecks, "Test Deck");

    expect(result["Opponent1"].wins).toBe(1);
    expect(result["Opponent1"].losses).toBe(0);
    expect(result["Opponent2"].wins).toBe(1);
    expect(result["Opponent2"].losses).toBe(1);
  });

  it("weights wins and losses by each deck's multiplier", () => {
    const mockDecks: Deck[] = [
      {
        id: "old",
        name: "Test Deck",
        cards: [],
        pokemon: 0,
        differentPokemon: 0,
        winCount: 1,
        lossCount: 1,
        totalGames: 2,
        date: "2024-01-01",
        tournamentExPercent: 0,
        noTrainerPercent: 0,
        wins: ["Foe"],
        losses: ["Foe"],
        multiplier: 1,
      },
      {
        id: "new",
        name: "Test Deck",
        cards: [],
        pokemon: 0,
        differentPokemon: 0,
        winCount: 1,
        lossCount: 0,
        totalGames: 1,
        date: "2024-02-01",
        tournamentExPercent: 0,
        noTrainerPercent: 0,
        wins: ["Foe"],
        losses: [],
        multiplier: 3,
      },
    ];

    const result = calculateMatchupResults(mockDecks, "Test Deck");

    // 1 win @ 1x + 1 win @ 3x = 4 ; 1 loss @ 1x = 1
    expect(result["Foe"].wins).toBe(4);
    expect(result["Foe"].losses).toBe(1);
  });
});
