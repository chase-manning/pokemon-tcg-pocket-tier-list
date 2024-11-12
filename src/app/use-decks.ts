import { useEffect, useState } from "react";
import DECKS from "./decks.json";

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
  score: number;
}

const cardNameToAmount = (name: string): number => {
  const items = name.split(" ");
  const amount = items[0];
  return Number(amount);
};

const cardNameToId = (name: string): string => {
  const items = name.split(" ");
  const id = items[items.length - 1];
  const padded = id.padStart(3, "0");
  const a1 = name.includes("A1");
  const pa = name.includes("P-A");
  return `${a1 ? "a1" : pa ? "pa" : ""}-${padded}`;
};

const useDecks = (): FullDeckType[] | null => {
  const [cards, setCards] = useState<CardType[] | null>(null);

  useEffect(() => {
    fetch(CARDS_URL)
      .then((res) => res.json())
      .then((data) => setCards(data));
  }, []);

  if (!cards) return null;

  return DECKS.map((oldDeck) => {
    const deckCards = [];
    for (const cardName of oldDeck.cards) {
      const amount = cardNameToAmount(cardName);
      const id = cardNameToId(cardName);
      const card = cards?.find((card) => card.id === id);
      if (!card) {
        throw new Error(`Card not found: ${id}`);
      }
      for (let i = 0; i < amount; i++) {
        deckCards.push(card);
      }
    }

    const deck: FullDeckType = {
      id: oldDeck.name.toLowerCase().replace(/\s/g, "-"),
      name: oldDeck.name,
      cards: deckCards,
      score: oldDeck.score,
    };
    return deck;
  });
};

export default useDecks;
