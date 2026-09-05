import github from "../assets/github.svg";
import twitter from "../assets/twitter.svg";
import cardsPayload from "pokemon-tcg-pocket-cards/data/v5/cards.min.json";
import expansionsPayload from "pokemon-tcg-pocket-cards/data/v5/expansions.min.json";

export const EXPANSION_NAME = "Ruler of the Skies (B4)"

export const FREE_DECK_AMOUNT = 30;
export const CARDS_URL = cardsPayload;
export const EXPANSIONS_URL = expansionsPayload;
export const GITHUB_URL =
  "https://github.com/chase-manning/pokemon-tcg-pocket-tier-list";
export const CARDS_REPO_URL =
  "https://github.com/chase-mew/pokemon-tcg-pocket-cards";
export const TWITTER_URL = "https://x.com/pocketdecks";
export const GOOGLE_ADSENSE_URL = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3547629432918335';
export const GOOGLE_ANALYTICS_URL = 'https://www.googletagmanager.com/gtag/js?id=G-SBZ51J3S1R';
export const GOOGLE_GTAG = 'G-SBZ51J3S1R';
export const CONTACT_EMAIL = "infoLeonid@protonMail.com";
// Premium checkout is closed in the app. New signups must also be blocked in
// Stripe by archiving every signup Price (current and legacy) so the Firebase
// Stripe extension cannot create checkout sessions from known price IDs.
// Existing subscribers keep renewing until they cancel via the billing portal.
export const MANAGE_SUBSCRIPTION_URL =
    "https://billing.stripe.com/p/login/4gM9ASeDk2QcaKq2Y957W00";

export const SOCIALS = [
  {
    url: GITHUB_URL,
    icon: github,
    alt: "GitHub",
    label: "View source code on GitHub",
  },
  {
    url: TWITTER_URL,
    icon: twitter,
    alt: "Twitter",
    label: "Follow us on Twitter",
  },
];
