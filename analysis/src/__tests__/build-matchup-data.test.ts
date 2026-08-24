import { buildMatchupData } from "../utils/build-matchup-data";

describe("buildMatchupData", () => {
  it("appends a Total row summing every opponent's wins and losses", () => {
    const matchupResults = {
      "Deck A": {
        "Opponent 1": { wins: 3, losses: 1 },
        "Opponent 2": { wins: 2, losses: 4 },
      },
    };

    const result = buildMatchupData(matchupResults);

    expect(result["Deck A"]).toHaveLength(3); // 2 opponents + Total
    const total = result["Deck A"].find((row) => row.name === "Total")!;
    expect(total.totalGames).toBe(10); // 3+1+2+4
    expect(total.winRate).toBeCloseTo(0.5); // (3+2) / 10
  });

  it("a deck with zero recorded games yields a Total row with winRate 0, not NaN", () => {
    const matchupResults = { "Deck A": {} };

    const result = buildMatchupData(matchupResults);

    const total = result["Deck A"].find((row) => row.name === "Total")!;
    expect(total.totalGames).toBe(0);
    expect(total.winRate).toBe(0);
    expect(Number.isNaN(total.winRate)).toBe(false);
  });

  it("per-opponent winRate is 0 not NaN when that matchup has 0 recorded games", () => {
    const matchupResults = {
      "Deck A": { "Opponent 1": { wins: 0, losses: 0 } },
    };

    const result = buildMatchupData(matchupResults);

    const opponentRow = result["Deck A"].find((row) => row.name === "Opponent 1")!;
    expect(opponentRow.winRate).toBe(0);
  });
});
