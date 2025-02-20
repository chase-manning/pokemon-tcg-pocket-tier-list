const cardToString = require("./card-to-string");

const DECK_NAMES = [
  // Doubles
  ["Magnezone A2 53", "Darkrai ex A2 110"],
  ["Palkia ex A2 49", "Greninja A1 89"],
  ["Darkrai ex A2 110", "Greninja A1 89"],
  ["Palkia ex A2 49", "Manaphy A2 50"],
  ["Gliscor A2 84", "Lucario A2 92"],
  ["Darkrai ex A2 110", "Weavile ex A2 99"],
  ["Magnezone A2 53", "Hitmonlee A1 154"],
  ["Yanmega ex A2 7", "Exeggutor ex A1 23"],
  ["Mew ex A1a 32", "Greninja A1 89"],
  ["Gyarados ex A1a 18", "Greninja A1 89"],
  ["Yanmega ex A2 7", "Dialga ex A2 119"],
  ["Celebi ex A1a 3", "Serperior A1a 6"],
  ["Rampardos A2 89", "Lucario A2 92"],
  ["Darkrai ex A2 110", "Weezing A1 177"],
  ["Celebi ex A1a 3", "Exeggutor ex A1 23"],
  ["Mewtwo ex A1 129", "Gardevoir A1 132"],
  ["Magnezone A2 53", "Skarmory A2 111"],
  ["Lucario A2 92", "Primeape A1a 42"],
  ["Starmie ex A1 76", "Articuno ex A1 84"],
  ["Magnezone A2 53", "Dialga ex A2 119"],
  ["Magnezone A2 53", "Articuno ex A1 84"],
  ["Aerodactyl ex A1a 46", "Primeape A1a 42"],
  ["Lucario A2 92", "Primeape A1 142"],
  ["Vaporeon A1a 19", "Articuno ex A1 84"],
  ["Dialga ex A2 119", "Skarmory A2 111"],
  ["Charizard ex A1 36", "Moltres ex A1 47"],
  ["Luxray A2 60", "Electivire A2 57"],
  ["Bastiodon A2 114", "Skarmory A2 111"],
  ["Magnezone A2 53", "Greninja A1 89"],
  ["Infernape ex A2 29", "Moltres ex A1 47"],
  ["Pikachu ex A1 96", "Zebstrika A1 106"],
  ["Pikachu ex A1 96", "Pachirisu ex A2 61"],
  ["Pikachu ex A1 96", "Zapdos ex A1 104"],
  ["Gallade ex A2 95", "Lucario A2 92"],
  ["Magnezone A2 53", "Starmie ex A1 76"],
  ["Melmetal A1 182", "Dialga ex A2 119"],
  ["Magnezone A2 53", "Palkia ex A2 49"],
  ["Aerodactyl ex A1a 46", "Lucario A2 92"],
  ["Aerodactyl ex A1a 46", "Hitmonlee A1 154"],
  ["Togekiss A2 65", "Mewtwo ex A1 129"],
  ["Yanmega ex A2 7", "Wigglytuff ex A1 195"],
  ["Starmie ex A1 76", "Vaporeon A1a 19"],
  ["Weezing A1 177", "Arbok A1 165"],
  ["Pikachu ex A1 96", "Raichu A1 95"],
  ["Weezing A1 177", "Weavile ex A2 99"],
  ["Gyarados ex A1a 18", "Manaphy A2 50"],
  ["Gyarados ex A1a 18", "Vaporeon A1a 19"],
  ["Pidgeot ex A1a 59", "Dialga ex A2 119"],
  ["Mismagius ex A2 67", "Togekiss A2 65"],
  ["Lucario A2 92", "Machamp ex A1 146"],
  ["Dialga ex A2 119", "Lickilicky ex A2 125"],
  ["Kangaskhan A1 203", "Greninja A1 89"],
  ["Kingler A1 69", "Seaking A1 73"],
  ["Lickilicky ex A2 125", "Greninja A1 89"],
  ["Darkrai ex A2 110", "Druddigon A1a 56"],
  ["Wormadam A2 115", "Skarmory A2 111"],
  ["Magnezone A2 53", "Empoleon A2 37"],
  ["Gallade ex A2 95", "Rampardos A2 89"],
  ["Magnezone A2 53", "Togekiss A2 65"],
  ["Rampardos A2 89", "Hitmonlee A1 154"],
  ["Magnezone A2 53", "Golem A1a 45"],
  ["Garchomp A2 123", "Kabutops A1 159"],
  ["Garchomp A2 123", "Hitmonlee A1 154"],

  // Main Card (never side card)
  "Charizard ex A1 36",
  "Infernape ex A2 29",
  "Pikachu ex A1 96",
  "Luxray A2 60",
  "Bastiodon A2 114",
  "Rampardos A2 89",
  "Gallade ex A2 95",
  "Magnezone A2 53",
  "Gyarados ex A1a 18",
  "Nidoqueen A1 168",
  "Alakazam A1 117",
  "Golem A1a 45",
  "Pidgeot ex A1a 59",
  "Blastoise ex A1 56",
  "Venusaur ex A1 4",
  "Gengar ex A1 123",
  "Dragonite A1 185",
  "Machamp ex A1 146",
  "Garchomp A2 123",
  "Togekiss A2 65",
  "Scolipede A1a 55",
  "Rhyperior A2 82",

  // Stage 1 (can be side card)
  "Melmetal A1 182",
  "Starmie ex A1 76",
  "Marowak ex A1 153",
  "Lumineon A1a 21",
  "Gyarados A1 78",
  "Yanmega ex A2 7",
  "Weezing A1 177",
  "Arcanine ex A1 41",
  "Primeape A1a 42",
  "Exeggutor ex A1 23",
  "Lucario A2 92",
  "Wigglytuff ex A1 195",
  "Marowak A1 152",
  "Mismagius ex A2 67",
  "Golduck A1 58",

  // Basic ex (can be side card)
  "Pachirisu ex A2 61",
  "Darkrai ex A2 110",
  "Articuno ex A1 84",
  "Dialga ex A2 119",
  "Zapdos ex A1 104",
  "Palkia ex A2 49",

  // Basic (can be side card)
  "Lt. Surge A1 226",
  "Blaine A1 221",
  "Hitmonlee A1 154",
  "Tauros A1a 60",
];

