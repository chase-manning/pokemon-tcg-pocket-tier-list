import React, { createContext, useContext, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import useMissing from "../app/use-missing";
import useFilters from "../app/use-filters";
import useIsPremium from "../app/use-is-premium";
import { getSortValue } from "../app/sorting-helper";
import {
  CardType,
  fetchCards,
} from "../app/cards-api";
import { createDeckCode } from "../app/deck-code";
import { inferEnergyIds } from "../app/deck-energy";
import useExpansions from "../app/use-expansions";
import { MetaShareEntry, PipelineMatchupEntry, PipelineMetaShare, PipelinePartialDeck, PipelineDeckList } from "../types/pipeline-data";
import {
  cardToCount,
  cardToId,
  deckNameToIconIds,
  findUnresolvedCardIds,
  hasEnoughLatestExpansionCards,
  isAffordable,
  matchesEnergy,
  matchesExFilter,
} from "../app/deck-filters";
import { deckSlug } from "../app/deck-slug";

export type { CardType };

export type MatchupType = PipelineMatchupEntry;

type PartialList = PipelineDeckList;

type PartialDeckType = PipelinePartialDeck;

interface FullList {
  cards: CardType[];
  score: number;
  strength: number;
  energyIds: number[];
  deckCode: string | null;
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
  metaShareBySlug: Record<string, MetaShareEntry> | null;
  loading: boolean;
  error: Error | null;
}

const DecksContext = createContext<DecksContextType | undefined>(undefined);

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

// Share data is optional: any failure (network, 404, malformed JSON, wrong
// shape) degrades to null so deck pages and statistics keep loading.
const loadMetaShare = async (): Promise<PipelineMetaShare | null> => {
  try {
    const res = await fetch("/data/meta-share.json");
    if (!res.ok) return null;
    const data = await res.json();
    if (
      data &&
      typeof data === "object" &&
      !Array.isArray(data) &&
      Array.isArray((data as PipelineMetaShare).decks)
    ) {
      return data as PipelineMetaShare;
    }
    return null;
  } catch {
    return null;
  }
};

export const DecksProvider: React.FC<{ children: React.ReactNode }> = ({
                                                                         children,
                                                                       }) => {
  const { missing } = useMissing();
  const { energy, includeEx, deckAmount, sortBy, latestExpansionCards } = useFilters();
  const isPremium = useIsPremium();
  const expansions = useExpansions();

  const { data: cardsPayload, isLoading: cardsLoading } = useQuery({
    queryKey: ["cards"],
    queryFn: fetchCards,
  });
  const cards = cardsPayload?.cards;

  const cardsMapping: Record<string, CardType> = useMemo(() => {
    // `cards` is undefined until the query resolves.
    return (cards ?? []).reduce((acc: Record<string, CardType>, card: CardType) => {
      acc[card.id] = card;
      return acc;
    }, {});
  }, [cards]);

  const { data: decksData, isLoading: decksLoading, error: decksError } = useQuery({
      queryKey: ["decks"],
      queryFn: async () => {
        const [decksResponse, matchupDataResponse] = await Promise.all([
          fetch("/data/best-decks.json"),
          fetch("/data/matchup-data.json"),
        ]);

        if (!decksResponse.ok) {
          throw new Error(`Failed to fetch best-decks.json: ${decksResponse.status} ${decksResponse.statusText}`);
        }
        if (!matchupDataResponse.ok) {
          throw new Error(`Failed to fetch matchup-data.json: ${matchupDataResponse.status} ${matchupDataResponse.statusText}`);
        }

        const [decksData, matchupData] = await Promise.all([
          decksResponse.json(),
          matchupDataResponse.json(),
        ]);

        return { decks: decksData, matchupData, metaShare: await loadMetaShare() };
      },
    });

  const metaShareBySlug = useMemo(() => {
    const share: PipelineMetaShare | null | undefined = decksData?.metaShare;
    if (!share) return null;
    return Object.fromEntries(
      share.decks.map((d) => [d.name, d])
    ) as Record<string, MetaShareEntry>;
  }, [decksData]);

  const latestExpansionId = useMemo(() => {
    return expansions && expansions.length > 0
        ? expansions[expansions.length - 1].id
        : null;
  }, [expansions]);

  const decks = useMemo(() => {
    if (!cardsPayload || !decksData || isPremium === null) return null;

    const { decks, matchupData } = decksData;

    const unresolvedCardIds = new Set<string>();
    const canResolveIcon = (id: string): boolean => {
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
                const unresolved = findUnresolvedCardIds(
                    list.cards,
                    cardsMapping
                );
                unresolved.forEach((id: string) => unresolvedCardIds.add(id));
                return unresolved.length === 0;
              })
              .filter((list: PartialList) =>
                  isAffordable(list.cards, missingCounts)
              )
              .filter((list: PartialList) =>
                  matchesEnergy(list.cards, cardsMapping, energy)
              )
              .filter((list: PartialList) =>
                  matchesExFilter(list.cards, cardsMapping, includeEx)
              )
              .filter((list: PartialList) =>
                  hasEnoughLatestExpansionCards(
                      list.cards,
                      cardsMapping,
                      latestExpansionId,
                      latestExpansionCards
                  )
              );

          return { ...deck, lists: filteredLists };
        })
        .filter((deck: PartialDeckType) => deck.lists.length > 0)
        .filter((deck: PartialDeckType) =>
            canResolveIcon(deckNameToIconIds(deck.name)[0])
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
              energyIds: [],
              deckCode: null,
            };
          });

          const cardIds = deckNameToIconIds(oldDeck.name);
          const iconSecondary = cardIds[1]
            ? cardsMapping[cardIds[1]] ?? null
            : null;

          const deck: FullDeckType = {
            id: deckSlug(oldDeck.name),
            name: oldDeck.name,
            lists,
            // sort reorders the array in place; pick before augmenting.
            bestList: (() => {
              const bestList = lists.sort((a: FullList, b: FullList) => b.score - a.score)[0];
              const deckBuilderNrs = bestList.cards.map((card) => card.deckBuilderNr);
              if (deckBuilderNrs.some((nr) => nr == null)) {
                return { ...bestList, energyIds: [], deckCode: null };
              }
              const energyIds = inferEnergyIds(
                bestList.cards.map((card) => ({
                  supertype: card.supertype,
                  deckBuilderNr: card.deckBuilderNr as number,
                  attacks: cardsPayload!.attacksByDeckBuilderNr.get(card.deckBuilderNr as number),
                }))
              );
              return {
                ...bestList,
                energyIds,
                deckCode: createDeckCode(deckBuilderNrs as number[], energyIds),
              };
            })(),
            score: maxScore(oldDeck),
            popularity: highestPopularity > 0 ? oldDeck.popularity / highestPopularity : 0,
            strength: highestStrength > 0 ? maxStrength(oldDeck) / highestStrength : 0,
            percentOfGames: oldDeck.percentOfGames,
            matchups,
            iconPrimary: cardsMapping[cardIds[0]],
            iconSecondary,
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
    cardsPayload,
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
          metaShareBySlug,
          loading: cardsLoading || decksLoading,
          error: decksError ?? null,
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