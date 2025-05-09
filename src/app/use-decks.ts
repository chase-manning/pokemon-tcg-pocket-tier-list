import { useEffect, useState } from "react";
import DECKS from "./best-decks.json";
import OLD_DECKS from "./old.json";
import { DEBUG, MIN_PERCENT_TO_QUALIFY } from "./config";
import useMissing from "./use-missing";

const CARDS_URL =
  "https://raw.githubusercontent.com/chase-manning/pokemon-tcg-pocket-cards/refs/heads/main/v4.json";

export interface CardType {
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
  percentOfGames: number;
}

interface BestDecksCardType {
  count: number;
  name: string;
  set: string;
  number: string;
}

const setCode = (set: string): string => {
  if (set === "A1") return "a1";
  if (set === "A1a") return "a1a";
  if (set === "A2") return "a2";
  if (set === "A2a") return "a2a";
  if (set === "A2b") return "a2b";
  if (set === "P-A") return "pa";
  if (set === "A3") return "a3";
  throw new Error(`Unknown set code: ${set}`);
};

const cardToId = (card: BestDecksCardType): string => {
  const id = card.number;
  const padded = id.padStart(3, "0");
  const output = `${setCode(card.set)}-${padded}`;
  return output;
};

const useDecks = (old = false): FullDeckType[] | null => {
  const { missing } = useMissing();
  const [cards, setCards] = useState<CardType[] | null>(null);

  useEffect(() => {
    fetch(CARDS_URL)
      .then((res) => res.json())
      .then((data) => setCards(data));
  }, []);

  if (!cards) return null;

  const decks = (old ? OLD_DECKS : DECKS) as any[];

  const uniqueDeckNames: string[] = decks.reduce((acc, deck) => {
    if (!acc.includes(deck.name)) {
      acc.push(deck.name);
    }
    return acc;
  }, []);

  const uniqueMissing = [...new Set(missing)];
  console.log(missing);

  const bestDecks = uniqueDeckNames
    .map((name) => {
      const matchingDecks = decks
        .filter((deck) => deck.name === name)
        .filter((deck) => {
          for (const missingCard of uniqueMissing) {
            const matchingCards = deck.cards.reduce(
              (acc: number, card: any) => {
                const id = cardToId(card);
                if (id === missingCard) {
                  acc += card.count;
                }
                return acc;
              },
              0
            );
            const missingCount = missing.filter(
              (id) => id === missingCard
            ).length;
            if (matchingCards > 2 - missingCount) {
              return false;
            }
          }
          return true;
        });
      // sort by highest score
      matchingDecks.sort((a, b) => b.score - a.score);
      const bestDeck = matchingDecks[0];
      return bestDeck;
    })
    .filter((deck) => deck)
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
        percentOfGames: oldDeck.percentOfGames,
      };
      return deck;
    })
    .filter((deck) => {
      const isAboveMin = deck.percentOfGames > MIN_PERCENT_TO_QUALIFY;
      return DEBUG || isAboveMin;
    });

  // return bestDecks;

  // Excluding the decks at the bottom that don't have a double
  let includedDecks = [];
  let hasOneDouble = false;
  for (let i = bestDecks.length - 1; i >= 0; i--) {
    const deck = bestDecks[i];
    if (!hasOneDouble) {
      if (!deck.name.includes("&")) {
        continue;
      } else {
        hasOneDouble = true;
      }
    }
    includedDecks.push(deck);
  }

  return includedDecks.sort((a, b) => a.place - b.place);
};

export default useDecks;
