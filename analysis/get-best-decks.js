const fs = require("fs");
const cardToString = require("./utils/card-to-string");
const getMultiplier = require("./utils/get-multiplier");
const EXCLUDE = require("./utils/exclude-list");
const getDecks = require("./utils/get-decks");

// Settings
const NOEX = false;
const WINRATE_IMPORTANCE = 0.7;
const POPULARITY_IMPORTANCE = 0.3;

// Global Variables
const decks = getDecks(NOEX);
const dates = decks.map((deck) => new Date(deck.date));
const oldestDate = new Date(Math.min(...dates));
const newestDate = new Date(Math.max(...dates));
const totalGames = decks.reduce((acc, deck) => acc + deck.totalGames, 0);
console.log("Sample Games:", (totalGames / 2).toLocaleString());
const allGames = decks.reduce(
  (acc, deck) =>
    acc + deck.totalGames * getMultiplier(deck, oldestDate, newestDate),
  0
);
const uniqueDeckNames = decks
  .map((deck) => deck.name)
  .filter((value, index, self) => self.indexOf(value) === index);

// Calculate Best Decks
const bestDecks = [];
for (const deckName of uniqueDeckNames) {
  const matchingGames = decks.filter((game) => game.name === deckName);

  const totalGames = matchingGames.reduce(
    (acc, game) =>
      acc + game.totalGames * getMultiplier(game, oldestDate, newestDate),
    0
  );

  const cards = {};
  for (const game of matchingGames) {
    const multiplier = getMultiplier(game, oldestDate, newestDate);
    const scaledWins = game.wins * multiplier;
    const scaledTotalGames = game.totalGames * multiplier;
    for (const card of game.cards) {
      const cardName = cardToString(card);
      if (cards[cardName]) {
        cards[cardName].wins += scaledWins;
        cards[cardName].totalGames += scaledTotalGames;
      } else {
        cards[cardName] = {
          wins: scaledWins,
          totalGames: scaledTotalGames,
        };
      }
    }
  }
  for (const card in cards) {
    const cardData = cards[card];
    const winRate = cardData.wins / cardData.totalGames;
    const popularity = cardData.totalGames / totalGames;
    cards[card].score =
      winRate * WINRATE_IMPORTANCE + popularity * POPULARITY_IMPORTANCE;
  }

  const deckScore = (deck) => {
    const popularity = totalGames / allGames;
    const totalCards = deck.cards.reduce((acc, card) => acc + card.count, 0);
    const deckScore =
      deck.cards.reduce(
        (acc, card) => acc + cards[cardToString(card)].score * card.count,
        0
      ) / totalCards;
    const totalScore = deckScore;
    return totalScore * WINRATE_IMPORTANCE + popularity * POPULARITY_IMPORTANCE;
  };

  const sortedDecks = matchingGames
    .filter(
      (deck) =>
        !EXCLUDE.some((exclude) =>
          deck.cards.map((card) => cardToString(card)).includes(exclude)
        )
    )
    .sort((a, b) => deckScore(b) - deckScore(a));

  if (sortedDecks.length === 0) continue;

  const bestDeck = {
    name: deckName,
    cards: sortedDecks[0].cards,
    score: deckScore(sortedDecks[0]),
  };
  bestDecks.push(bestDeck);
}

bestDecks.sort((a, b) => b.score - a.score);

fs.writeFileSync("./data/best-decks.json", JSON.stringify(bestDecks, null, 2));
