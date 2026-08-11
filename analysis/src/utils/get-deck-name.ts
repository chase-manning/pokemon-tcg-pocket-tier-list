import cardToString from "./card-to-string";
import { Deck } from "./types";
import formatName from "./format-name";

type CardNameType = string | string[];

interface Architype {
  primary: CardNameType;
  secondary: CardNameType[];
}
const ALOLAN_NINETALES = ["Alolan Ninetales ex B2 29", "Alolan Ninetales A3 41"];
const ALTARIA = ["Mega Altaria ex B1 102", "Altaria B1 197"];
const BABY_ENERGY = ["Pichu A4 66", "Magby A4 22", "Mantyke A4a 23"];
const BLASTOISE = ["Blastoise ex A1 56", "Mega Blastoise ex B1a 20", "Blastoise A1 55", "Blastoise B1a 19"];
const BLAZIKEN = ["Mega Blaziken ex B1 36", "Juliana B3a 71"];
const BUZZWOLE = ["Buzzwole ex A3a 6", "Buzzwole B2 14"];
const CHARIZARD = ["Mega Charizard X ex B2b 9", "Mega Charizard Y ex B1a 14", "Charizard ex A2b 10", "Charizard ex A1 36", "Charizard B1a 13", "Charizard A1 35"];
const DARK_SUPPORT = ["Mega Absol ex B1 151", "Mega Sableye ex B3b 41", "Darkrai ex A2 110"];
const DECIDUEYE = ["Decidueye ex A3 12", "Decidueye A3a 5"];
const DRAGONITE = ["Dragonite ex A3b 53", "Dragonite B2b 53", "Dragonite A1 185"];
const ESPEON = ["Espeon ex A4 83", "Espeon A3b 28"];
const FUTURE = ["Future Booster Energy Capsule B3a 70", "Iron Valiant B3a 27", "Iron Crown B3a 30"];
const GARDEVOIR = ["Mega Gardevoir ex B2 66", "Gardevoir A1 132", "Gardevoir B2 65"];
const GRENINJA = ["Greninja A1 89", "Greninja ex B1 73", "Juliana B3a 71"];
const GUZZLORD = ["Guzzlord ex A3a 43", "Guzzlord B2 109"];
const LUCARIO = ["Mega Lucario ex B3 81", "Lucario A2 92"];
const MAGNEZONE = ["Magnezone ex B3 54", "Magnezone A2 53", "Magnezone B1a 26", "Magneton A1 98"];
const MEGA_KANGASKHAN = ["Mega Kangaskhan ex B2 127", "Serena B1a 69", "Ilima A3 149"];
const MEGA_MAWILE = ["Mega Mawile ex B2 113", "Serena B1a 69"];
const MEOWSCARADA = ["Meowscarada ex B2a 3", "Meowscarada A2b 7"];
const MIRAIDON = ["Miraidon ex B3a 19", "Professor Turo B3a 73"];
const ORICORIO = ["Oricorio A3 66", "Pichu A4 66"];
const POISON = ["Poison Barb A3 146", "Nihilego A3a 42"];
const SCEPTILE = ["Mega Sceptile ex B3 8", "Sceptile B3 7", "Juliana B3a 71"];
const SCIZOR = ["Mega Scizor ex B2b 47", "Scizor A4 123"];
const SLEEP = ["Darkrai B2b 40", "Igglybuff A4a 59"];
const VENUSAUR = ["Mega Venusaur ex B1a 4", "Venusaur ex A1 4", "Venusaur B1a 3", "Venusaur A1 3"];
// B4 | Ruler of the Skies
const DRAGONAIR = ["Dragonair B4 117"];
const HELIOLISK = ["Heliolisk B4 61"];
const HOOPA = ["Hoopa ex B4 103"];
const MEGA_METAGROSS = ["Mega Metagross ex B4 109"];
const MEGA_GALLADE = ["Mega Gallade ex B4 84"];
const MEGA_RAYQUAZA = ["Mega Rayquaza ex B4 120"];
const MEGA_SHARPEDO = ["Mega Sharpedo ex B4 35"];
const VESPIQUEN = ["Vespiquen ex B4 11"];
const WAILORD = ["Wailord ex B4 37"];
const ROTOM = ["Rotom ex B4 55"];
const TYPHLOSION = ["Typhlosion ex B4 26"];


