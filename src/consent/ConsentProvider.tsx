import { ReactNode } from "react";
import { ConsentBanner, ConsentManagerProvider } from "@c15t/react";
import { gtag } from "@c15t/scripts/google-tag";
// Import the real component stylesheet directly. The @c15t/react/styles.css
// entrypoint only re-@imports this via a bare specifier, which CRA's css-loader
// does not resolve, so the prebuilt styles never load through it.
import "@c15t/ui/styles.css";
import "./consent-overrides.css";
import { GOOGLE_GTAG } from "../app/constants";
import { consentTheme } from "./consent-theme";

// c15t injects gtag, sets Consent Mode v2 to denied by default and pushes the
// update when a visitor chooses. Registering both categories lets one gtag
// cover analytics (measurement) and the ad signals (marketing), so accepting
// marketing grants ad_storage and ads can personalise. The loader is injected
// once; the second entry only adds the marketing consent mapping. AdSense loads
// on its own path so the premium and content-ready gates still apply.
const scripts = [
  gtag({ id: GOOGLE_GTAG, category: "measurement" }),
  gtag({ id: GOOGLE_GTAG, category: "marketing" }),
];

const ConsentProvider = ({ children }: { children: ReactNode }) => (
  <ConsentManagerProvider options={{ mode: "offline", scripts, ...consentTheme }}>
    {children}
    <ConsentBanner />
  </ConsentManagerProvider>
);

export default ConsentProvider;
