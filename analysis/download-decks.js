const fs = require("fs");

// State

// Facts
const API_KEY = process.env.API_KEY;
const GAME = "POCKET";
const append = `?key=${API_KEY}`;
const BASE = "https://play.limitlesstcg.com/api";

// Config
const MIN_GAMES = 100;

const processedTournaments = () => {
  return JSON.parse(fs.readFileSync("./data/processed-tournaments.json"));
};

const _currentDecks = () => {
  return JSON.parse(fs.readFileSync("./data/decks.json"));
};

// {
//     game: 'DCG',
//     name: 'LIGA PHOENIX LA PLATA 100 51°',
//     date: '2024-11-10T18:30:00.000Z',
//     format: null,
//     id: '672fc6e40947ec3b5d19d54d',
//     players: 10,
//     organizerId: 281
//   }
const getTournaments = async () => {
  const res = await fetch(
    `${BASE}/tournaments${append}&limit=10000&game=${GAME}`
  );
  const tournaments = await res.json();
  const processedTournamentIds = processedTournaments().map((t) => t.id);
  return tournaments
    .filter((tournament) => tournament.players >= MIN_GAMES)
    .filter((tournament) => !processedTournamentIds.includes(tournament.id));
};

// {
//   name: 'KingHeracross',
//   country: 'US',
//   decklist: { pokemon: [Array], trainer: [Array] },
//   deck: {
//     id: 'ninetales-rapidash-a1',
//     name: 'Ninetales Rapidash',
//     icons: [Array]
//   },
//   placing: 1,
//   player: 'kingheracross',
//   record: { wins: 6, losses: 0, ties: 1 },
//   drop: null
// },
const getDecks = async (tournament) => {
  const res = await fetch(
    `${BASE}/tournaments/${tournament.id}/standings${append}`
  );
  const decks_ = await res.json();

  const decks = decks_.filter(
    (deck) =>
      !!deck.decklist &&
      !!deck.decklist.pokemon &&
      !!deck.decklist.trainer &&
      !!deck.record &&
      !!deck.record.wins &&
      !!deck.record.losses
  );

  const amountWithEx = decks.filter((deck) => {
    return deck.decklist.pokemon.some((card) => card.name.endsWith(" ex"));
  }).length;
  const tournamentExPercent = amountWithEx / decks.length;
  const amountWithWigglytuff = decks.filter((deck) => {
    return deck.decklist.pokemon.some((card) =>
      card.name.includes("Wigglytuff ex")
    );
  });
  const wigglytuffPercent = amountWithWigglytuff.length / decks.length;

  return decks.map((deck) => {
    return {
      cards: [...deck.decklist.pokemon, ...deck.decklist.trainer],
      pokemon: deck.decklist.pokemon.reduce((acc, card) => {
        return acc + card.count;
      }, 0),
      differentPokemon: deck.decklist.pokemon.length,
      wins: deck.record.wins,
      losses: deck.record.losses,
      totalGames: deck.record.wins + deck.record.losses,
      date: tournament.date,
      tournamentExPercent,
      wigglytuffPercent,
    };
  });
};

const downloadDecks = async () => {
  const tournaments = await getTournaments();
  for (const tournament of tournaments) {
    const t = {
      id: tournament.id,
      date: new Date(tournament.date),
    };
    const decks = await getDecks(t);
    const currentDecks = _currentDecks();
    const newDecks = [...currentDecks, ...decks];
    fs.writeFileSync("./data/decks.json", JSON.stringify(newDecks));
    const processed = processedTournaments();
    processed.push(t);
    fs.writeFileSync(
      "./data/processed-tournaments.json",
      JSON.stringify(processed)
    );
  }
};

downloadDecks();
