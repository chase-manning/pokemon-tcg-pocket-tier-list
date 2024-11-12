const fs = require("fs");

const EXCLUDE = [];

const WINRATE_IMPORTANCE = 0.75;
const POPULARITY_IMPORTANCE = 0.25;

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
    mainCard: "2 Articuno ex A1 84",
    deckName: "Articuno ex",
  },
  {
    mainCard: "1 Articuno ex A1 84",
    deckName: "Articuno ex",
  },
  {
    mainCard: "2 Greninja A1 89",
    deckName: "Greninja",
  },
  {
    mainCard: "1 Greninja A1 89",
    deckName: "Greninja",
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
    mainCard: "2 Exeggutor ex A1 23",
    deckName: "Exeggutor ex",
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
    deckName: "Poison",
  },
  {
    mainCard: "2 Wigglytuff ex A1 195",
    deckName: "Wigglytuff ex",
  },
  {
    mainCard: "1 Weezing A1 177",
    deckName: "Poison",
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
];

const getDeckName = (deck) => {
  const { cards } = deck;
  for (const { mainCard, deckName } of DECK_NAMES) {
    if (cards.includes(mainCard)) {
      return deckName;
    }
  }
  return null;
};

const decksWithoutNames = JSON.parse(fs.readFileSync("decks.json"));

const deckScores = decksWithoutNames
  .map((deck) => {
    const name = getDeckName(deck);
    return {
      ...deck,
      name,
    };
  })
  .filter((deck) => deck.name);

const uniqueDeckNames = deckScores
  .map((deck) => deck.name)
  .filter((value, index, self) => self.indexOf(value) === index);

const totalDeckGames = deckScores.reduce(
  (acc, deck) => acc + deck.totalGames,
  0
);

const bestDecks = [];

for (const deckName of uniqueDeckNames) {
  const matchingGames = deckScores.filter((game) => game.name === deckName);

  const cards = [];

  for (const game of matchingGames) {
    for (const card of game.cards) {
      const existingCard = cards.find((c) => c.name === card);
      if (existingCard) {
        existingCard.wins += game.wins;
        existingCard.losses += game.losses;
        existingCard.totalGames += game.totalGames;
      } else {
        cards.push({
          name: card,
          wins: game.wins,
          losses: game.losses,
          totalGames: game.totalGames,
        });
      }
    }
  }

  const totalGames = matchingGames.reduce(
    (acc, game) => acc + game.totalGames,
    0
  );

  const cardScore = (card) => {
    const aWinRate = card.wins / card.totalGames;
    const aPopularity = card.totalGames / totalGames;
    return aWinRate * WINRATE_IMPORTANCE + aPopularity * POPULARITY_IMPORTANCE;
  };

  const sortedCards = cards.sort((a, b) => {
    return cardScore(b) - cardScore(a);
  });

  const deck = [];
  let cardsInDeck = 0;
  for (const card of sortedCards) {
    if (cardsInDeck === 20) break;
    const amount = Number(card.name.split(" ")[0]);

    // Everything after the first space
    const rawCardName = card.name.split(" ");
    rawCardName.shift();
    const cardName = rawCardName.join(" ");
    if (EXCLUDE.includes(cardName)) continue;
    if (EXCLUDE.includes(card.name)) continue;
    if (deck.some((c) => c.name.includes(cardName))) continue;
    if (amount + cardsInDeck > 20) continue;
    deck.push(card);
    cardsInDeck += amount;
  }

  const deckScore = deck.reduce((acc, card) => acc + cardScore(card), 0);

  bestDecks.push({
    name: deckName,
    cards: deck.map((card) => card.name),
    score: deckScore,
  });
}

bestDecks.sort((a, b) => b.score - a.score);

const topScore = bestDecks[0].score;

for (const deck of bestDecks) {
  const percentage = (deck.score / topScore) * 100;
  console.log("");
  console.log(`===== ${deck.name} (${Math.round(percentage)}%) =====`);
  console.log(deck.cards.join("\n"));
}