const formatName = (cards, match) => {
  return match
    .map((cardName) => {
      const card = cards.find(
        (card) =>
          cardToString(card) === `2 ${cardName}` ||
          cardToString(card) === `1 ${cardName}`
      );
      const padded = card.number.padStart(3, "0");
      const set = card.set === "P-A" ? "PA" : card.set;
      return `${card.name}-${set}-${padded}`;
    })
    .join("&");
};

const getDeckName = (deck) => {
  const { cards } = deck;
  for (const criteria of DECK_NAMES) {
    let match = criteria;
    if (!Array.isArray(criteria)) {
      match = [criteria];
    }

    const hasAll = match.every((cardName) => {
      for (const card of cards) {
        if (cardToString(card) === `2 ${cardName}`) return true;
      }
      return false;
    });
    if (hasAll) return formatName(cards, match);
  }

  for (const criteria of DECK_NAMES) {
    let match = criteria;
    if (!Array.isArray(criteria)) {
      match = [criteria];
    }

    const hasAll = match.every((cardName) => {
      for (const card of cards) {
        if (
          cardToString(card) === `2 ${cardName}` ||
          cardToString(card) === `1 ${cardName}`
        )
          return true;
      }
      return false;
    });
    if (hasAll) return formatName(cards, match);
  }
  return null;

  return "Professor's Research-PA-007";
};

module.exports = getDeckName;
