import { describe, expect, it } from "vitest";
import { deckDisplayName, formatArchetypeId } from "../deck-display";
import type { CardType } from "../cards-api";

const icon = (name: string): CardType => ({
  id: name,
  name,
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

describe("deckDisplayName", () => {
  it("joins both icons with a slash", () => {
    expect(
      deckDisplayName({
        name: "venusaur-a1-004&bulbasaur-a1-001",
        iconPrimary: icon("Venusaur ex"),
        iconSecondary: icon("Bulbasaur"),
      })
    ).toBe("Venusaur ex / Bulbasaur");
  });

  it("returns just the primary when there is no secondary", () => {
    expect(
      deckDisplayName({
        name: "mega-lucario-ex-b3-081",
        iconPrimary: icon("Lucario ex"),
        iconSecondary: null,
      })
    ).toBe("Lucario ex");
  });

  it("falls back to the formatted archetype id when neither icon resolved", () => {
    expect(deckDisplayName({ name: "mega-lucario-ex-b3-081" })).toBe(
      "Mega Lucario Ex B3 081"
    );
  });
});

describe("formatArchetypeId", () => {
  it("title-cases a hyphenated id", () => {
    expect(formatArchetypeId("mega-lucario-ex-b3-081")).toBe(
      "Mega Lucario Ex B3 081"
    );
  });

  it("keeps the ampersand joining a two-icon archetype", () => {
    expect(formatArchetypeId("baxcalibur-b2a-036&suicune-ex-a4a-020")).toBe(
      "Baxcalibur B2a 036&Suicune Ex A4a 020"
    );
  });
});
