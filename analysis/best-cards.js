const fs = require("fs");
const getDeckName = require("./get-deck-name");

const EXCLUDE = [];

const WINRATE_IMPORTANCE = 0.75;
const POPULARITY_IMPORTANCE = 0.25;

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