const ARCHITYPES: Architype[] = [
  // Outliers
  { primary: "Ditto B1a 55", secondary: ["Rampardos A2 89", "Liepard B1a 48", MAGNEZONE, "Maushold B2 143"] },

  // Stage 2 Mega ex
  { primary: SCEPTILE, secondary: [POISON, "Leafeon ex A2a 10", GRENINJA] },
  { primary: "Mega Slowbro ex B2b 16", secondary: ["Suicune ex A4a 20"] },
  { primary: "Mega Manectric ex B2b 27", secondary: [] },
  { primary: "Mega Gengar ex B2b 39", secondary: [] },
  { primary: SCIZOR, secondary: ["Revavroom B2b 50"] },
  { primary: "Mega Swampert ex B2 36", secondary: [] },
  { primary: GARDEVOIR, secondary: ["Latias A4a 36", "Sylveon ex A3b 34"] },
  { primary: VENUSAUR, secondary: ["Exeggutor ex A1 23", "Dustox B1 7", "Lilligant B1 18"] },
  { primary: CHARIZARD, secondary: ["Skeledirge B2a 18"] },
  { primary: BLASTOISE, secondary: [] },
  { primary: BLAZIKEN, secondary: [GRENINJA, "Castform Sunny Form B3 24"] },
  { primary: "Mega Ampharos ex B1 85", secondary: ["Alolan Raichu B2 50"] },

  // Stage 2 ex
  { primary: "Flygon ex B3 126", secondary: [] },
  { primary: "Corviknight ex B3 124", secondary: [] },
  { primary: "Crobat ex A4 109", secondary: [POISON] },
  { primary: "Incineroar ex A3 33", secondary: [] },
  { primary: "Lunala ex A3 87", secondary: [] },
  { primary: DECIDUEYE, secondary: [] },
  { primary: "Gigalith ex A2 94", secondary: [] },
  { primary: "Solgaleo ex A3 122", secondary: ["Galarian Perrserker B2 111"] },
  { primary: "Lunala ex A3 87", secondary: [] },
  { primary: MEOWSCARADA, secondary: [] },
  { primary: DRAGONITE, secondary: ["Rampardos A2 89"] },
  { primary: MAGNEZONE, secondary: [MIRAIDON] },
  { primary: TYPHLOSION, secondary: ["Entei ex A4a 14", "Skeledirge B2a 18", "Castform Sunny Form B3 24"] },

  // Stage 2
  { primary: "Butterfree B3b 3", secondary: [] },
  { primary: "Kingambit B3a 43", secondary: ["Glimmora B3a 45"] },
  { primary: "Inteleon B3 50", secondary: [GRENINJA, "Vaporeon ex B3 37"] },
  { primary: "Vivillon B2 13", secondary: [SLEEP] },
  { primary: "Skeledirge B2a 18", secondary: [] },
  { primary: "Haxorus B2b 56", secondary: [] },
  { primary: "Chandelure B2 69", secondary: [] },
  { primary: "Galarian Obstagoon B2 100", secondary: [] },
  { primary: "Dusknoir A2 72", secondary: [MEGA_MAWILE, "Mega Absol ex B1 151", ALTARIA] },
  { primary: "Rampardos A2 89", secondary: ["Donphan ex A4 100", "Silvally A3a 61"] },
  { primary: "Tyrantrum B2 90", secondary: [] },
  { primary: "Slaking B2 136", secondary: [] },
  { primary: "Baxcalibur B2a 36", secondary: ["Suicune ex A4a 20", ALOLAN_NINETALES] },
  { primary: "Annihilape B2a 57", secondary: ["Mega Lopunny ex B1a 42"] },
  { primary: "Luxray B4 53", secondary: ["Zeraora A3a 20", ORICORIO] },

  // Stage 1 Mega ex
  { primary: LUCARIO, secondary: ["Rampardos A2 89", GRENINJA, "Donphan ex A4 100", SLEEP] },
  { primary: "Mega Camerupt ex B3 23", secondary: [] },
  { primary: "Mega Medicham ex PB 29", secondary: [] },
  { primary: ALTARIA, secondary: ["Sylveon ex A3b 34", FUTURE, "Gourgeist B2 72", "Aegislash B1 172", GRENINJA, SLEEP] },
  { primary: "Mega Gyarados ex B1 52", secondary: ["Jellicent B1 69"] },
  { primary: "Mega Lopunny ex B1a 42", secondary: [LUCARIO, GRENINJA, SLEEP] },
  { primary: "Mega Steelix ex B1a 52", secondary: [] },
  { primary: MEGA_SHARPEDO, secondary: ["Gyarados A4 45", "Chien-Pao ex B2a 37", "Suicune ex A4a 20", "Mega Gyarados ex B1 52", "Walrein B4 40"] },
  { primary: MEGA_GALLADE, secondary: ["Gallade B3 80", GRENINJA, "Hitmontop A4 85", "Hitmonchan ex B1 155"] },
  { primary: MEGA_METAGROSS, secondary: ["Orthworm B2a 75", "Dialga ex A2 119", "Probopass B1a 118"] },

  // Stage 1 ex
  { primary: "Hisuian Zoroark ex B3b 60", secondary: [] },
  { primary: "Milotic ex B3b 15", secondary: [] },
  { primary: "Zoroark ex B3 106", secondary: [] },
  { primary: "Crustle ex B3 88", secondary: [] },
  { primary: ESPEON, secondary: ["Sylveon ex A3b 34"] },
  { primary: "Vaporeon ex B3 37", secondary: [] },
  { primary: "Jolteon ex B1 81", secondary: ["Jolteon A3b 25"] },
  { primary: "Leafeon ex A2a 10", secondary: [] },
  { primary: ALOLAN_NINETALES, secondary: ["Crawdaunt A4 61"] },
  { primary: "Dragalge ex B1 160", secondary: [] },
  { primary: "Armarouge ex B2a 20", secondary: [] },
  { primary: "Bellibolt ex B2a 42", secondary: [] },
  { primary: "Gholdengo ex B2a 78", secondary: [] },
  { primary: VESPIQUEN, secondary: ["Shuckle ex A4 12", "Teal Mask Ogerpon ex B2 1", "Serperior A1a 6"] },
  { primary: WAILORD, secondary: ["Indeedee ex B1 93", "Mantyke A4a 23"] },

  // Stage 1
  { primary: "Altaria A4a 55", secondary: [] },
  { primary: "Espeon B3a 20", secondary: ["Swablu B1 196"] },
  { primary: "Glimmora B3a 45", secondary: [] },
  { primary: "Gyarados A4 45", secondary: ["Suicune ex A4a 20"] },
  { primary: "Hydreigon B1 157", secondary: [POISON] },
  { primary: "Crobat A2a 50", secondary: [] },
  { primary: "Silvally A3a 61", secondary: [ORICORIO] },
  { primary: "Ariados B1a 6", secondary: ["Whimsicott ex B1 16"] },
  { primary: "Galarian Perrserker B2 111", secondary: [MEGA_MAWILE] },
  { primary: "Houndstone B2a 53", secondary: ["Gourgeist B2 72"] },
  { primary: "Gourgeist B2 72", secondary: [] },
  { primary: "Naganadel A3a 45", secondary: [] },
  { primary: "Mega Manectric ex B2b 27", secondary: [HELIOLISK] },

  // Basic Mega ex
  { primary: "Mega Audino ex B3 141", secondary: [] },
  { primary: "Mega Sableye ex B3b 41", secondary: [] },
  { primary: "Mega Diancie ex B3b 32", secondary: [] },
  { primary: MEGA_KANGASKHAN, secondary: [GRENINJA, POISON, ORICORIO] },
  { primary: MEGA_MAWILE, secondary: [] },
  { primary: "Mega Absol ex B1 151", secondary: [GRENINJA, ORICORIO] },
  { primary: MEGA_RAYQUAZA, secondary: [DRAGONAIR, "Gouging Fire B3a 14", "Igglybuff A4a 59"] },

  // Basic ex
  { primary: "Lugia ex A4 149", secondary: ["Ho-Oh ex A4 34"] },
  { primary: "Dedenne ex B3b 24", secondary: [] },
  { primary: "Iron Bundle ex B3a 13", secondary: [FUTURE] },
  { primary: "Flutter Mane ex B3a 26", secondary: [GRENINJA] },
  { primary: "Koraidon ex B3a 36", secondary: ["Great Tusk B3a 34"] },
  { primary: "Terapagos ex B3a 68", secondary: [BABY_ENERGY, "Ho-Oh ex A4 34"] },
  { primary: "Ho-Oh ex A4 34", secondary: ["Ilima A3 149"] },
  { primary: "Suicune ex A4a 20", secondary: [GRENINJA] },
  { primary: "Darkrai ex A2 110", secondary: ["Giratina ex A2b 35"] },
  { primary: GUZZLORD, secondary: [POISON] },
  { primary: BUZZWOLE, secondary: [] },
  { primary: "Mimikyu ex B2 73", secondary: [GRENINJA, "Giratina ex A2b 35"] },
  { primary: "Chien-Pao ex B2a 37", secondary: [] },
  { primary: MIRAIDON, secondary: [] },
  { primary: HOOPA, secondary: ["Mega Absol ex B1 151", GRENINJA, "Mega Sableye ex B3b 41", "Hydreigon B1 157", "Darkrai ex A2 110"] },
  { primary: ROTOM, secondary: ["Pachirisu B4 54", "Oricorio A3 66", "Raikou ex A4a 19"] },

  // Basic
  { primary: FUTURE, secondary: [] },
  { primary: "Great Tusk B3a 34", secondary: [] },
  { primary: "Celesteela A3a 62", secondary: [] },
  { primary: "Gouging Fire B3a 14", secondary: [DRAGONAIR] },

  // Tech Cards
  { primary: GRENINJA, secondary: [ORICORIO, SLEEP, DARK_SUPPORT] },
  { primary: DARK_SUPPORT, secondary: [ORICORIO] },

  // Fallback
  { primary: "Professor's Research PA 7", secondary: [] },
];

