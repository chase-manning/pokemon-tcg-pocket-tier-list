const cardToString = (card) => {
  return `${card.name} ${card.id.toUpperCase().replace("-", " ")}`;
};

module.exports = cardToString;
