import { describe, expect, it } from "vitest";
import { diffLists, oneSwapAlternatives } from "../deck-diff";
import type { CardType } from "../cards-api";

const card = (id: string): CardType => ({
  id,
  name: id,
  rarity: "",
  pack: "",
  type: "",
  supertype: "",
  health: null,
  stage: null,
  image: "",
  ex: false,
  set: "",
  deckBuilderNr: null,
});

describe("diffLists", () => {
  it("returns an empty diff for identical lists", () => {
    const list = [card("a"), card("a"), card("b")];
    expect(diffLists(list, list)).toEqual({ removed: [], added: [] });
  });

  it("flags one card swapped for another as one removed and one added", () => {
    const reference = [card("a"), card("a"), card("b")];
    const candidate = [card("a"), card("a"), card("c")];
    expect(diffLists(reference, candidate)).toEqual({
      removed: [card("b")],
      added: [card("c")],
    });
  });

  it("flags a count change only as a removal with no addition", () => {
    const reference = [card("a"), card("a"), card("b")];
    const candidate = [card("a"), card("b")];
    expect(diffLists(reference, candidate)).toEqual({
      removed: [card("a")],
      added: [],
    });
  });

  it("flags extra copies as an addition with no removal", () => {
    const reference = [card("a")];
    const candidate = [card("a"), card("a")];
    expect(diffLists(reference, candidate)).toEqual({
      removed: [],
      added: [card("a")],
    });
  });
});

describe("oneSwapAlternatives", () => {
  const best = { cards: [card("a"), card("a"), card("b")], score: 10 };
  const list = (cards: string[], score: number) => ({
    cards: cards.map(card),
    score,
  });

  it("rejects a list differing in three or more slots", () => {
    const alternatives = oneSwapAlternatives(
      best,
      [list(["a", "c", "d"], 9)],
      3
    );
    expect(alternatives).toEqual([]);
  });

  it("keeps a one-for-one swap", () => {
    const alternatives = oneSwapAlternatives(
      best,
      [list(["a", "a", "c"], 9)],
      3
    );
    expect(alternatives).toEqual([
      {
        list: list(["a", "a", "c"], 9),
        diff: { removed: [card("b")], added: [card("c")] },
      },
    ]);
  });

  it("keeps a swap of both copies of one card for both of another", () => {
    const twoCopyBest = { cards: [card("a"), card("a"), card("b")], score: 10 };
    const alternatives = oneSwapAlternatives(
      twoCopyBest,
      [list(["c", "c", "b"], 9)],
      3
    );
    expect(alternatives).toEqual([
      {
        list: list(["c", "c", "b"], 9),
        diff: {
          removed: [card("a"), card("a")],
          added: [card("c"), card("c")],
        },
      },
    ]);
  });

  it("drops a two-slot difference that is no swap", () => {
    const alternatives = oneSwapAlternatives(best, [list(["b"], 8)], 3);
    expect(alternatives).toEqual([]);
  });

  it("orders best-scoring first and honours the limit", () => {
    const alternatives = oneSwapAlternatives(
      best,
      [
        list(["a", "a", "c"], 9),
        list(["a", "a", "d"], 8),
        list(["a", "a", "e"], 7),
        list(["a", "a", "f"], 6),
      ],
      3
    );
    expect(alternatives.map(({ list: l }) => l.score)).toEqual([9, 8, 7]);
  });

  it("fills the limit with valid swaps even when an invalid candidate scores higher", () => {
    const alternatives = oneSwapAlternatives(
      best,
      [
        list(["a", "c", "d"], 12),
        list(["a", "a", "c"], 9),
        list(["a", "a", "d"], 8),
        list(["a", "a", "e"], 7),
      ],
      3
    );
    expect(alternatives.map(({ list: l }) => l.score)).toEqual([9, 8, 7]);
  });
});
