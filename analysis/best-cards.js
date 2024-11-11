const fs = require("fs");

const EXCLUDE = [];

const WINRATE_IMPORTANCE = 0.75;
const POPULARITY_IMPORTANCE = 0.25;

const deckScores = JSON.parse(fs.readFileSync("named-decks.json"));

const deckClassses = [];

for (const deck of deckScores) {
  const existingDeck = deckClassses.find((d) => d.name === deck.name);
  if (existingDeck) {
    existingDeck.wins += deck.wins;
    existingDeck.losses += deck.losses;
    existingDeck.totalGames += deck.totalGames;
  } else {
    deckClassses.push({
      name: deck.name,
      wins: deck.wins,
      losses: deck.losses,
      totalGames: deck.totalGames,
    });
  }
}

const totalDeckGames = deckClassses.reduce(
  (acc, deck) => acc + deck.totalGames,
  0
);

const score = (deck) => {
  const winRate = deck.wins / deck.totalGames;
  const popularity = deck.totalGames / totalDeckGames;
  return winRate * WINRATE_IMPORTANCE + popularity * POPULARITY_IMPORTANCE;
};

const sorted = deckClassses.sort((a, b) => {
  const aScore = score(a);
  const bScore = score(b);
  return bScore - aScore;
});

for (const currentDeck of sorted) {
  const matchingGames = deckScores.filter(
    (game) => game.name === currentDeck.name
  );
  console.log("");
  console.log(
    `=== ${currentDeck.name} (${(score(currentDeck) * 100).toFixed(0)}%) ===`
  );

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

  const sortedCards = cards.sort((a, b) => {
    const aWinRate = a.wins / a.totalGames;
    const aPopularity = a.totalGames / totalGames;
    const aScore =
      aWinRate * WINRATE_IMPORTANCE + aPopularity * POPULARITY_IMPORTANCE;
    const bWinRate = b.wins / b.totalGames;
    const bPopularity = b.totalGames / totalGames;
    const bScore =
      bWinRate * WINRATE_IMPORTANCE + bPopularity * POPULARITY_IMPORTANCE;
    return bScore - aScore;
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
    if (deck.some((c) => c.includes(cardName))) continue;
    if (amount + cardsInDeck > 20) continue;
    deck.push(card.name);
    cardsInDeck += amount;
  }

  console.log(deck.join("\n"));
}
