import { PipelineCard, PipelineMatchupEntry, PipelineDeckList, PipelinePartialDeck } from "../../../src/types/pipeline-data";

export type Card = PipelineCard;

export interface Deck {
  id: string;
  name: string;
  cards: Card[];
  pokemon: number;
  differentPokemon: number;
  winCount: number;
  lossCount: number;
  totalGames: number;
  date: string;
  tournamentExPercent: number;
  noTrainerPercent: number;
  wins: string[];
  losses: string[];
  // Recency weight (set by applyMultipliers); defaults to 1 when unset so
  // older code paths/tests still behave correctly.
  multiplier?: number;
}

export interface Tournament {
  id: string;
  date: string;
  players?: number;
}

export interface Pairing {
  winner: string;
  player1: string;
  player2: string;
}

export interface MatchupResult {
  wins: number;
  losses: number;
}

export type MatchupData = PipelineMatchupEntry;

export type DeckList = PipelineDeckList;

export type PartialDeck = PipelinePartialDeck;

