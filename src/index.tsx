import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import GlobalStyles from "./styles/GlobalStyles";
import { BrowserRouter } from "react-router-dom";
import MissingContextProvider from "./components/MissingContext";
import FilterContextProvider from "./components/FilterContext";
import { UIProvider } from "./contexts/UIContext";
import ConsentProvider from "./consent/ConsentProvider";
import { HelmetProvider } from "react-helmet-async";
import "./i18n";

const rootElement = document.getElementById("root") as HTMLElement;

const app = (
  <React.StrictMode>
    <HelmetProvider>
    <BrowserRouter>
      <UIProvider>
        <MissingContextProvider>
          <FilterContextProvider>
            <GlobalStyles />
            <ConsentProvider>
              <App />
            </ConsentProvider>
          </FilterContextProvider>
        </MissingContextProvider>
      </UIProvider>
    </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);

// react-snap prerenders each route to static HTML at build time so crawlers
// (and the AdSense review) receive real content. We render fresh rather than
// hydrate: this app is heavily client-driven (i18n with per-user language
// detection, auth, async data), so the prerendered markup and the client's
// first paint diverge. Hydrating that would only produce mismatch errors and a
// full client re-render, so rendering fresh replaces the static markup cleanly
// in every language, while the served HTML keeps its SEO and AdSense value.
createRoot(rootElement).render(app);

reportWebVitals();
