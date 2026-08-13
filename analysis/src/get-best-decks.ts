import fs from "fs";
import cardToString from "./utils/card-to-string";
import getDecks from "./utils/get-decks";
import getId from "./utils/get-id";
import { calculateDeckScore } from "./utils/calculate-deck-score";
import { calculateCardScores } from "./utils/calculate-card-scores";
import { calculateMatchupResults } from "./utils/calculate-matchup-results";
import { Deck, MatchupData } from "./utils/types";
import { convertCardsToIds } from "./utils/convert-cards";
import {
  MIN_WINRATE_THRESHOLD,
  MIN_ARCHETYPE_QUALIFIED_GAMES,
} from "./settings";

const CARDS_API =
  "https://raw.githubusercontent.com/chase-manning/pokemon-tcg-pocket-cards/refs/heads/main/v4.json";

const run = async () => {
  const cardsPromise = fetch(CARDS_API);
  const allDecks = getDecks();

  const qualifiedDecks = allDecks.filter(
    (deck: Deck) =>
      deck.totalGames > 0 &&
      deck.winCount / deck.totalGames >= MIN_WINRATE_THRESHOLD
  );

  console.log(
    `Qualified decks (>=${MIN_WINRATE_THRESHOLD * 100}% winrate): ${qualifiedDecks.length} / ${allDecks.length}`
  );

  const allQualifiedGames = qualifiedDecks.reduce(
    (acc: number, deck: Deck) => acc + deck.totalGames,
    0
  );

  // Tally qualified games per archetype so we can drop tiny-sample
  // archetypes (1-2 lucky tournament runs) from the rankings.
  const qualifiedGamesByName = new Map<string, number>();
  for (const deck of qualifiedDecks) {
    qualifiedGamesByName.set(
      deck.name,
      (qualifiedGamesByName.get(deck.name) ?? 0) + deck.totalGames
    );
  }

  const allDeckNames = [...new Set(qualifiedDecks.map((d: Deck) => d.name))];
  const uniqueDeckNames = allDeckNames.filter(
    (name: string) =>
      (qualifiedGamesByName.get(name) ?? 0) >= MIN_ARCHETYPE_QUALIFIED_GAMES
  );
  const droppedCount = allDeckNames.length - uniqueDeckNames.length;
  console.log(
    `Archetypes ranked: ${uniqueDeckNames.length} (dropped ${droppedCount} below ${MIN_ARCHETYPE_QUALIFIED_GAMES} qualified games)`
  );

  // Calculate Best Decks
  const bestDecks = [];
  const idExists: Record<string, boolean> = {};
  let matchupResults: Record<
    string,
    Record<string, { wins: number; losses: number }>
  > = {};

  for (const deckName of uniqueDeckNames) {
    matchupResults[deckName] = {};

    // Qualified decks for this archetype (80%+ winrate)
    const matchingQualifiedDecks = qualifiedDecks.filter(
      (game: Deck) => game.name === deckName
    );
    const matchingQualifiedGames = matchingQualifiedDecks.reduce(
      (acc: number, game: Deck) => acc + game.totalGames,
      0
    );
    const percentOfGames = matchingQualifiedGames / allQualifiedGames;

    const cards: Record<
      string,
      { winCount: number; totalGames: number; score?: number }
    > = {};
    for (const deck of matchingQualifiedDecks) {
      for (const card of deck.cards) {
        const cardName = cardToString(card);
        if (cards[cardName]) {
          cards[cardName].winCount += deck.winCount;
          cards[cardName].totalGames += deck.totalGames;
        } else {
          cards[cardName] = {
            winCount: deck.winCount,
            totalGames: deck.totalGames,
          };
        }
      }
    }

    // Calculate card scores from qualified decks
    const scoredCards = calculateCardScores(cards, matchingQualifiedGames);

    // Calculate matchup results from ALL decks (unfiltered) so winrates are accurate
    matchupResults[deckName] = calculateMatchupResults(allDecks, deckName);

    // Build lists from qualified decks only
    const lists: any = [];
    for (const deck of matchingQualifiedDecks) {
      const id = getId(deck);
      if (idExists[id]) continue;
      const deckScore = calculateDeckScore(
        deck,
        scoredCards,
        matchingQualifiedGames,
        allQualifiedGames
      );
      const formattedList = {
        cards: convertCardsToIds(deck.cards),
        score: deckScore.score,
        strength: deckScore.strength,
      };
      lists.push(formattedList);
      idExists[id] = true;
    }

    const deckScore = calculateDeckScore(
      matchingQualifiedDecks[0],
      scoredCards,
      matchingQualifiedGames,
      allQualifiedGames
    );
    bestDecks.push({
      name: deckName,
      lists,
      popularity: deckScore.popularity,
      percentOfGames,
      score: lists[0]?.score ?? 0
    });
  }

  const matchupData: Record<string, MatchupData[]> = {};
  for (const [deckName, matchups] of Object.entries(matchupResults)) {
    let totalWins = 0;
    let totalLosses = 0;
    matchupData[deckName] = Object.entries(matchups).map(
        ([opponent, { wins, losses }]) => {
          totalWins += wins;
          totalLosses += losses;
          const totalGames = wins + losses;
          return {
            name: opponent,
            winRate: totalGames > 0 ? wins / totalGames : 0,
            totalGames,
          };
        }
    );

    const totalGames = totalWins + totalLosses;
    const winRate = totalGames > 0 ? totalWins / totalGames : 0;
    matchupData[deckName].push({
      name: "Total",
      winRate,
      totalGames,
    });
  }

  const allCards: Record<string, { winCount: number; totalGames: number }> = {};
  for (const deck of qualifiedDecks) {
    for (const card of deck.cards) {
      const cardName = cardToString(card);
      if (allCards[cardName]) {
        allCards[cardName].winCount += deck.winCount;
        allCards[cardName].totalGames += deck.totalGames;
      } else {
        allCards[cardName] = {
          winCount: deck.winCount,
          totalGames: deck.totalGames,
        };
      }
    }
  }
  const cardScores = calculateCardScores(allCards, allQualifiedGames);
  const cardScoresList: { name: string; score: number; popularity: number }[] =
    Object.entries(cardScores).map(([cardName, { score, popularity }]) => ({
      name: cardName,
      score,
      popularity,
    }));
  cardScoresList.sort((a, b) => b.score - a.score);

  const cardsRequest = await cardsPromise;
  const cards = (await cardsRequest.json()) as any[];
  const cardIds = cards.map((card: any) => card.id);
  const idExistsInApi: Record<string, boolean> = cardIds.reduce(
    (acc: Record<string, boolean>, id: string) => {
      acc[id] = true;
      return acc;
    },
    {}
  );

  for (const deck of bestDecks) {
    for (const list of deck.lists) {
      for (const card of list.cards) {
        const parts = card.split(":");
        const id = parts[1];
        if (!idExistsInApi[id]) {
          throw new Error(`Card not found in API: ${id}`);
        }
      }
    }
  }

  const trendData: Record<string, any> = {};
  const top6Names = [...bestDecks]
      .sort((a, b) => b.lists[0].score - a.lists[0].score)
      .slice(0, 6)
      .map((d) => d.name);

  for (const deck of qualifiedDecks) {
    const dateStr = deck.date.split("T")[0];

    if (!trendData[dateStr]) {
      trendData[dateStr] = { date: dateStr, totalGames: 0 };
      top6Names.forEach((name) => (trendData[dateStr][name] = 0));
    }

    trendData[dateStr].totalGames += deck.totalGames;
    if (top6Names.includes(deck.name)) {
      trendData[dateStr][deck.name] += deck.totalGames;
    }
  }

  const trends = Object.values(trendData)
      .map((day) => {
        const result: any = { date: day.date };
        top6Names.forEach((name) => {
          result[name] = day.totalGames > 0 ? (day[name] / day.totalGames) * 100 : 0;
        });
        return result;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  fs.writeFileSync(
      "../public/data/historical-trends.json",
      JSON.stringify(trends, null, 2)
  );

  fs.writeFileSync(
    "./data/card-scores.json",
    JSON.stringify(cardScoresList, null, 2)
  );
  fs.writeFileSync(
    "../public/data/card-scores.json",
    JSON.stringify(cardScoresList, null, 2)
  );
  fs.writeFileSync(
    "./data/best-decks.json",
    JSON.stringify(bestDecks, null, 2)
  );
  fs.writeFileSync(
    "../public/data/best-decks.json",
    JSON.stringify(bestDecks, null, 2)
  );
  fs.writeFileSync(
    "../public/data/matchup-data.json",
    JSON.stringify(matchupData, null, 2)
  );
  fs.writeFileSync(
    "../src/app/last-updated.ts",
    `export const LAST_UPDATED = new Date("${new Date().toISOString()}");`
  );
};

run().catch(console.error);