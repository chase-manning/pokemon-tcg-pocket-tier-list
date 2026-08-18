import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DecksProvider, useDecks } from "./DecksContext";
import rawCards from "../app/__fixtures__/cards.json";

// Premium status is the only dependency that reaches for Firebase; the card
// resolution under test doesn't care what it returns.
jest.mock("../app/use-is-premium", () => ({
  __esModule: true,
  default: () => true,
}));

jest.mock("../app/use-expansions", () => ({
  __esModule: true,
  default: () => [],
}));

// "venusaur-a1-004" and "bulbasaur-a1-001" both resolve against the fixture.
// "missingno-a1-999" does not
const GOOD_DECK = "venusaur-a1-004&bulbasaur-a1-001";
const DRIFTED_DECK = "missingno-a1-999";

const decks = [
  {
    name: GOOD_DECK,
    lists: [{ cards: ["2:a1-004", "1:a1-219"], score: 10, strength: 5 }],
    percentOfGames: 50,
    popularity: 100,
  },
  {
    name: DRIFTED_DECK,
    lists: [{ cards: ["2:a1-999", "1:a1-219"], score: 9, strength: 4 }],
    percentOfGames: 40,
    popularity: 90,
  },
];

const matchupData = { [GOOD_DECK]: [], [DRIFTED_DECK]: [] };

const jsonResponse = (body: unknown) =>
  Promise.resolve({ json: () => Promise.resolve(body) } as Response);

const DeckNames = () => {
  const { decks, loading } = useDecks();
  if (loading || !decks) return <p>loading</p>;
  return (
    <ul>
      {decks.map((deck) => (
        <li key={deck.id}>{deck.name}</li>
      ))}
    </ul>
  );
};

const renderProvider = () =>
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      <DecksProvider>
        <DeckNames />
      </DecksProvider>
    </QueryClientProvider>
  );

describe("DecksProvider with a drifted card id", () => {
  let consoleWarn: jest.SpyInstance;

  beforeEach(() => {
    consoleWarn = jest.spyOn(console, "warn").mockImplementation(() => {});
    jest.spyOn(global, "fetch").mockImplementation((input) => {
      const url = String(input);
      if (url.endsWith("best-decks.json")) return jsonResponse(decks);
      if (url.endsWith("matchup-data.json")) return jsonResponse(matchupData);
      return jsonResponse(rawCards);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("still mounts and renders the decks it could resolve", async () => {
    renderProvider();

    await waitFor(() =>
      expect(screen.getByText(GOOD_DECK)).toBeInTheDocument()
    );
  });

  it("drops the deck referencing the unresolvable card", async () => {
    renderProvider();

    await waitFor(() =>
      expect(screen.getByText(GOOD_DECK)).toBeInTheDocument()
    );
    expect(screen.queryByText(DRIFTED_DECK)).not.toBeInTheDocument();
  });

  it("warns once, naming the id it skipped", async () => {
    renderProvider();

    await waitFor(() => expect(consoleWarn).toHaveBeenCalled());
    expect(consoleWarn).toHaveBeenCalledWith(
      expect.stringContaining("a1-999")
    );
  });
});
