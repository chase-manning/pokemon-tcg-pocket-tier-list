const fs = require("fs");
const getDeckName = require("./get-deck-name");
const getMultiplier = require("./get-multiplier");

const NOEX_PERCENT_CUTOFF = 0.2;
const WIGGLYTUFF_PERCENT_CUTOFF = 0.1;

const getDecks = (noEx, oldMultiplier, newMultiplier, expansionReleaseDate) => {
  const decksWithoutNames_ = JSON.parse(fs.readFileSync("./data/decks.json"));

  const decksWithoutNames = decksWithoutNames_
    .filter(
      (deck) => !deck.cards.some((card) => card.name.endsWith(" ex")) || !noEx
    )
    .filter((deck) => {
      const isNoEx = deck.tournamentExPercent < NOEX_PERCENT_CUTOFF;
      return isNoEx === noEx;
    })
    .filter((deck) => deck.wigglytuffPercent < WIGGLYTUFF_PERCENT_CUTOFF);

  const decksWithNames = decksWithoutNames
    .map((deck) => {
      const name = getDeckName(deck);
      return {
        ...deck,
        name,
      };
    })
    .filter((deck) => deck.name);

  const totalGames = decksWithNames.reduce(
    (acc, deck) => acc + deck.totalGames,
    0
  );
  console.log("Sample Games:", (totalGames / 2).toLocaleString());

  const dates = decksWithNames.map((deck) => new Date(deck.date));
  const oldestDate = new Date(Math.min(...dates));
  const newestDate = new Date(Math.max(...dates));

  return decksWithNames.map((deck) => {
    const multiplier = getMultiplier(
      deck,
      oldestDate,
      newestDate,
      oldMultiplier,
      newMultiplier,
      expansionReleaseDate
    );
    return {
      ...deck,
      totalGames: deck.totalGames * multiplier,
      wins: deck.wins * multiplier,
    };
  });
};

module.exports = getDecks;