/**
 * Checks if a deck contains all cards in a given match criteria
 * @param cards The deck's cards
 * @param match The card names to match against
 * @param requireTwo Whether to require exactly 2 copies of each card
 * @returns Whether all cards in the match criteria are found in the deck
 */
const hasAllCards = (
  cards: Deck["cards"],
  primary: CardNameType,
  requireTwo: boolean,
  secondary?: CardNameType,
): boolean => {
  // Create a Set of card strings for O(1) lookup
  const cardStrings = new Set(cards.map((card) => cardToString(card)));

  const primaryMatch = Array.isArray(primary) ? primary : [primary];
  const secondaryMatch = Array.isArray(secondary) ? secondary : [secondary];

  let primaryMatches = primaryMatch.reduce((acc, cardName) => {
    const twoCopies = `2 ${cardName}`;
    const hasTwo = cardStrings.has(twoCopies);
    if (hasTwo) return acc + 2;
    const hasOne = cardStrings.has(`1 ${cardName}`)
    if (hasOne) return acc + 1;
    return acc;
  }, 0);
  let secondaryMatches = secondaryMatch.reduce((acc, cardName) => {
    const twoCopies = `2 ${cardName}`;
    const hasTwo = cardStrings.has(twoCopies);
    if (hasTwo) return acc + 2;
    const hasOne = cardStrings.has(`1 ${cardName}`)
    if (hasOne) return acc + 1;
    return acc;
  }, 0);

  if (requireTwo) return primaryMatches >= 2 && (secondaryMatches >= 2 || !secondary);
  return primaryMatches >= 1 && (secondaryMatches >= 2 || !secondary);
};

