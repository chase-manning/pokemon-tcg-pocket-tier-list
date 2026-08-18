import { CARDS_URL } from "./constants";

/** The field names the v5 dataset ships. Only what the app reads is declared. */
export interface RawCardType {
  id: string;
  name: string;
  rarity: string;
  pack: string;
  type: string;
  subtype: string;
  health: number | null;
  stage: string | null;
  image: string;
  ex: boolean;
  set_code: string;
}

export interface CardType {
  id: string;
  name: string;
  rarity: string;
  pack: string;
  type: string;
  supertype: string;
  health: number | null;
  stage: string | null;
  image: string;
  ex: boolean;
  set: string;
}

export const normaliseCard = (card: RawCardType): CardType => ({
  id: card.id,
  name: card.name,
  rarity: card.rarity,
  pack: card.pack,
  type: card.subtype,
  supertype: card.type,
  health: card.health,
  stage: card.stage,
  image: card.image,
  ex: card.ex,
  set: card.set_code,
});

export const normaliseMultipleCards = (cards: RawCardType[]): CardType[] =>
  cards.map(normaliseCard);

export const fetchCards = async (): Promise<CardType[]> => {
  const response = await fetch(CARDS_URL);
  const raw = (await response.json()) as RawCardType[];
  return normaliseMultipleCards(raw);
};
