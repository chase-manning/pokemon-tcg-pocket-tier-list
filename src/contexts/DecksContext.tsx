import React, { createContext, useContext, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import useMissing from "../app/use-missing";
import useFilters from "../app/use-filters";
import useIsPremium from "../app/use-is-premium";
import { getSortValue } from "../app/sorting-helper";
import { CARDS_URL } from "../app/constants";
import useExpansions from "../app/use-expansions";

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
  ex: string;
  set: string;
}

export interface MatchupType {
  name: string;
  winRate: number;
  totalGames: number;
}

interface PartialList {
  cards: string[];
  score: number;
  strength: number;
}

interface PartialDeckType {
  name: string;
  lists: PartialList[];
  percentOfGames: number;
  popularity: number;
}

interface FullList {
  cards: CardType[];
  score: number;
  strength: number;
}

export interface FullDeckType {
  id: string;
  name: string;
  lists: FullList[];
  bestList: FullList;
  score: number;
  popularity: number;
  strength: number;
  percentOfGames: number;
  matchups: MatchupType[];
  iconPrimary: CardType;
  iconSecondary: CardType | null;
}

interface DecksContextType {
  decks: FullDeckType[] | null;
  loading: boolean;
}

const DecksContext = createContext<DecksContextType | undefined>(undefined);

const cardToId = (card: string): string => {
  return card.split(":")[1];
};

const cardToCount = (card: string): number => {
  return parseInt(card.split(":")[0]);
};

const maxStrength = (deck: PartialDeckType): number => {
  return deck.lists.reduce((curr: number, list: PartialList) => {
    if (list.strength > curr) return list.strength;
    return curr;
  }, 0);
};

const maxScore = (deck: PartialDeckType): number => {
  return deck.lists.reduce((curr: number, list: PartialList) => {
    if (list.score > curr) return list.score;
    return curr;
  }, 0);
};

