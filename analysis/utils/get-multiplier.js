const getMultiplier = (
  game,
  oldestDate,
  newestDate,
  oldMultiplier,
  newMultiplier,
  expansionReleaseDate
) => {
  const deckDate = new Date(game.date);
  const isAfterExpansion = deckDate > expansionReleaseDate;
  const datePercentage = (deckDate - oldestDate) / (newestDate - oldestDate);
  const recencyMultiplier =
    datePercentage * (newMultiplier - oldMultiplier) + oldMultiplier;
  const timeUntilExpansion = expansionReleaseDate - oldestDate;
  const timeSinceExpansion = newestDate - expansionReleaseDate;
  const newExpansionMultiplier = (timeUntilExpansion / timeSinceExpansion) * 4;
  const isAfterExpansionMultiplier = isAfterExpansion
    ? newExpansionMultiplier
    : 1;
  return recencyMultiplier * isAfterExpansionMultiplier;
};

module.exports = getMultiplier;
