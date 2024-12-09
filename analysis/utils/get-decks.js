const fs = require("fs");
const getDeckName = require("./get-deck-name");

const NOEX_PERCENT_CUTOFF = 0.2;

const getDecks = (noEx) => {
  const decksWithoutNames_ = JSON.parse(fs.readFileSync("./data/decks.json"));

  const decksWithoutNames = decksWithoutNames_
    .filter(
      (deck) => !deck.cards.some((card) => card.name.endsWith(" ex")) || !noEx
    )
    .filter((deck) => {
      const isNoEx = deck.tournamentExPercent < NOEX_PERCENT_CUTOFF;
      return isNoEx === noEx;
    });

  return decksWithoutNames
    .map((deck) => {
      const name = getDeckName(deck);
      return {
        ...deck,
        name,
      };
    })
    .filter((deck) => deck.name);
};

module.exports = getDecks;