export const DecksProvider: React.FC<{ children: React.ReactNode }> = ({
                                                                         children,
                                                                       }) => {
  const { missing } = useMissing();
  const { energy, includeEx, deckAmount, sortBy, latestExpansionCards } = useFilters();
  const isPremium = useIsPremium();
  const expansions = useExpansions();

  const { data: cards, isLoading: cardsLoading } = useQuery({
    queryKey: ["cards"],
    queryFn: async () => {
      const response = await fetch(CARDS_URL);
      return response.json();
    },
  });

  const cardsMapping: Record<string, CardType> = useMemo(() => {
    return cards?.reduce((acc: Record<string, CardType>, card: CardType) => {
      acc[card.id] = card;
      return acc;
    }, {});
  }, [cards]);

  const { data: decksData, isLoading: decksLoading } = useQuery({
    queryKey: ["decks"],
    queryFn: async () => {
      const [decksResponse, matchupDataResponse] = await Promise.all([
        fetch("/data/best-decks.json"),
        fetch("/data/matchup-data.json"),
      ]);

      const [decksData, matchupData] = await Promise.all([
        decksResponse.json(),
        matchupDataResponse.json(),
      ]);

      return { decks: decksData, matchupData };
    },
  });

  const latestExpansionId = useMemo(() => {
    return expansions && expansions.length > 0
        ? expansions[expansions.length - 1].id
        : null;
  }, [expansions]);

  const decks = useMemo(() => {
    if (!cards || !decksData || isPremium === null) return null;

    const { decks, matchupData } = decksData;

    // Pre-calculate missing cards map for O(1) lookups
    const missingCounts: Record<string, number> = {};
    for (const id of missing) {
      missingCounts[id] = (missingCounts[id] || 0) + 1;
    }

    const decksFiltered = decks
        .map((deck: PartialDeckType) => {
          const filteredLists = deck.lists
              .filter((list: PartialList) => {
                // A single O(N) pass
                for (const card of list.cards) {
                  const id = cardToId(card);
                  if (missingCounts[id]) {
                    const countNeeded = cardToCount(card);
                    if (countNeeded > 2 - missingCounts[id]) {
                      return false;
                    }
                  }
                }
                return true;
              })
              .filter((list: PartialList) => {
                if (energy === null) return true;
                return list.cards.every((card: string) => {
                  const id = cardToId(card);
                  const cardData = cardsMapping[id];
                  if (!cardData) throw new Error(`Card not found: ${id}`);
                  return cardData.type === energy || cardData.type === "Trainer";
                });
              })
              .filter((list: PartialList) => {
                if (includeEx) return true;
                return list.cards.every((card: string) => {
                  const id = cardToId(card);
                  const cardData = cardsMapping[id];
                  if (!cardData) throw new Error(`Card not found: ${id}`);
                  return cardData.type === "Trainer" || cardData.ex === "No";
                });
              })
              .filter((list: PartialList) => {
                if (latestExpansionCards === null || latestExpansionId === null) return true;

                let cardsFromLatestExpansion = 0;
                for (const card of list.cards) {
                  const id = cardToId(card);
                  const cardData = cardsMapping[id];
                  if (!cardData) throw new Error(`Card not found: ${id}`);
                  if (cardData.id.split("-")[0] === latestExpansionId) {
                    cardsFromLatestExpansion += cardToCount(card);
                  }
                }
                return cardsFromLatestExpansion >= latestExpansionCards;
              });

          return { ...deck, lists: filteredLists };
        })
        .filter((deck: PartialDeckType) => deck.lists.length > 0)
        .sort((a: PartialDeckType, b: PartialDeckType) => b.percentOfGames - a.percentOfGames)
        .slice(0, deckAmount);

    const highestPopularity =
        decksFiltered.length > 0
            ? decksFiltered.sort(
                (a: PartialDeckType, b: PartialDeckType) =>
                    b.popularity - a.popularity
            )[0].popularity
            : 0;

    const highestStrength =
        decksFiltered.length > 0
            ? decksFiltered
                .map((deck: PartialDeckType) => maxStrength(deck))
                .sort((a: number, b: number) => b - a)[0]
            : 0;

    const fullDecks = decksFiltered
        .map((oldDeck: PartialDeckType) => {
          const matchups = matchupData[oldDeck.name];

          const lists: FullList[] = oldDeck.lists.map((oldList: PartialList) => {
            const newCards: CardType[] = [];
            for (const oldCard of oldList.cards) {
              const amount = cardToCount(oldCard);
              const id = cardToId(oldCard);
              const card = cardsMapping[id];
              if (!card) {
                throw new Error(`Card not found: ${id}`);
              }
              for (let i = 0; i < amount; i++) {
                newCards.push(card);
              }
            }
            return {
              score: oldList.score,
              strength: oldList.strength,
              cards: newCards,
            };
          });

          const cardNames = oldDeck.name.split("&");
          const cardIds = cardNames.map((cardName) => {
            const cardNameParts = cardName.split("-");
            const cardIdParts = [
              cardNameParts[cardNameParts.length - 2],
              cardNameParts[cardNameParts.length - 1],
            ];
            return cardIdParts.join("-");
          });

          const deck: FullDeckType = {
            id: oldDeck.name.toLowerCase().replace(/\s/g, "-"),
            name: oldDeck.name,
            lists,
            bestList: lists.sort(
                (a: FullList, b: FullList) => b.score - a.score
            )[0],
            score: maxScore(oldDeck),
            popularity: oldDeck.popularity / highestPopularity,
            strength: maxStrength(oldDeck) / highestStrength,
            percentOfGames: oldDeck.percentOfGames,
            matchups,
            iconPrimary: cardsMapping[cardIds[0]],
            iconSecondary: cardsMapping[cardIds[1]],
          };
          return deck;
        })
        .sort(
            (a: FullDeckType, b: FullDeckType) =>
                getSortValue(b, sortBy) - getSortValue(a, sortBy)
        );

    if (energy !== null) {
      return fullDecks.sort(
          (a: FullDeckType, b: FullDeckType) =>
              getSortValue(b, sortBy) - getSortValue(a, sortBy)
      );
    }

    const includedDecks = [];
    let hasOneDouble = false;
    for (let i = fullDecks.length - 1; i >= 0; i--) {
      const deck = fullDecks[i];
      if (!hasOneDouble) {
        if (!deck.name.includes("&")) {
          continue;
        } else {
          hasOneDouble = true;
        }
      }
      includedDecks.push(deck);
    }

    return includedDecks.sort(
        (a: FullDeckType, b: FullDeckType) =>
            getSortValue(b, sortBy) - getSortValue(a, sortBy)
    );
  }, [
    cards,
    decksData,
    isPremium,
    missing,
    energy,
    includeEx,
    deckAmount,
    sortBy,
    cardsMapping,
    latestExpansionCards,
    latestExpansionId,
  ]);

  const value = {
    decks,
    loading: cardsLoading || decksLoading,
  };

  return (
      <DecksContext.Provider value={value}>{children}</DecksContext.Provider>
  );
};

export const useDecks = () => {
  const context = useContext(DecksContext);
  if (context === undefined) {
    throw new Error("useDecks must be used within a DecksProvider");
  }
  return context;
};