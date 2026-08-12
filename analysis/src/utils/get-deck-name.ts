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
const HELIOLISK = ["Heliolisk B4 61"]; // B4 | Ruler of the Skies


const ARCHITYPES: Architype[] = [
  // Outliers
  { primary: "Ditto B1a 55", secondary: ["Rampardos A2 89", "Liepard B1a 48", MAGNEZONE, "Maushold B2 143"] },

  // Stage 2 Mega ex
  { primary: BLASTOISE, secondary: [] },
  { primary: BLAZIKEN, secondary: ["Castform Sunny Form B3 24", GRENINJA] },
  { primary: CHARIZARD, secondary: ["Skeledirge B2a 18"] },
  { primary: GARDEVOIR, secondary: ["Latias A4a 36", "Sylveon ex A3b 34"] },
  { primary: "Mega Ampharos ex B1 85", secondary: ["Alolan Raichu B2 50"] },
  { primary: "Mega Gengar ex B2b 39", secondary: [] },
  { primary: "Mega Slowbro ex B2b 16", secondary: ["Suicune ex A4a 20"] },
  { primary: "Mega Swampert ex B2 36", secondary: [] },
  { primary: SCEPTILE, secondary: [GRENINJA, "Leafeon ex A2a 10", POISON] },
  { primary: SCIZOR, secondary: ["Revavroom B2b 50"] },
  { primary: VENUSAUR, secondary: ["Dustox B1 7", "Exeggutor ex A1 23", "Lilligant B1 18"] },

  // Stage 2 ex
  { primary: "Corviknight ex B3 124", secondary: [] },
  { primary: "Crobat ex A4 109", secondary: [POISON] },
  { primary: DECIDUEYE, secondary: [] },
  { primary: DRAGONITE, secondary: ["Rampardos A2 89"] },
  { primary: "Flygon ex B3 126", secondary: [] },
  { primary: "Gigalith ex A2 94", secondary: [] },
  { primary: "Incineroar ex A3 33", secondary: [] },
  { primary: "Lunala ex A3 87", secondary: [] },
  { primary: MAGNEZONE, secondary: [MIRAIDON] },
  { primary: MEOWSCARADA, secondary: [] },
  { primary: "Solgaleo ex A3 122", secondary: ["Galarian Perrserker B2 111"] },
  { primary: "Typhlosion ex B4 26", secondary: ["Castform Sunny Form B3 24", "Entei ex A4a 14", "Skeledirge B2a 18"] },

  // Stage 2
  { primary: "Annihilape B2a 57", secondary: ["Mega Lopunny ex B1a 42"] },
  { primary: "Baxcalibur B2a 36", secondary: [ALOLAN_NINETALES, "Suicune ex A4a 20"] },
  { primary: "Butterfree B3b 3", secondary: [] },
  { primary: "Chandelure B2 69", secondary: [] },
  { primary: "Crobat A2a 50", secondary: [] },
  { primary: "Dusknoir A2 72", secondary: [ALTARIA, "Mega Absol ex B1 151", MEGA_MAWILE] },
  { primary: "Galarian Obstagoon B2 100", secondary: [] },
  { primary: "Haxorus B2b 56", secondary: [] },
  { primary: "Hydreigon B1 157", secondary: [POISON] },
  { primary: "Inteleon B3 50", secondary: [GRENINJA, "Vaporeon ex B3 37"] },
  { primary: "Kingambit B3a 43", secondary: ["Glimmora B3a 45"] },
  { primary: "Luxray B4 53", secondary: [ORICORIO, "Zeraora A3a 20"] },
  { primary: "Rampardos A2 89", secondary: ["Donphan ex A4 100", "Silvally A3a 61"] },
  { primary: "Skeledirge B2a 18", secondary: [] },
  { primary: "Slaking B2 136", secondary: [] },
  { primary: "Tyrantrum B2 90", secondary: [] },
  { primary: "Vivillon B2 13", secondary: [SLEEP] },

  // Stage 1 Mega ex
  { primary: ALTARIA, secondary: ["Aegislash B1 172", FUTURE, "Gourgeist B2 72", GRENINJA, SLEEP, "Sylveon ex A3b 34"] },
  { primary: LUCARIO, secondary: ["Donphan ex A4 100", GRENINJA, "Rampardos A2 89", SLEEP] },
  { primary: "Mega Camerupt ex B3 23", secondary: [] },
  { primary: "Mega Gallade ex B4 84", secondary: ["Gallade B3 80", GRENINJA, "Hitmonchan ex B1 155", "Hitmontop A4 85"] },
  { primary: "Mega Gyarados ex B1 52", secondary: ["Jellicent B1 69"] },
  { primary: "Mega Lopunny ex B1a 42", secondary: [GRENINJA, LUCARIO, SLEEP] },
  { primary: "Mega Manectric ex B2b 27", secondary: [HELIOLISK] },
  { primary: "Mega Medicham ex PB 29", secondary: [] },
  { primary: "Mega Metagross ex B4 109", secondary: ["Dialga ex A2 119", "Orthworm B2a 75", "Probopass B1a 53"] },
  { primary: "Mega Sharpedo ex B4 35", secondary: ["Chien-Pao ex B2a 37", "Gyarados A4 45", "Mega Gyarados ex B1 52", "Suicune ex A4a 20", "Walrein B4 40"] },
  { primary: "Mega Steelix ex B1a 52", secondary: [] },

  // Stage 1 ex
  { primary: ALOLAN_NINETALES, secondary: ["Crawdaunt A4 61"] },
  { primary: "Armarouge ex B2a 20", secondary: [] },
  { primary: "Bellibolt ex B2a 42", secondary: [] },
  { primary: "Crustle ex B3 88", secondary: [] },
  { primary: "Dragalge ex B1 160", secondary: [] },
  { primary: ESPEON, secondary: ["Sylveon ex A3b 34"] },
  { primary: "Gholdengo ex B2a 78", secondary: [] },
  { primary: "Hisuian Zoroark ex B3b 60", secondary: [] },
  { primary: "Jolteon ex B1 81", secondary: ["Jolteon A3b 25"] },
  { primary: "Leafeon ex A2a 10", secondary: [] },
  { primary: "Milotic ex B3b 15", secondary: [] },
  { primary: "Vaporeon ex B3 37", secondary: [] },
  { primary: "Vespiquen ex B4 11", secondary: ["Serperior A1a 6", "Shuckle ex A4 12", "Teal Mask Ogerpon ex B2 1"] },
  { primary: "Wailord ex B4 37", secondary: ["Indeedee ex B1 93", "Mantyke A4a 23"] },
  { primary: "Zoroark ex B3 106", secondary: [] },

  // Stage 1
  { primary: "Altaria A4a 55", secondary: [] },
  { primary: "Ariados B1a 6", secondary: ["Whimsicott ex B1 16"] },
  { primary: "Espeon B3a 20", secondary: ["Swablu B1 196"] },
  { primary: "Galarian Perrserker B2 111", secondary: [MEGA_MAWILE] },
  { primary: "Glimmora B3a 45", secondary: [] },
  { primary: "Gourgeist B2 72", secondary: [] },
  { primary: "Gyarados A4 45", secondary: ["Suicune ex A4a 20"] },
  { primary: "Houndstone B2a 53", secondary: ["Gourgeist B2 72"] },
  { primary: "Naganadel A3a 45", secondary: [] },
  { primary: "Silvally A3a 61", secondary: [ORICORIO] },

  // Basic Mega ex
  { primary: "Mega Absol ex B1 151", secondary: [GRENINJA, ORICORIO] },
  { primary: "Mega Audino ex B3 141", secondary: [] },
  { primary: "Mega Diancie ex B3b 32", secondary: [] },
  { primary: MEGA_KANGASKHAN, secondary: [GRENINJA, ORICORIO, POISON] },
  { primary: MEGA_MAWILE, secondary: [] },
  { primary: "Mega Sableye ex B3b 41", secondary: [] },
  { primary: "Mega Rayquaza ex B4 120", secondary: ["Dragonair B4 117", "Gouging Fire B3a 14", "Igglybuff A4a 59"] },

  // Basic ex
  { primary: BUZZWOLE, secondary: [] },
  { primary: "Chien-Pao ex B2a 37", secondary: [] },
  { primary: "Darkrai ex A2 110", secondary: ["Giratina ex A2b 35"] },
  { primary: "Dedenne ex B3b 24", secondary: [] },
  { primary: "Flutter Mane ex B3a 26", secondary: [GRENINJA] },
  { primary: GUZZLORD, secondary: [POISON] },
  { primary: "Ho-Oh ex A4 34", secondary: ["Ilima A3 149"] },
  { primary: "Hoopa ex B4 103", secondary: ["Darkrai ex A2 110", GRENINJA, "Hydreigon B1 157", "Mega Absol ex B1 151", "Mega Sableye ex B3b 41"] },
  { primary: "Iron Bundle ex B3a 13", secondary: [FUTURE] },
  { primary: "Koraidon ex B3a 36", secondary: ["Great Tusk B3a 34"] },
  { primary: "Lugia ex A4 149", secondary: ["Ho-Oh ex A4 34"] },
  { primary: "Mimikyu ex B2 73", secondary: ["Giratina ex A2b 35", GRENINJA] },
  { primary: MIRAIDON, secondary: [] },
  { primary: "Rotom ex B4 55", secondary: ["Oricorio A3 66", "Pachirisu B4 54", "Raikou ex A4a 19"] },
  { primary: "Suicune ex A4a 20", secondary: [GRENINJA] },
  { primary: "Terapagos ex B3a 68", secondary: [BABY_ENERGY, "Ho-Oh ex A4 34"] },

  // Basic
  { primary: FUTURE, secondary: [] },
  { primary: "Great Tusk B3a 34", secondary: [] },
  { primary: "Celesteela A3a 62", secondary: [] },
  { primary: "Gouging Fire B3a 54", secondary: ["Dragonair B4 117"] },

  // Tech Cards
  { primary: DARK_SUPPORT, secondary: [ORICORIO] },
  { primary: GRENINJA, secondary: [DARK_SUPPORT, ORICORIO, SLEEP] },

  // Fallback
  { primary: "Professor's Research PA 7", secondary: [] },
];