/**
 * Finds the specific card from a match criteria that is actually present in the deck.
 * Falls back to the first entry if none are found.
 */
const getMatchedCard = (cards: Deck["cards"], match: CardNameType): string => {
  const cardStrings = new Set(cards.map((card) => cardToString(card)));
  const matchArray = Array.isArray(match) ? match : [match];
  for (const cardName of matchArray) {
    if (cardStrings.has(`2 ${cardName}`) || cardStrings.has(`1 ${cardName}`)) {
      return cardName;
    }
  }
  return matchArray[0];
};

/**
 * Attempts to find a matching deck name based on the deck's cards
 * @param deck The deck to find a name for
 * @returns The formatted deck name if found, null otherwise
 */
const getDeckName = (deck: Deck): string | null => {
  const { cards } = deck;

  // First try matching with exactly 2 copies of each card
  for (const criteria of ARCHITYPES) {
    const { primary, secondary } = criteria;
    for (const secondaryCard of secondary) {
      if (hasAllCards(cards, primary, true, secondaryCard)) {
        const match = [getMatchedCard(cards, primary), getMatchedCard(cards, secondaryCard)];
        return formatName(cards, match);
      }
    }
    if (hasAllCards(cards, primary, true)) {
      return formatName(cards, [getMatchedCard(cards, primary)]);
    }
  }

  // Then try matching with at least 1 copy of the primary card; secondary-card matches still require 2 copies
  for (const criteria of ARCHITYPES) {
    const { primary, secondary } = criteria;
    for (const secondaryCard of secondary) {
      if (hasAllCards(cards, primary, false, secondaryCard)) {
        const match = [getMatchedCard(cards, primary), getMatchedCard(cards, secondaryCard)];
        return formatName(cards, match);
      }
    }
    if (hasAllCards(cards, primary, false)) {
      return formatName(cards, [getMatchedCard(cards, primary)]);
    }
  }

  return null;
};

export default getDeckName;
