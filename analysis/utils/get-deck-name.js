const cardToString = require("./card-to-string");

const DECK_NAMES = [
  "Lumineon A1a 21",
  "Lt. Surge A1 226",
  "Alakazam A1 117",
  "Golem A1a 45",
  "Celebi ex A1a 3",
  "Gyarados ex A1a 18",
  "Pidgeot ex A1a 59",
  "Nidoqueen A1 168",
  "Pikachu ex A1 96",
  "Mewtwo ex A1 129",
  "Blastoise ex A1 56",
  "Charizard ex A1 36",
  "Melmetal A1 182",
  "Venusaur ex A1 4",
  "Marowak ex A1 153",
  "Gengar ex A1 123",
  "Dragonite A1 185",
  "Blaine A1 221",
  "Machamp ex A1 146",
  "Gyarados A1 78",
  "Scolipede A1a 55",

  // Cards that could be a side card or a main card
  "Weezing A1 177",
  "Starmie ex A1 76",
  "Arcanine ex A1 41",
  "Primeape A1a 42",
  "Exeggutor ex A1 23",
  "Hitmonlee A1 154",
  "Tauros A1a 60",
  "Wigglytuff ex A1 195",
];
const getDeckName = (deck) => {
  const { cards } = deck;
  for (const mainCard of DECK_NAMES) {
    for (const card of cards) {
      if (cardToString(card) === `2 ${mainCard}`) {
        const padded = card.number.padStart(3, "0");
        const set = card.set === "P-A" ? "PA" : card.set;
        return `${card.name}-${set}-${padded}`;
      }
    }
  }
  // Unsure if we should include this
  for (const mainCard of DECK_NAMES) {
    for (const card of cards) {
      if (cardToString(card) === `1 ${mainCard}`) {
        const padded = card.number.padStart(3, "0");
        const set = card.set === "P-A" ? "PA" : card.set;
        return `${card.name}-${set}-${padded}`;
      }
    }
  }
  return null;

  return "Professor's Research-PA-007";
};

module.exports = getDeckName;
