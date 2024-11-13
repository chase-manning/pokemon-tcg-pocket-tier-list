const fs = require("fs");
const getDeckName = require("./get-deck-name");
const cardToString = require("./card-to-string");

// const EXCLUDE = [];

const WINRATE_IMPORTANCE = 0.7;
const POPULARITY_IMPORTANCE = 0.3;

const decksWithoutNames = JSON.parse(fs.readFileSync("./data/decks-2.json"));

const deckScores = decksWithoutNames
  .map((deck) => {
    const name = getDeckName(deck);
    return {
      ...deck,
      name,
    };
  })
  .filter((deck) => deck.name);

const allGames = deckScores.reduce((acc, deck) => acc + deck.totalGames, 0);

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
    for (const card of game.cards) {
      const cardName = cardToString(card);
      if (cards[cardName]) {
        cards[cardName].wins += game.wins;
        cards[cardName].totalGames += game.totalGames;
      } else {
        cards[cardName] = {
          wins: game.wins,
          totalGames: game.totalGames,
        };
      }
    }
    if (pokemons[game.pokemon]) {
      pokemons[game.pokemon].wins += game.wins;
      pokemons[game.pokemon].totalGames += game.totalGames;
    } else {
      pokemons[game.pokemon] = {
        wins: game.wins,
        totalGames: game.totalGames,
      };
    }
    if (differnetPokemons[game.differentPokemon]) {
      differnetPokemons[game.differentPokemon].wins += game.wins;
      differnetPokemons[game.differentPokemon].totalGames += game.totalGames;
    } else {
      differnetPokemons[game.differentPokemon] = {
        wins: game.wins,
        totalGames: game.totalGames,
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
  console.log(
    deck.cards.map((card) => `${card.count} ${card.name}`).join("\n")
  );
}

fs.writeFileSync("./data/best-decks.json", JSON.stringify(bestDecks, null, 2));
