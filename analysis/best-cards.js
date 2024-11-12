const fs = require("fs");
const getDeckName = require("./get-deck-name");

const EXCLUDE = [];

const WINRATE_IMPORTANCE = 0.65;
const POPULARITY_IMPORTANCE = 0.35;

const decksWithoutNames = JSON.parse(fs.readFileSync("./data/decks.json"));

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

const bestDecks = [];

for (const deckName of uniqueDeckNames) {
  const matchingGames = deckScores.filter((game) => game.name === deckName);

  const cards = {};

  for (const game of matchingGames) {
    for (const card of game.cards) {
      if (cards[card]) {
        cards[card].wins += game.wins;
        cards[card].losses += game.losses;
        cards[card].totalGames += game.totalGames;
      } else {
        cards[card] = {
          name: card,
          wins: game.wins,
          losses: game.losses,
          totalGames: game.totalGames,
        };
      }
    }
  }

  const totalGames = matchingGames.reduce(
    (acc, game) => acc + game.totalGames,
    0
  );

  const cardScore = (cardName) => {
    const card = cards[cardName];
    const aWinRate = card.wins / card.totalGames;
    const aPopularity = card.totalGames / totalGames;
    return aWinRate * WINRATE_IMPORTANCE + aPopularity * POPULARITY_IMPORTANCE;
  };

  const deckScore = (deck) => {
    const deckScore = deck.cards.reduce(
      (acc, card) => acc + cardScore(card),
      0
    );
    return deckScore;
  };

  const sortedDecks = matchingGames.sort((a, b) => deckScore(b) - deckScore(a));

  const bestDeck = {
    name: deckName,
    cards: sortedDecks[0].cards,
    score: deckScore(sortedDecks[0]),
  };

  bestDecks.push(bestDeck);
}

bestDecks.sort((a, b) => b.score - a.score);

const topScore = bestDecks[0].score;

for (const deck of bestDecks) {
  const percentage = (deck.score / topScore) * 100;
  console.log("");
  console.log(`===== ${deck.name} (${Math.round(percentage)}%) =====`);
  console.log(deck.cards.join("\n"));
}
