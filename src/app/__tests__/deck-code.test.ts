import { describe, expect, it } from "vitest";
import { createDeckCode, ENERGY_IDS } from "../deck-code";

// Expected strings are scan-proven against game-generated codes.

describe("createDeckCode", () => {
  it("encodes 2× Bulbasaur and 2× Venusaur ex with Fire energy", () => {
    expect(createDeckCode([1, 1, 4, 4], [2])).toBe("AAQAAAoAAAoAACgAACgBAg==");
  });

  it("stores trainer numbers times ten, like pokémon numbers", () => {
    expect(createDeckCode([1000008])).toBe("AZiW0AA=");
  });

  it("collapses duplicate numbers into one entry", () => {
    expect(createDeckCode([5, 5, 5])).toBe("AAMAADIAADIAADIA");
  });

  it("sorts each segment ascending", () => {
    expect(createDeckCode([300, 2])).toBe("AAIAABQAC7gA");
  });

  it("separates trainers from pokémon across segments", () => {
    expect(createDeckCode([2064, 1000004, 1000004, 89], [4, 7])).toBe(
      "ApiWqJiWqAIAA3oAUKACBAc="
    );
  });

  it("returns null for an empty deck", () => {
    expect(createDeckCode([])).toBeNull();
  });

  it("stores zero-valued entries like any other number", () => {
    expect(createDeckCode([0, 7, 0])).toBe("AAMAAAAAAAAAAEYA");
  });

  it("maps every cost letter to a distinct energy id", () => {
    expect(Object.values(ENERGY_IDS)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it("stores energy ids ascending - the game rejects other orders", () => {
    // Callers pass ids pre-sorted; the game rejects any other order.
    expect(createDeckCode([2064], [2, 4])).toBe("AAEAUKACAgQ=");
    expect(createDeckCode([2064], [4, 2])).toBe("AAEAUKACBAI=");
  });

  it("reproduces a game-generated deck byte for byte", () => {
    expect(
      createDeckCode(
        [
          2064, 2064, 87, 87, 89, 89, 1233,
          1000002, 1000003, 1000003, 1000048, 1000048, 1000128,
          1000152, 1000152, 1000004, 1000004, 1000032, 1000099, 1000099,
        ],
        [7]
      )
    ).toBe("DZiWlJiWnpiWnpiWqJiWqJiXwJiYYJiYYJiaXpiaXpibgJiccJiccAcAA2YAA2YAA3oAA3oAMCoAUKAAUKABBw==");
  });
});
