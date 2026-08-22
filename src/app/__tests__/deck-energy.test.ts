import { inferEnergyIds, EXCLUDED_DECK_BUILDER_NR, FORCED_LIGHTNING_NR } from "../deck-energy";
import cases from "../__fixtures__/energy-inference.json";

interface CaseAttack {
  cost: string | null;
}
interface CaseCard {
  supertype: string;
  subtype: string;
  deckBuilderNr: number;
  attacks?: Record<string, CaseAttack>;
}

const asCards = (rows: [number, string][]): CaseCard[] =>
  rows.map(([nr, letters]) => ({
    supertype: "Pokémon",
    subtype: "Grass",
    deckBuilderNr: nr,
    attacks: { "1": { cost: letters || null } },
  }));

describe("inferEnergyIds", () => {
  it.each(Object.entries(cases as unknown as Record<string, { pokemon: [number, string][]; expected: number[] }>))(
    "matches the recorded outcome for %s",
    (_slug, testCase) => {
      expect(inferEnergyIds(asCards(testCase.pokemon))).toEqual(testCase.expected);
    }
  );

  it("ignores trainers and colourless-only costs", () => {
    const cards: CaseCard[] = [
      { supertype: "Trainer", subtype: "Item", deckBuilderNr: 1000011 },
      { supertype: "Pokémon", subtype: "Colorless", deckBuilderNr: 999, attacks: { "1": { cost: "CCCC" } } },
    ];
    expect(inferEnergyIds(cards)).toEqual([]);
  });

  it("forces lightning for every print sharing the Oricorio number", () => {
    const cards: CaseCard[] = [
      { supertype: "Pokémon", subtype: "Darkness", deckBuilderNr: 2064, attacks: { "1": { cost: "DDC" } } },
      { supertype: "Pokémon", subtype: "Lightning", deckBuilderNr: 647, attacks: { "1": { cost: "LC" } } },
    ];
    expect(inferEnergyIds(cards)).toEqual([4, 7]);
  });

  it("re-admits excluded cards when they are the only candidates", () => {
    const cards: CaseCard[] = [
      { supertype: "Pokémon", subtype: "Psychic", deckBuilderNr: 1203, attacks: { "1": { cost: "PP" } } },
    ];
    expect(inferEnergyIds(cards)).toEqual([5]);
  });

  it("caps at three energies, alphabetical among ties", () => {
    const cards: CaseCard[] = [
      { supertype: "Pokémon", subtype: "Water", deckBuilderNr: 1, attacks: { "1": { cost: "WMC" } } },
      { supertype: "Pokémon", subtype: "Psychic", deckBuilderNr: 2, attacks: { "1": { cost: "WP" } } },
    ];
    expect(inferEnergyIds(cards)).toEqual([3, 5, 8]);
  });

  it("keys outliers on deckBuilderNr so alternate prints behave identically", () => {
    expect(EXCLUDED_DECK_BUILDER_NR.has(89)).toBe(true);
    expect(FORCED_LIGHTNING_NR.has(647)).toBe(true);
  });
});
