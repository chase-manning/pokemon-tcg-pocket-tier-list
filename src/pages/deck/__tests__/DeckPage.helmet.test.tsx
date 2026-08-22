import { render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { DecksProvider } from "../../../contexts/DecksContext";
import MissingContextProvider from "../../../components/MissingContext";
import FilterContextProvider from "../../../components/FilterContext";
import { UIProvider } from "../../../contexts/UIContext";
import { ContentReadyProvider } from "../../../ads/ContentReadyContext";
import DeckPage from "../DeckPage";
import rawCards from "../../../app/__fixtures__/cards.json";

jest.mock("../../../app/use-is-premium", () => ({
  __esModule: true,
  default: () => true,
}));

jest.mock("../../../app/use-expansions", () => ({
  __esModule: true,
  default: () => [],
}));

// The c15t consent/ads chain resolves under webpack but not Jest's resolver;
// the ad slot is irrelevant to Helmet output, so stub it.
jest.mock("../../../ads/AdInContent", () => ({
  __esModule: true,
  default: () => null,
}));

// UserAccount pulls in Firebase auth; irrelevant to Helmet output, so stub it.
jest.mock("../../../components/UserAccount", () => ({
  __esModule: true,
  default: () => null,
}));

const DECK_ID = "venusaur-a1-004&bulbasaur-a1-001";
const DECKS_JSON = [
  {
    name: DECK_ID,
    lists: [{ cards: ["2:a1-004", "1:a1-219"], score: 10, strength: 5 }],
    percentOfGames: 50,
    popularity: 100,
  },
];
const MATCHUP_JSON = { [DECK_ID]: [] };

const jsonResponse = (body: unknown) =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(body),
  } as unknown as Response);

const metaContent = (selector: string, match?: string): string | null => {
  const nodes = Array.from(document.head.querySelectorAll(selector));
  const node = match
    ? nodes.find((n) => n.getAttribute("content")?.includes(match))
    : nodes[nodes.length - 1];
  return node?.getAttribute("content") ?? null;
};

describe("DeckPage Helmet tags", () => {
  beforeEach(() => {
    jest.spyOn(global, "fetch").mockImplementation((input) => {
      const url = String(input);
      if (url.endsWith("best-decks.json")) return jsonResponse(DECKS_JSON);
      if (url.endsWith("matchup-data.json")) return jsonResponse(MATCHUP_JSON);
      return jsonResponse(rawCards);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("sets a per-deck title and OG tags from the friendly card names", async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <UIProvider>
            <MissingContextProvider>
              <FilterContextProvider>
                <ContentReadyProvider>
                  <DecksProvider>
                    <MemoryRouter initialEntries={[`/deck/${DECK_ID}`]}>
                      <Routes>
                        <Route path="/deck/:deckId" element={<DeckPage />} />
                      </Routes>
                    </MemoryRouter>
                  </DecksProvider>
                </ContentReadyProvider>
              </FilterContextProvider>
            </MissingContextProvider>
          </UIProvider>
        </QueryClientProvider>
      </HelmetProvider>
    );

    await waitFor(() => expect(document.title).toContain("Venusaur ex"));

    expect(document.title).not.toContain("a1-004");

    expect(metaContent('meta[property="og:title"]')).toContain("Venusaur ex");
    expect(metaContent('meta[property="og:url"]')).toBe(
      `https://pocketdecks.top/deck/${DECK_ID}`
    );
    expect(metaContent('meta[property="og:image"]')).toBe(
      `https://pocketdecks.top/og/deck/${DECK_ID}.png`
    );
    expect(metaContent('meta[name="description"]', "Venusaur ex")).toContain("Venusaur ex");
  });
});
