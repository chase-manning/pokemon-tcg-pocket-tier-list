import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import GlobalStyles from "./styles/GlobalStyles";
import { BrowserRouter } from "react-router";
import MissingContextProvider from "./components/MissingContext";
import FilterContextProvider from "./components/FilterContext";
import { UIProvider } from "./contexts/UIContext";
import ConsentProvider from "./consent/ConsentProvider";
import "./i18n";

// A deploy replaces every hashed chunk, so a tab that was already open asks for
// a filename the host no longer has. Hosting answers those with index.html, the
// import fails on the MIME type, and the route dies behind an error boundary.
// One reload picks up the new manifest; the stamp stops a broken chunk looping.
const RELOAD_STAMP = "chunk-reload-at";
window.addEventListener("vite:preloadError", (event) => {
  event.preventDefault();
  const last = Number(sessionStorage.getItem(RELOAD_STAMP) ?? 0);
  if (Date.now() - last < 10000) return;
  sessionStorage.setItem(RELOAD_STAMP, String(Date.now()));
  window.location.reload();
});

const rootElement = document.getElementById("root") as HTMLElement;

const app = (
  <React.StrictMode>
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
  </React.StrictMode>
);

// The build pipeline prerenders each route to static HTML so crawlers
// (and the AdSense review) receive real content. We render fresh rather than
// hydrate: this app is heavily client-driven (i18n with per-user language
// detection, auth, async data), so the prerendered markup and the client's
// first paint diverge. Hydrating that would only produce mismatch errors and a
// full client re-render, so rendering fresh replaces the static markup cleanly
// in every language, while the served HTML keeps its SEO and AdSense value.
createRoot(rootElement).render(app);

reportWebVitals();
