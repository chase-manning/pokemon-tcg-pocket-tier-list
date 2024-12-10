const getMultiplier = (
  game,
  oldestDate,
  newestDate,
  oldMultiplier,
  newMultiplier
) => {
  const deckDate = new Date(game.date);
  const datePercentage = (deckDate - oldestDate) / (newestDate - oldestDate);
  return datePercentage * (newMultiplier - oldMultiplier) + oldMultiplier;
};

module.exports = getMultiplier;
