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
  deckBuilderNr?: number | null;
  attacks?: Record<string, { cost: string | null }>;
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
  deckBuilderNr: number | null;
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
  deckBuilderNr: card.deckBuilderNr ?? null,
});

export const normaliseMultipleCards = (cards: RawCardType[]): CardType[] =>
  cards.map(normaliseCard);

export type AttacksByDeckBuilderNr = Map<
  number,
  Record<string, { cost: string | null }> | undefined
>;

export interface CardsPayload {
  cards: CardType[];
  attacksByDeckBuilderNr: AttacksByDeckBuilderNr;
}

const indexCardAttacks = (raw: RawCardType[]): AttacksByDeckBuilderNr => {
  const index: AttacksByDeckBuilderNr = new Map();
  for (const record of raw) {
    if (record.deckBuilderNr != null) {
      index.set(record.deckBuilderNr, record.attacks);
    }
  }
  return index;
};

/**
 * Resolves the cards and the attack index together so no caller can read the
 * index before the fetch that fills it.
 */
export const fetchCards = async (): Promise<CardsPayload> => {
  const raw = CARDS_URL as unknown as RawCardType[];
  return {
    cards: normaliseMultipleCards(raw),
    attacksByDeckBuilderNr: indexCardAttacks(raw),
  };
};
