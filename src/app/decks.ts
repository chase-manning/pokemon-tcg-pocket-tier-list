interface DeckType {
  id: string;
  name: string;
  cards: string[];
}

const DECKS: DeckType[] = [
  {
    id: "mewtwo-gardevoir",
    name: "Mewtwo & Gardevoir",
    cards: [
      "a1-129",
      "a1-129",
      "a1-130",
      "a1-130",
      "a1-131",
      "a1-131",
      "a1-132",
      "a1-132",
      "pa-005",
      "pa-005",
      "pa-001",
      "pa-001",
      "pa-002",
      "pa-002",
      "pa-007",
      "pa-007",
      "a1-223",
      "a1-223",
      "a1-225",
      "pa-006",
    ],
  },
];

export default DECKS;
