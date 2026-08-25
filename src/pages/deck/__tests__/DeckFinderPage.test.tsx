import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router";
import { DecksProvider } from "../../../contexts/DecksContext";
import MissingContextProvider from "../../../components/MissingContext";
import FilterContextProvider from "../../../components/FilterContext";
import { UIProvider } from "../../../contexts/UIContext";
import { ContentReadyProvider } from "../../../ads/ContentReadyContext";
import DeckFinderPage from "../DeckFinderPage";
import i18n from "../../../i18n";
import rawCards from "../../../app/__fixtures__/cards.json";

vi.mock("../../../app/use-is-premium", () => ({
  __esModule: true,
  default: () => true,
}));

vi.mock("../../../app/use-expansions", () => ({
  __esModule: true,
  default: () => [],
}));

vi.mock("../../../ads/AdInContent", () => ({
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

const renderFinder = () =>
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      <UIProvider>
        <MissingContextProvider>
          <FilterContextProvider>
            <ContentReadyProvider>
              <DecksProvider>
                <MemoryRouter initialEntries={["/deck"]}>
                  <Routes>
                    <Route path="/deck" element={<DeckFinderPage />} />
                  </Routes>
                </MemoryRouter>
              </DecksProvider>
            </ContentReadyProvider>
          </FilterContextProvider>
        </MissingContextProvider>
      </UIProvider>
    </QueryClientProvider>
  );

describe("DeckFinderPage", () => {
  beforeAll(async () => {
    await i18n.init();
    await i18n.changeLanguage("en");
    await i18n.loadNamespaces("translation");
  });

  beforeEach(() => {
    vi.spyOn(global, "fetch").mockImplementation((input) => {
      const url = String(input);
      if (url.endsWith("best-decks.json")) return jsonResponse(DECKS_JSON);
      if (url.endsWith("matchup-data.json")) return jsonResponse(MATCHUP_JSON);
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

  it("shows the empty state after removing a needed card, and restores on undo", async () => {
    renderFinder();

    const venusaur = await screen.findByRole("button", {
      name: /Venusaur ex/,
    });

    // Removing one of its two copies makes the only deck unaffordable.
    fireEvent.click(venusaur);

    expect(await screen.findByText("¯\\_(ツ)_/¯")).toBeInTheDocument();

    const undo = await screen.findByRole("button", { name: "Undo" });
    expect(undo).toBeEnabled();

    fireEvent.click(undo);

    expect(await screen.findByAltText("Venusaur ex")).toBeInTheDocument();
    expect(screen.queryByText("¯\\_(ツ)_/¯")).not.toBeInTheDocument();
  });
});
