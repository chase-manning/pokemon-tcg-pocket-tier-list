import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DecksProvider, useDecks, useAllDecks } from "../DecksContext";
import MissingContextProvider from "../../components/MissingContext";
import useMissing from "../../app/use-missing";
import rawCards from "../../app/__fixtures__/cards.json";

vi.mock("../../app/use-is-premium", () => ({
  __esModule: true,
  default: () => true,
}));

vi.mock("../../app/use-expansions", () => ({
  __esModule: true,
  default: () => [],
}));

const SHARED = "a1-004";
const GOOD_DECK = "venusaur-a1-004&bulbasaur-a1-001";

const decks0 = [
  {
    name: GOOD_DECK,
    lists: [{ cards: ["2:a1-004", "1:a1-219"], score: 10, strength: 5 }],
    percentOfGames: 50,
    popularity: 100,
  },
];

const UNPAIRED_DECK = "bulbasaur-a1-001";

const unpairedDeck = {
  name: UNPAIRED_DECK,
  lists: [{ cards: ["1:a1-001", "1:a1-219"], score: 8, strength: 4 }],
  percentOfGames: 20,
  popularity: 40,
};

const decks = [...decks0, unpairedDeck];

const matchupData = { [GOOD_DECK]: [], [UNPAIRED_DECK]: [] };

const jsonResponse = (body: unknown) =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(body),
  } as unknown as Response);

const DeckNamesBoth = () => {
  const { decks, loading } = useDecks();
  const allDecks = useAllDecks();
  if (loading || !decks || !allDecks) return <p>loading</p>;
  return (
    <ul>
      <li data-testid="filtered">{decks.map((d) => d.name).join(",")}</li>
      <li data-testid="full">{allDecks.map((d) => d.name).join(",")}</li>
    </ul>
  );
};

// A one-tap way to mark the shared card missing inside the rendered tree.
const CutSharedCard = () => {
  const { addMissing } = useMissing();
  return <button onClick={() => addMissing([SHARED])}>cut</button>;
};

describe("DecksProvider exposes a full deck list beside the filtered one", () => {
  beforeEach(() => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(global, "fetch").mockImplementation((input) => {
      const url = String(input);
      if (url.endsWith("best-decks.json")) return jsonResponse(decks);
      if (url.endsWith("matchup-data.json")) return jsonResponse(matchupData);
      if (url.endsWith("meta-share.json"))
        return jsonResponse({
          generatedAt: "2026-08-24T00:00:00Z",
          windowDays: 7,
          decks: [],
        });
      return jsonResponse(rawCards);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("keeps the deck in allDecks after it leaves the missing-filtered list", async () => {
    render(
      <QueryClientProvider
        client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
      >
        <MissingContextProvider>
          <DecksProvider>
            <CutSharedCard />
            <DeckNamesBoth />
          </DecksProvider>
        </MissingContextProvider>
      </QueryClientProvider>
    );

    await screen.findByTestId("filtered");

    // Without cuts the filtered list keeps only one paired deck (the legacy
    // trim), while allDecks keeps everything including the unpaired deck.
    expect(screen.getByTestId("filtered").textContent).toContain(GOOD_DECK);
    expect(screen.getByTestId("full").textContent).toContain(GOOD_DECK);
    expect(screen.getByTestId("full").textContent).toContain(UNPAIRED_DECK);

    fireEvent.click(screen.getByText("cut"));

    await waitFor(() => {
      expect(screen.getByTestId("filtered").textContent).not.toContain(GOOD_DECK);
    });

    expect(screen.getByTestId("full").textContent).toContain(GOOD_DECK);
  });
});
