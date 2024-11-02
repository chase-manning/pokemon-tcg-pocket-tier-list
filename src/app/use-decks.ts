import { useEffect, useState } from "react";
import DECKS from "./decks";

const CARDS_URL =
  "https://raw.githubusercontent.com/chase-manning/pokemon-tcg-pocket-cards/refs/heads/main/v1.json";

interface CardType {
  id: string;
  name: string;
  rarity: string;
  pack: string;
  type: string;
  health: number | null;
  stage: string | null;
  craftingCost: number | null;
  image: string;
}

interface FullDeckType {
  id: string;
  name: string;
  cards: CardType[];
}

const useDecks = (): FullDeckType[] | null => {
  const [cards, setCards] = useState<CardType[] | null>(null);

  useEffect(() => {
    fetch(CARDS_URL)
      .then((res) => res.json())
      .then((data) => setCards(data));
  }, []);

  if (!cards) return null;

  return DECKS.map((oldDeck) => {
    const deck: FullDeckType = {
      id: oldDeck.id,
      name: oldDeck.name,
      cards: oldDeck.cards.map((cardId) => {
        const card = cards?.find((card) => card.id === cardId);
        if (!card) throw new Error(`Card not found: ${cardId}`);
        return card;
      }),
    };
    return deck;
  });
};

export default useDecks;
