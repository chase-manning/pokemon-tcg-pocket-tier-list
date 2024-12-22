import { useEffect, useState } from "react";
import DECKS from "./best-decks.json";
import OLD_DECKS from "./old.json";

const CARDS_URL =
  "https://raw.githubusercontent.com/chase-manning/pokemon-tcg-pocket-cards/refs/heads/main/v2.json";

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

export interface FullDeckType {
  id: string;
  name: string;
  cards: CardType[];
  score: number;
  place: number;
}

interface BestDecksCardType {
  count: number;
  name: string;
  set: string;
  number: string;
}

const cardToId = (card: BestDecksCardType): string => {
  const id = card.number;
  const padded = id.padStart(3, "0");
  const a1 = card.set === "A1";
  const pa = card.set === "P-A";
  const a1a = card.set === "A1a";
  const output = `${a1 ? "a1" : a1a ? "a1a" : pa ? "pa" : ""}-${padded}`;
  return output;
};

const useDecks = (old = false): FullDeckType[] | null => {
  const [cards, setCards] = useState<CardType[] | null>(null);

  useEffect(() => {
    fetch(CARDS_URL)
      .then((res) => res.json())
      .then((data) => setCards(data));
  }, []);

  if (!cards) return null;

  return (old ? OLD_DECKS : DECKS)
    .sort((a, b) => {
      return b.score - a.score;
    })
    .map((oldDeck, index) => {
      const deckCards = [];
      for (const oldCard of oldDeck.cards) {
        const amount = oldCard.count;
        const id = cardToId(oldCard);
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
        place: index + 1,
      };
      return deck;
    });
};

export default useDecks;
