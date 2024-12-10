const fs = require("fs");
const cardToString = require("./utils/card-to-string");
const getEligibleDecks = require("./utils/get-eligible-decks");
const getDecks = require("./utils/get-decks");

// Settings
const NOEX = false;
const WINRATE_IMPORTANCE = 0.7;
const POPULARITY_IMPORTANCE = 0.3;
const OLD_MULTIPLIER = 1;
const NEW_MULTIPLIER = 3;

// Global Variables
const decks = getDecks(NOEX, OLD_MULTIPLIER, NEW_MULTIPLIER);
const allGames = decks.reduce((acc, deck) => acc + deck.totalGames, 0);
const uniqueDeckNames = decks
  .map((deck) => deck.name)
  .filter((value, index, self) => self.indexOf(value) === index);

// Calculate Best Decks
const bestDecks = [];
for (const deckName of uniqueDeckNames) {
  const matchingDecks = decks.filter((game) => game.name === deckName);
  const matchingGames = matchingDecks.reduce(
    (acc, game) => acc + game.totalGames,
    0
  );

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
    cards[card].score =
      winRate * WINRATE_IMPORTANCE + popularity * POPULARITY_IMPORTANCE;
  }

  const deckScore = (deck) => {
    const popularity = matchingGames / allGames;
    const totalCards = deck.cards.reduce((acc, card) => acc + card.count, 0);
    const deckScore =
      deck.cards.reduce(
        (acc, card) => acc + cards[cardToString(card)].score * card.count,
        0
      ) / totalCards;
    return deckScore * WINRATE_IMPORTANCE + popularity * POPULARITY_IMPORTANCE;
  };

  const eligibleDecks = getEligibleDecks(matchingDecks);
  const sortedDecks = eligibleDecks.sort((a, b) => deckScore(b) - deckScore(a));
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
