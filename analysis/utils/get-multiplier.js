const {
  OLD_MULTIPLIER,
  NEW_MULTIPLIER,
  EXPANSION_RELEASE_DATE,
} = require("../settings");

const getRecencyMultiplier = (game, newestDate) => {
  const deckDate = new Date(game.date);
  const timePassed = deckDate - EXPANSION_RELEASE_DATE;
  const totalTime = newestDate - EXPANSION_RELEASE_DATE;
  const datePercentage = timePassed / totalTime;
  return datePercentage * (NEW_MULTIPLIER - OLD_MULTIPLIER) + OLD_MULTIPLIER;
};

const getMultiplier = (
  game,
  newestDate,
  beforeExpansionMul,
  afterExpansionMul
) => {
  const deckDate = new Date(game.date);
  const isAfterExpansion = deckDate > EXPANSION_RELEASE_DATE;
  if (!isAfterExpansion) return beforeExpansionMul;
  return getRecencyMultiplier(game, newestDate) * afterExpansionMul;
};

module.exports = getMultiplier;
