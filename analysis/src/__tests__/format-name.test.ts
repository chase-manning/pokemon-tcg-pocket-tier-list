import formatName, { formatMatch } from "../utils/format-name";
import { Card } from "../utils/types";

describe("formatName", () => {
  it("should format a single card name correctly", () => {
    const cards: Card[] = [
      {
        name: "Pikachu",
        count: 2,
        set: "base",
        number: "58",
      },
    ];
    const match = ["Pikachu base 58"];

    const result = formatName(cards, match);
    expect(result).toBe("pikachu-base-058");
  });

  it("should format multiple card names correctly", () => {
    const cards: Card[] = [
      {
        name: "Pikachu",
        count: 2,
        set: "base",
        number: "58",
      },
      {
        name: "Charizard ex",
        count: 1,
        set: "base",
        number: "12",
      },
    ];
    const match = ["Pikachu base 58", "Charizard ex base 12"];

    const result = formatName(cards, match);
    expect(result).toBe("pikachu-base-058&charizard-ex-base-012");
  });

  it("should handle P-A set code correctly", () => {
    const cards: Card[] = [
      {
        name: "Professor's Research",
        count: 2,
        set: "P-A",
        number: "7",
      },
    ];
    const match = ["Professor's Research PA 7"];

    const result = formatName(cards, match);
    expect(result).toBe("professor's-research-pa-007");
  });

  it("should format card name even when card is not in cards array", () => {
    const cards: Card[] = [
      {
        name: "Pikachu",
        count: 2,
        set: "base",
        number: "58",
      },
    ];
    const match = ["Charizard base 4"];

    const result = formatName(cards, match);
    expect(result).toBe("charizard-base-004");
  });

  it("should parse formatMatch identically to prevent opponent battle logic failure", () => {
    // prevents regression of the strict equality bug
    const match = ["Mewtwo ex A1 129", "Charizard ex A2b 10"];
    const result = formatMatch(match);
    expect(result).toBe("mewtwo-ex-a1-129&charizard-ex-a2b-010");
  });
});
