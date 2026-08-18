import React, { createContext, useContext, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import useMissing from "../app/use-missing";
import useFilters from "../app/use-filters";
import useIsPremium from "../app/use-is-premium";
import { getSortValue } from "../app/sorting-helper";
import { CardType, fetchCards } from "../app/cards-api";
import useExpansions from "../app/use-expansions";

export type { CardType };

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

const deckNameToIconIds = (name: string): string[] => {
  return name.split("&").map((cardName: string) => {
    const cardNameParts = cardName.split("-");
    return [
      cardNameParts[cardNameParts.length - 2],
      cardNameParts[cardNameParts.length - 1],
    ].join("-");
  });
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

  const { data: cards, isLoading: cardsLoading } = useQuery<CardType[]>({
    queryKey: ["cards"],
    queryFn: fetchCards,
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

    const unresolvedCardIds = new Set<string>();
    const canResolve = (id: string): boolean => {
      if (cardsMapping[id]) return true;
      unresolvedCardIds.add(id);
      return false;
    };

    // Pre-calculate missing cards map for O(1) lookups
    const missingCounts: Record<string, number> = {};
    for (const id of missing) {
      missingCounts[id] = (missingCounts[id] || 0) + 1;
    }

    const decksFiltered = decks
        .map((deck: PartialDeckType) => {
          const filteredLists = deck.lists
              .filter((list: PartialList) => {
                return list.cards.every((card: string) =>
                    canResolve(cardToId(card))
                );
              })
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
                  return cardData.type === energy || cardData.supertype === "Trainer";
                });
              })
              .filter((list: PartialList) => {
                if (includeEx) return true;
                return list.cards.every((card: string) => {
                  const id = cardToId(card);
                  const cardData = cardsMapping[id];
                  return cardData.supertype === "Trainer" || !cardData.ex;
                });
              })
              .filter((list: PartialList) => {
                if (latestExpansionCards === null || latestExpansionId === null) return true;

                let cardsFromLatestExpansion = 0;
                for (const card of list.cards) {
                  const id = cardToId(card);
                  const cardData = cardsMapping[id];
                  if (cardData.id.split("-")[0] === latestExpansionId) {
                    cardsFromLatestExpansion += cardToCount(card);
                  }
                }
                return cardsFromLatestExpansion >= latestExpansionCards;
              });

          return { ...deck, lists: filteredLists };
        })
        .filter((deck: PartialDeckType) => deck.lists.length > 0)
        .filter((deck: PartialDeckType) =>
            canResolve(deckNameToIconIds(deck.name)[0])
        )
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

          const cardIds = deckNameToIconIds(oldDeck.name);

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

    if (unresolvedCardIds.size > 0) {
      console.warn(
          `Skipped decks referencing ${unresolvedCardIds.size} card id(s) missing from the card data: ${Array.from(
              unresolvedCardIds
          ).join(", ")}`
      );
    }

    if (energy !== null) return fullDecks;

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

    return includedDecks.reverse();
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