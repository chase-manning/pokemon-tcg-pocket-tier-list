const fs = require("fs");
const getDeckName = require("./utils/get-deck-name");
const cardToString = require("./utils/card-to-string");
const getMultiplier = require("./utils/get-multiplier");
const EXCLUDE = require("./utils/exclude-list");

const NOEX = false;

const NOEX_PERCENT_CUTOFF = 0.2;
const WINRATE_IMPORTANCE = 0.7;
const POPULARITY_IMPORTANCE = 0.3;

const decksWithoutNames_ = JSON.parse(fs.readFileSync("./data/decks.json"));

// Exclude all cards that are ex (end with " ex")
const decksWithoutNames = decksWithoutNames_
  .filter(
    (deck) => !deck.cards.some((card) => card.name.endsWith(" ex")) || !NOEX
  )
  .filter((deck) => {
    const isNoEx = deck.tournamentExPercent < NOEX_PERCENT_CUTOFF;
    return isNoEx === NOEX;
  });

const deckScores = decksWithoutNames
  .map((deck) => {
    const name = getDeckName(deck);
    return {
      ...deck,
      name,
    };
  })
  .filter((deck) => deck.name);

const oldestDate = new Date(
  Math.min(...deckScores.map((deck) => new Date(deck.date)))
);

const newestDate = new Date(
  Math.max(...deckScores.map((deck) => new Date(deck.date)))
);

console.log(
  "Sample Games",
  deckScores.reduce((acc, deck) => acc + deck.totalGames, 0).toLocaleString()
);
const allGames = deckScores.reduce(
  (acc, deck) =>
    acc + deck.totalGames * getMultiplier(deck, oldestDate, newestDate),
  0
);

const uniqueDeckNames = deckScores
  .map((deck) => deck.name)
  .filter((value, index, self) => self.indexOf(value) === index);

const bestDecks = [];

for (const deckName of uniqueDeckNames) {
  const matchingGames = deckScores.filter((game) => game.name === deckName);

  const totalGames = matchingGames.reduce(
    (acc, game) => acc + game.totalGames,
    0
  );

  const cards = {};
  const pokemons = {};
  const differnetPokemons = {};

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
    if (pokemons[game.pokemon]) {
      pokemons[game.pokemon].wins += scaledWins;
      pokemons[game.pokemon].totalGames += scaledTotalGames;
    } else {
      pokemons[game.pokemon] = {
        wins: scaledWins,
        totalGames: scaledTotalGames,
      };
    }
    if (differnetPokemons[game.differentPokemon]) {
      differnetPokemons[game.differentPokemon].wins += scaledWins;
      differnetPokemons[game.differentPokemon].totalGames += scaledTotalGames;
    } else {
      differnetPokemons[game.differentPokemon] = {
        wins: scaledWins,
        totalGames: scaledTotalGames,
      };
    }
  }
  for (const card in cards) {
    const cardData = cards[card];
    const winRate = cardData.wins / cardData.totalGames;
    const popularity = cardData.totalGames / totalGames;
    cards[card].score =
      winRate * WINRATE_IMPORTANCE + popularity * POPULARITY_IMPORTANCE;
  }
  for (const pokemon in pokemons) {
    const pokemonData = pokemons[pokemon];
    const winRate = pokemonData.wins / pokemonData.totalGames;
    const popularity = pokemonData.totalGames / totalGames;
    pokemons[pokemon].score =
      winRate * WINRATE_IMPORTANCE + popularity * POPULARITY_IMPORTANCE;
  }
  for (const differentPokemon in differnetPokemons) {
    const differentPokemonData = differnetPokemons[differentPokemon];
    const winRate = differentPokemonData.wins / differentPokemonData.totalGames;
    const popularity = differentPokemonData.totalGames / totalGames;
    differnetPokemons[differentPokemon].score =
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
    const pokemonScore = pokemons[deck.pokemon].score;
    const differentPokemonScore =
      differnetPokemons[deck.differentPokemon].score;
    const totalScore = (deckScore + pokemonScore + differentPokemonScore) / 3;
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

  if (sortedDecks.length === 0) {
    continue;
  }
  const bestDeck = {
    name: deckName,
    cards: sortedDecks[0].cards,
    score: deckScore(sortedDecks[0]),
  };

  bestDecks.push(bestDeck);
}

bestDecks.sort((a, b) => b.score - a.score);

fs.writeFileSync("./data/best-decks.json", JSON.stringify(bestDecks, null, 2));
