import getDecks from "../utils/get-decks";

describe("getDecks", () => {
  const previousDecksFile = process.env.DECKS_FILE;

  beforeEach(() => {
    process.env.DECKS_FILE = "./src/__fixtures__/decks.json";
  });

  afterEach(() => {
    if (previousDecksFile === undefined) {
      delete process.env.DECKS_FILE;
    } else {
      process.env.DECKS_FILE = previousDecksFile;
    }
  });

  it("should return decks", () => {
    const decks = getDecks();
    expect(decks.length).toBeGreaterThan(0);

    // Check the first deck rather than a random one, so the assertion is reproducible.
    const testDeck = decks[0];
    expect(testDeck.id).toBeDefined();
    expect(testDeck.id.length).toBeGreaterThan(10);
    expect(testDeck.cards.length).toBeGreaterThan(0);
    expect(
      testDeck.cards.every(
        (card) => card.name && typeof card.name === "string"
      )
    ).toBe(true);
    expect(
      testDeck.cards.every(
        (card) => card.count && typeof card.count === "number" && card.count > 0
      )
    ).toBe(true);
    expect(
      testDeck.cards.every((card) => card.set && typeof card.set === "string")
    ).toBe(true);
    expect(
      testDeck.cards.every(
        (card) => card.number && typeof card.number === "string"
      )
    ).toBe(true);
    expect(testDeck.pokemon).toBeGreaterThan(0);
    expect(testDeck.differentPokemon).toBeGreaterThan(0);
    expect(testDeck.winCount).toBeDefined();
    expect(testDeck.lossCount).toBeDefined();
    expect(testDeck.totalGames).toBeGreaterThan(0);
    expect(new Date(testDeck.date).toISOString()).toBeDefined();
    expect(testDeck.tournamentExPercent).toBeDefined();
    expect(testDeck.wigglytuffPercent).toBeDefined();
    expect(testDeck.noTrainerPercent).toBeDefined();
    expect(testDeck.wins).toBeDefined();
    expect(testDeck.wins.length + testDeck.losses.length).toBeGreaterThan(0);
    expect(testDeck.losses).toBeDefined();
    expect(testDeck.name).toBeDefined();
    expect(testDeck.name.length).toBeGreaterThan(0);
  });
});
