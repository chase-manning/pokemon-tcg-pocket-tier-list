const cardToString = (card) => {
  return `${card.count} ${card.name} ${card.set} ${card.number}`;
};

module.exports = cardToString;