/**
 * Checks if a deck contains all cards in a given match criteria
 * @param cards The deck's cards
 * @param primary The primary card name(s) to match against
 * @param requireTwo Whether to require exactly 2 copies of the primary card
 * @param secondary Optional secondary card name(s) to match against
 * @returns Whether all cards in the match criteria are found in the deck
 * */
const hasAllCards = (
    cards: Deck["cards"],
    primary: CardNameType,
    requireTwo: boolean,
    secondary?: CardNameType,
): boolean => {
  // Create a Set of card strings for O(1) lookup
  const cardStrings = new Set(cards.map((card) => cardToString(card)));

  const primaryMatch = Array.isArray(primary) ? primary : [primary];
  const secondaryMatch = secondary ? (Array.isArray(secondary) ? secondary : [secondary]) : [];

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

// Pass 1a: Try 2 copies primary + 2 copies secondary across all archetypes
  for (const criteria of ARCHITYPES) {
    const { primary, secondary } = criteria;
    for (const secondaryCard of secondary) {
      if (hasAllCards(cards, primary, true, secondaryCard)) {
        const match = [getMatchedCard(cards, primary), getMatchedCard(cards, secondaryCard)];
        return formatName(cards, match);
      }
    }
  }

  // Pass 1b: Try 2 copies primary standalone across all archetypes
  for (const criteria of ARCHITYPES) {
    const { primary } = criteria;
    if (hasAllCards(cards, primary, true)) {
      return formatName(cards, [getMatchedCard(cards, primary)]);
    }
  }

  // Pass 2a: Try 1 copy primary + 2 copies secondary across all archetypes
  for (const criteria of ARCHITYPES) {
    const { primary, secondary } = criteria;
    for (const secondaryCard of secondary) {
      if (hasAllCards(cards, primary, false, secondaryCard)) {
        const match = [getMatchedCard(cards, primary), getMatchedCard(cards, secondaryCard)];
        return formatName(cards, match);
      }
    }
  }

  // Pass 2b: Try 1 copy primary standalone across all archetypes
  for (const criteria of ARCHITYPES) {
    const { primary } = criteria;
    if (hasAllCards(cards, primary, false)) {
      return formatName(cards, [getMatchedCard(cards, primary)]);
    }
  }

  return null;
};

export default getDeckName;
