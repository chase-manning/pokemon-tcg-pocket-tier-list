import { CardType } from "../contexts/DecksContext";

const cardToString = (card: CardType) => {
  return `${card.name} ${card.id.toUpperCase().replaceAll("-", " ")}`;
};

export default cardToString;