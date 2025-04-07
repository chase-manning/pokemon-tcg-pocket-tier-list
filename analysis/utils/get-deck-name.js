const cardToString = require("./card-to-string");

const DECK_NAMES = [
  // Doubles
  ["Giratina ex A2b 35", "Darkrai ex A2 110"],
  ["Leafeon ex A2a 10", "Irida A2a 72"],
  ["Kabutops A1 159", "Primeape A1 142"],
  ["Garchomp ex A2a 47", "Lucario A2 92"],
  ["Garchomp ex A2a 47", "Aerodactyl ex A1a 46"],
  ["Garchomp ex A2a 47", "Arceus ex A2a 71"],
  ["Heatran A2a 13", "Magnezone A2 53"],
  ["Arceus ex A2a 71", "Magnezone A2 53"],
  ["Arceus ex A2a 71", "Greninja A1 89"],
  ["Infernape ex A2 29", "Heatran A2a 13"],
  ["Bronzong A2a 59", "Magnezone A2 53"],
  ["Bronzong A2a 59", "Skarmory A2 111"],
  ["Abomasnow A2a 21", "Arceus ex A2a 71"],
  ["Probopass ex A2a 57", "Dialga ex A2 119"],
  ["Glaceon ex A2a 22", "Manaphy A2 50"],
  ["Leafeon ex A2a 10", "Yanmega ex A2 7"],
  ["Arceus ex A2a 71", "Dialga ex A2 119"],
  ["Dialga ex A2 119", "Shaymin A2 22"],
  ["Crobat A2a 50", "Darkrai ex A2 110"],
  ["Crobat A2a 50", "Arceus ex A2a 71"],
  ["Lapras ex P-A 14", "Greninja A1 89"],
  ["Leafeon ex A2a 10", "Celebi ex A1a 3"],
  ["Scolipede A1a 55", "Weezing A1 177"],
  ["Articuno ex A1 84", "Greninja A1 89"],
  ["Hitmonlee A1 154", "Greninja A1 89"],
  ["Blastoise ex A1 56", "Weezing A1 177"],
  ["Blastoise ex A1 56", "Manaphy A2 50"],
  ["Marowak ex A1 153", "Magnezone A2 53"],
  ["Starmie ex A1 76", "Greninja A1 89"],
  ["Pikachu ex A1 96", "Electrode A1 100"],
  ["Marowak ex A1 153", "Primeape A1a 42"],
  ["Venusaur ex A1 4", "Exeggutor ex A1 23"],
  ["Alakazam A1 117", "Weezing A1 177"],
  ["Darkrai ex A2 110", "Magnezone A2 53"],
  ["Palkia ex A2 49", "Greninja A1 89"],
  ["Darkrai ex A2 110", "Greninja A1 89"],
  ["Palkia ex A2 49", "Manaphy A2 50"],
  ["Gliscor A2 84", "Lucario A2 92"],
  ["Darkrai ex A2 110", "Weavile ex A2 99"],
  ["Hitmonlee A1 154", "Magnezone A2 53"],
  ["Yanmega ex A2 7", "Exeggutor ex A1 23"],
  ["Mew ex A1a 32", "Greninja A1 89"],
  ["Gyarados ex A1a 18", "Greninja A1 89"],
  ["Gyarados ex A1a 18", "Manaphy A2 50"],
  ["Gyarados ex A1a 18", "Vaporeon A1a 19"],
  ["Gyarados ex A1a 18", "Druddigon A1a 56"],
  ["Yanmega ex A2 7", "Dialga ex A2 119"],
  ["Celebi ex A1a 3", "Serperior A1a 6"],
  ["Rampardos A2 89", "Lucario A2 92"],
  ["Rampardos A2 89", "Aerodactyl ex A1a 46"],
  ["Darkrai ex A2 110", "Weezing A1 177"],
  ["Celebi ex A1a 3", "Exeggutor ex A1 23"],
  ["Mewtwo ex A1 129", "Gardevoir A1 132"],
  ["Skarmory A2 111", "Magnezone A2 53"],
  ["Lucario A2 92", "Primeape A1a 42"],
  ["Starmie ex A1 76", "Articuno ex A1 84"],
  ["Dialga ex A2 119", "Magnezone A2 53"],
  ["Articuno ex A1 84", "Magnezone A2 53"],
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
  ["Gallade ex A2 95", "Hitmonlee A1 154"],
  ["Starmie ex A1 76", "Magnezone A2 53"],
  ["Melmetal A1 182", "Dialga ex A2 119"],
  ["Palkia ex A2 49", "Magnezone A2 53"],
  ["Aerodactyl ex A1a 46", "Lucario A2 92"],
  ["Aerodactyl ex A1a 46", "Hitmonlee A1 154"],
  ["Togekiss A2 65", "Mewtwo ex A1 129"],
  ["Yanmega ex A2 7", "Wigglytuff ex A1 195"],
  ["Starmie ex A1 76", "Vaporeon A1a 19"],
  ["Weezing A1 177", "Arbok A1 165"],
  ["Pikachu ex A1 96", "Raichu A1 95"],
  ["Weezing A1 177", "Weavile ex A2 99"],
  ["Pidgeot ex A1a 59", "Dialga ex A2 119"],
  ["Mismagius ex A2 67", "Togekiss A2 65"],
  ["Lucario A2 92", "Machamp ex A1 146"],
  ["Dialga ex A2 119", "Lickilicky ex A2 125"],
  ["Kangaskhan A1 203", "Greninja A1 89"],
  ["Kingler A1 69", "Seaking A1 73"],
  ["Lickilicky ex A2 125", "Greninja A1 89"],
  ["Darkrai ex A2 110", "Druddigon A1a 56"],
  ["Wormadam A2 115", "Skarmory A2 111"],
  ["Empoleon A2 37", "Magnezone A2 53"],
  ["Gallade ex A2 95", "Rampardos A2 89"],
  ["Togekiss A2 65", "Magnezone A2 53"],
  ["Rampardos A2 89", "Hitmonlee A1 154"],
  ["Golem A1a 45", "Magnezone A2 53"],
  ["Garchomp A2 123", "Kabutops A1 159"],
  ["Garchomp A2 123", "Hitmonlee A1 154"],
  ["Kangaskhan A1 203", "Magnezone A2 53"],
  ["Heatran A2a 13", "Arceus ex A2a 71"],
  ["Charizard ex A2b 10", "Moltres ex A1 47"],
  ["Giratina ex A2b 35", "Mewtwo ex A1 129"],
  ["Meowscarada A2b 7", "Carnivine A2a 9"],
  ["Meowscarada A2b 7", "Exeggutor ex A1 23"],
  ["Paldean Clodsire ex A2b 48", "Grafaiai A2b 51"],
  ["Beedrill ex A2b 3", "Exeggutor ex A1 23"],
  ["Wugtrio ex A2b 19", "Greninja A1 89"],
  ["Wugtrio ex A2b 19", "Manaphy A2 50"],
  ["Gholdengo A2b 57", "Dialga ex A2 119"],
  ["Mesprit A2 76", "Uxie A2 75"],
  ["Mesprit A2 76", "Uxie A2 75"],
  ["Giratina ex A2b 35", "Dawn A2 154"],
  ["Giratina ex A2b 35", "Red A2b 71"],
  ["Gallade ex A2 95", "Sudowoodo A2a 36"],
  ["Honchkrow A2 97", "Greninja A1 89"],
  ["Meowscarada A2b 7", "Magnezone A2 53"],
  ["Tinkaton ex A2b 54", "Skarmory A2 111"],
  ["Dragonite A1 185", "Giratina ex A2b 35"],
  ["Exeggutor A1 22", "Carnivine A2a 9"],
  ["Rampardos A2 89", "Pidgeot ex A1a 59"],
  ["Lucario A2 92", "Sudowoodo A2a 36"],
  ["Rotom A2a 35", "Carnivine A2a 9"],

  // Main Card (never side card)
  "Bronzong A2a 59",
  "Garchomp ex A2a 47",
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
  "Beedrill ex A2b 3",
  "Meowscarada A2b 7",
  "Charizard ex A2b 10",

  // Stage 1 (can be side card)
  "Abomasnow A2a 21",
  "Probopass ex A2a 57",
  "Leafeon ex A2a 10",
  "Glaceon ex A2a 22",
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
  "Golduck A1 58",
  "Wugtrio ex A2b 19",
  "Lucario ex A2b 43",
  "Paldean Clodsire ex A2b 48",
  "Tinkaton ex A2b 54",
  "Gholdengo A2b 57",
  "Wigglytuff A2b 61",
  "Grafaiai A2b 51",

  // Basic ex (can be side card)
  "Pachirisu ex A2 61",
  "Darkrai ex A2 110",
  "Articuno ex A1 84",
  "Dialga ex A2 119",
  "Zapdos ex A1 104",
  "Palkia ex A2 49",
  "Arceus ex A2a 71",
  "Pikachu ex A2b 22",
  "Giratina ex A2b 35",

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
