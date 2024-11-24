const cardToString = require("./card-to-string");

const DECK_NAMES = [
  {
    mainCard: "2 Pikachu ex A1 96",
    deckName: "Pikachu ex",
  },
  {
    mainCard: "1 Pikachu ex A1 96",
    deckName: "Pikachu ex",
  },
  {
    mainCard: "2 Mewtwo ex A1 129",
    deckName: "Mewtwo ex",
  },
  {
    mainCard: "1 Mewtwo ex A1 129",
    deckName: "Mewtwo ex",
  },
  {
    mainCard: "2 Starmie ex A1 76",
    deckName: "Starmie ex",
  },
  {
    mainCard: "1 Starmie ex A1 76",
    deckName: "Starmie ex",
  },
  {
    mainCard: "2 Articuno ex A1 84",
    deckName: "Articuno ex",
  },
  {
    mainCard: "1 Articuno ex A1 84",
    deckName: "Articuno ex",
  },
  {
    mainCard: "2 Charizard ex A1 36",
    deckName: "Charizard ex",
  },
  {
    mainCard: "1 Charizard ex A1 36",
    deckName: "Charizard ex",
  },
  {
    mainCard: "2 Arcanine ex A1 41",
    deckName: "Arcanine ex",
  },
  {
    mainCard: "1 Arcanine ex A1 41",
    deckName: "Arcanine ex",
  },
  {
    mainCard: "2 Blastoise ex A1 56",
    deckName: "Blastoise ex",
  },
  {
    mainCard: "1 Blastoise ex A1 56",
    deckName: "Blastoise ex",
  },
  {
    mainCard: "2 Melmetal A1 182",
    deckName: "Melmetal",
  },
  {
    mainCard: "2 Alakazam A1 117",
    deckName: "Alakazam",
  },
  {
    mainCard: "2 Venusaur ex A1 4",
    deckName: "Venusaur ex",
  },
  {
    mainCard: "2 Exeggutor ex A1 23",
    deckName: "Exeggutor ex",
  },
  {
    mainCard: "1 Venusaur ex A1 4",
    deckName: "Venusaur ex",
  },
  {
    mainCard: "1 Exeggutor ex A1 23",
    deckName: "Exeggutor ex",
  },
  {
    mainCard: "2 Marowak ex A1 153",
    deckName: "Marowak ex",
  },
  {
    mainCard: "1 Marowak ex A1 153",
    deckName: "Marowak ex",
  },
  {
    mainCard: "2 Lapras ex P-A 14",
    deckName: "Lapras ex",
  },
  {
    mainCard: "2 Greninja A1 89",
    deckName: "Greninja",
  },
  {
    mainCard: "1 Lapras ex P-A 14",
    deckName: "Lapras ex",
  },
  {
    mainCard: "1 Greninja A1 89",
    deckName: "Greninja",
  },
  {
    mainCard: "2 Gengar ex A1 123",
    deckName: "Gengar ex",
  },
  {
    mainCard: "1 Gengar ex A1 123",
    deckName: "Gengar ex",
  },
  {
    mainCard: "2 Dragonite A1 185",
    deckName: "Dragonite",
  },
  {
    mainCard: "1 Dragonite A1 185",
    deckName: "Dragonite",
  },
  {
    mainCard: "2 Weezing A1 177",
    deckName: "Weezing",
  },
  {
    mainCard: "2 Wigglytuff ex A1 195",
    deckName: "Wigglytuff ex",
  },
  {
    mainCard: "1 Weezing A1 177",
    deckName: "Weezing",
  },
  {
    mainCard: "1 Wigglytuff ex A1 195",
    deckName: "Wigglytuff ex",
  },
  {
    mainCard: "2 Blaine A1 221",
    deckName: "Blaine",
  },
  {
    mainCard: "1 Blaine A1 221",
    deckName: "Blaine",
  },
  {
    mainCard: "2 Machamp ex A1 146",
    deckName: "Machamp ex",
  },
  {
    mainCard: "1 Machamp ex A1 146",
    deckName: "Machamp ex",
  },
  {
    mainCard: "1 Alakazam A1 117",
    deckName: "Alakazam",
  },
  {
    mainCard: "1 Melmetal A1 182",
    deckName: "Melmetal",
  },
];

const getDeckName = (deck) => {
  const { cards } = deck;
  for (const { mainCard, deckName } of DECK_NAMES) {
    if (cards.map((card) => cardToString(card)).includes(mainCard)) {
      return deckName;
    }
  }
  return null;
};

module.exports = getDeckName;
