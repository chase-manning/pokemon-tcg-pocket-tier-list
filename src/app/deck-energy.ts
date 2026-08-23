import { ENERGY_IDS } from "./deck-code";

interface Attack {
  cost: string | null;
}
interface InferEnergyCard {
  supertype: string;
  deckBuilderNr: number;
  attacks?: Record<string, Attack>;
}

// Splash cards whose printed element never implies a deck energy.
const EXCLUDED_DECK_BUILDER_NR = new Set<number>([89, 1383, 1203, 552]);

// Every print of Lightning Oricorio shares this number and always brings
// Lightning energy.
const FORCED_LIGHTNING_NR = new Set<number>([647]);

const MAX_ENERGIES = 3;

function tallyLetters(cards: InferEnergyCard[], skipExcluded: boolean): Map<string, number> {
  const counts = new Map<string, number>();
  for (const card of cards) {
    if (card.supertype !== "Pokémon") continue;
    if (skipExcluded && EXCLUDED_DECK_BUILDER_NR.has(card.deckBuilderNr)) continue;
    const forced = FORCED_LIGHTNING_NR.has(card.deckBuilderNr);
    if (forced) {
      counts.set("L", (counts.get("L") ?? 0) + 1);
      continue;
    }
    for (const key of ["1", "2"]) {
      const cost = card.attacks?.[key]?.cost;
      if (!cost || cost === "0") continue;
      for (const letter of cost) {
        if (ENERGY_IDS[letter]) {
          counts.set(letter, (counts.get(letter) ?? 0) + 1);
        }
      }
    }
  }
  return counts;
}

export function inferEnergyIds(cards: InferEnergyCard[]): number[] {
  let counts = tallyLetters(cards, true);
  if (counts.size === 0) {
    counts = tallyLetters(cards, false);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, MAX_ENERGIES)
    .map(([letter]) => ENERGY_IDS[letter])
    .sort((a, b) => a - b);
}

export { EXCLUDED_DECK_BUILDER_NR, FORCED_LIGHTNING_NR };
