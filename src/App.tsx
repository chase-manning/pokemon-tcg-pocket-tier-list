import { Suspense, lazy } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { DecksProvider } from "./contexts/DecksContext";
import AdAnchor from "./ads/AdAnchor";
import { ContentReadyProvider } from "./ads/ContentReadyContext";
import ErrorBoundary, { LoadingNotice } from "./components/ErrorBoundary";

const LandingPage = lazy(() => import("./pages/landing/LandingPage"));
const TierListPage = lazy(() => import("./pages/tier-list/TierListPage"));
const DeckPage = lazy(() => import("./pages/deck/DeckPage"));
const CardsListPage = lazy(() => import("./pages/cards-list/CardsListPage"));
const ExpansionListPage = lazy(() => import("./pages/expansion-list/ExpansionListPage"));
const StatisticsPage = lazy(() => import("./pages/stats/StatisticsPage"));
const PrivacyPage = lazy(() => import("./pages/legal/PrivacyPage"));
const AboutPage = lazy(() => import("./pages/legal/AboutPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
    },
  },
});

const StyledApp = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--bg);
`;

const Layout = () => {
  return (
      <StyledApp>
        {/* Inner boundary: contains a page-level crash to the routed view. */}
        <ErrorBoundary>
          <Suspense fallback={<LoadingNotice />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
        <AdAnchor />
      </StyledApp>
  );
};

const App = () => {
  return (
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <DecksProvider>
              <ContentReadyProvider>
                <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<LandingPage />} />
                    <Route path="tier-list" element={<TierListPage />} />
                    <Route path="cards-list" element={<CardsListPage />} />
                    <Route path="expansion-list" element={<ExpansionListPage />} />
                    <Route path="statistics" element={<StatisticsPage />} />
                    <Route path="privacy" element={<PrivacyPage />} />
                    <Route path="about" element={<AboutPage />} />
                    <Route path="deck">
                      <Route index element={<DeckPage />} />
                      <Route path=":deckId" element={<DeckPage />} />
                    </Route>
                    <Route path="*" element={<LandingPage />} />
                  </Route>
                </Routes>
              </ContentReadyProvider>
            </DecksProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ErrorBoundary>
  );
};

export default App;