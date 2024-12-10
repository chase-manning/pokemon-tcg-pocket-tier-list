const cardToString = require("./card-to-string");

const EXCLUDE = [
  // "1 Zapdos ex A1 104",
  // "2 Zapdos ex A1 104",
  // "2 Moltres ex A1 47",
  // "2 Charizard ex A1 36",
  // "2 Articuno ex A1 84",
  // "1 Starmie ex A1 76",
  // "2 Starmie ex A1 76",
  // "1 Ninetales A1 38",
  // "2 Ninetales A1 38",
  // "2 Koga A1 222",
  // "2 Venusaur ex A1 4",
  // "2 Exeggutor ex A1 23",
  // "1 Mewtwo A1 128",
  // "2 Mewtwo A1 128",
  // "2 Charizard A1 35",
  // "1 Charizard A1 35",
  // "2 Marowak ex A1 153",
  // "2 Articuno A1 83",
  // "2 Arcanine A1 40",
];

const getEligibleDecks = (decks) => {
  return decks.filter(
    (deck) =>
      !EXCLUDE.some((exclude) =>
        deck.cards.map((card) => cardToString(card)).includes(exclude)
      )
  );
};

module.exports = getEligibleDecks;
