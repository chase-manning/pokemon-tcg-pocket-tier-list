import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { GOOGLE_ADSENSE_URL, GOOGLE_ANALYTICS_URL } from "./app/constants";
import reportWebVitals from "./reportWebVitals";
import GlobalStyles from "./styles/GlobalStyles";
import { BrowserRouter } from "react-router-dom";
import MissingContextProvider from "./components/MissingContext";
import FilterContextProvider from "./components/FilterContext";
import "./i18n";

const rootElement = document.getElementById("root") as HTMLElement;

const app = (
  <React.StrictMode>
    <BrowserRouter>
      <MissingContextProvider>
        <FilterContextProvider>
          <GlobalStyles />
          <App />
        </FilterContextProvider>
      </MissingContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);

const loadExternalScripts = () => {
    const ads = document.createElement('script');
    ads.src = GOOGLE_ADSENSE_URL;
    ads.defer = true;
    ads.crossOrigin = 'anonymous';
    document.body.appendChild(ads);

    const gtm = document.createElement('script');
    gtm.src = GOOGLE_ANALYTICS_URL;
    gtm.defer = true;
    document.body.appendChild(gtm);
};

const events = ['scroll', 'mousemove', 'touchstart', 'click'];
const triggerScripts = () => {
    loadExternalScripts();
    events.forEach(event => window.removeEventListener(event, triggerScripts));
};

events.forEach(event => window.addEventListener(event, triggerScripts, { once: true }));

// react-snap prerenders each route to static HTML at build time so crawlers
// (and the AdSense review) receive real content. We render fresh rather than
// hydrate: this app is heavily client-driven (i18n with per-user language
// detection, auth, async data), which makes the prerendered markup and the
// client's first paint diverge — hydrating that produces mismatch errors and a
// full client re-render anyway. Rendering fresh replaces the static markup
// cleanly in every language without console errors, while the served HTML keeps
// its SEO/AdSense value.
createRoot(rootElement).render(app);

reportWebVitals();
