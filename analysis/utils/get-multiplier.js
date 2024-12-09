const NEW_MULTIPLIER = 3;
const OLD_MULTIPLIER = 1;

const getMultiplier = (game, oldestDate, newestDate) => {
  const deckDate = new Date(game.date);
  const datePercentage = (deckDate - oldestDate) / (newestDate - oldestDate);
  return datePercentage * (NEW_MULTIPLIER - OLD_MULTIPLIER) + OLD_MULTIPLIER;
};

module.exports = getMultiplier;
