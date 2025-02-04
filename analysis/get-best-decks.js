const fs = require("fs");
const cardToString = require("./utils/card-to-string");
const getEligibleDecks = require("./utils/get-eligible-decks");
const getDecks = require("./utils/get-decks");
const getId = require("./utils/get-id");

// Settings
const NOEX = false;
const WINRATE_IMPORTANCE = 0.7;
const POPULARITY_IMPORTANCE = 0.3;
const OLD_MULTIPLIER = 1;
const NEW_MULTIPLIER = 3;
const CARDS_IN_DECK = 20;
const RED_CARD_MULTIPLIER = 0.8;
const EXPANSION_RELEASE_DATE = new Date("2025-1-31");

// Global Variables
const decks = getDecks(
  NOEX,
  OLD_MULTIPLIER,
  NEW_MULTIPLIER,
  EXPANSION_RELEASE_DATE
);
const allGames = decks.reduce((acc, deck) => acc + deck.totalGames, 0);
const uniqueDeckNames = decks
  .map((deck) => deck.name)
  .filter((value, index, self) => self.indexOf(value) === index);

// Calculate Best Decks
const bestDecks = [];
const idExists = {};
for (const deckName of uniqueDeckNames) {
  const matchingDecks = decks.filter((game) => game.name === deckName);
  const matchingGames = matchingDecks.reduce(
    (acc, game) => acc + game.totalGames,
    0
  );
  const percentOfGames = matchingGames / allGames;

  const cards = {};
  for (const deck of matchingDecks) {
    for (const card of deck.cards) {
      const cardName = cardToString(card);
      if (cards[cardName]) {
        cards[cardName].wins += deck.wins;
        cards[cardName].totalGames += deck.totalGames;
      } else {
        cards[cardName] = {
          wins: deck.wins,
          totalGames: deck.totalGames,
        };
      }
    }
  }
  for (const card in cards) {
    const cardData = cards[card];
    const winRate = cardData.wins / cardData.totalGames;
    const popularity = cardData.totalGames / matchingGames;
    const isRedCard = card.toLowerCase().includes("red card");
    const multiplier = isRedCard ? RED_CARD_MULTIPLIER : 1;
    cards[card].score =
      (winRate * WINRATE_IMPORTANCE + popularity * POPULARITY_IMPORTANCE) *
      multiplier;
  }

  const deckScore = (deck) => {
    const popularity = matchingGames / allGames;
    const deckScore =
      deck.cards.reduce(
        (acc, card) => acc + cards[cardToString(card)].score * card.count,
        0
      ) / CARDS_IN_DECK;
    return deckScore * WINRATE_IMPORTANCE + popularity * POPULARITY_IMPORTANCE;
  };

  const eligibleDecks = getEligibleDecks(matchingDecks);
  if (eligibleDecks.length === 0) continue;
  const sortedDecks = eligibleDecks.sort((a, b) => deckScore(b) - deckScore(a));

  for (const deck of sortedDecks) {
    const id = getId(deck);
    if (idExists[id]) continue;
    const formattedDeck = {
      name: deckName,
      cards: deck.cards,
      score: deckScore(deck),
      percentOfGames,
      id,
    };
    bestDecks.push(formattedDeck);
    idExists[id] = true;
  }
}

bestDecks.sort((a, b) => b.score - a.score);

fs.writeFileSync("./data/best-decks.json", JSON.stringify(bestDecks, null, 2));
fs.writeFileSync(
  "../src/app/best-decks.json",
  JSON.stringify(bestDecks, null, 2)
);
