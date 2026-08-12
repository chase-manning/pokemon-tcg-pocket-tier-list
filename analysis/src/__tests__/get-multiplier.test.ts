import getMultiplier from "../utils/get-multiplier";
import {
  EXPANSION_RELEASE_DATE,
  OLD_MULTIPLIER,
  NEW_MULTIPLIER,
} from "../settings";
import { Deck } from "../utils/types";

describe("getMultiplier", () => {
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
    wigglytuffPercent: 0,
    noTrainerPercent: 0,
    wins: [],
    losses: [],
    name: "Test Deck",
  };

  it("should return NEW_MULTIPLIER for the newest deck", () => {
    const newestDate = new Date(EXPANSION_RELEASE_DATE);
    newestDate.setDate(newestDate.getDate() + 30);

    const deck: Deck = {
      ...mockDeck,
      date: newestDate.toISOString(),
    };

    const result = getMultiplier(deck, newestDate);
    expect(result).toBe(NEW_MULTIPLIER);
  });

  it("should return OLD_MULTIPLIER for decks at the expansion date", () => {
    const deck: Deck = {
      ...mockDeck,
      date: EXPANSION_RELEASE_DATE.toISOString(),
    };

    const newestDate = new Date(EXPANSION_RELEASE_DATE);
    newestDate.setDate(newestDate.getDate() + 30);

    const result = getMultiplier(deck, newestDate);
    expect(result).toBeCloseTo(OLD_MULTIPLIER, 5);
  });

  it("should return midpoint multiplier for decks halfway between expansion and newest", () => {
    const newestDate = new Date(EXPANSION_RELEASE_DATE);
    newestDate.setDate(newestDate.getDate() + 30);

    const midDate = new Date(EXPANSION_RELEASE_DATE);
    midDate.setDate(midDate.getDate() + 15);

    const deck: Deck = {
      ...mockDeck,
      date: midDate.toISOString(),
    };

    const result = getMultiplier(deck, newestDate);
    const expectedMultiplier = (OLD_MULTIPLIER + NEW_MULTIPLIER) / 2;
    expect(result).toBeCloseTo(expectedMultiplier, 1);
  });

  it("should interpolate linearly between OLD_MULTIPLIER and NEW_MULTIPLIER", () => {
    const newestDate = new Date(EXPANSION_RELEASE_DATE);
    newestDate.setDate(newestDate.getDate() + 30);

    const quarterDate = new Date(
      EXPANSION_RELEASE_DATE.getTime() +
        0.25 * (newestDate.getTime() - EXPANSION_RELEASE_DATE.getTime())
    );

    const deck: Deck = {
      ...mockDeck,
      date: quarterDate.toISOString(),
    };

    const result = getMultiplier(deck, newestDate);
    const expectedMultiplier =
      0.25 * (NEW_MULTIPLIER - OLD_MULTIPLIER) + OLD_MULTIPLIER;
    expect(result).toBeCloseTo(expectedMultiplier, 1);
  });

  it("prevents zero division NaN cascading if newest game is on release day", () => {
    const deck: Deck = {
      ...mockDeck,
      date: EXPANSION_RELEASE_DATE.toISOString(),
    };

    // totalTime evaluates to 0 here
    const result = getMultiplier(deck, EXPANSION_RELEASE_DATE);

    expect(result).not.toBeNaN();
    expect(result).toBeDefined();
  });
});
