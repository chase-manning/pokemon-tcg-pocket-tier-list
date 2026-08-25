# Explanation: Advertising, premium and consent

The site is free to use, and its costs are covered two ways: advertising for most visitors, and a paid Premium tier for people who want the ads gone and the data limits lifted. Three subsystems cooperate to make that work: the ads layer under `src/ads/`, the premium check in `src/app/use-is-premium.ts` and `src/components/Premium.tsx`, and the consent layer under `src/consent/`. This page explains why each piece exists and how they interact. The routing and provider stack around them is covered in the frontend architecture reference.

## The two gates

Premium restricts two things.

The first is content volume. On `/statistics`, a free visitor sees only the ten highest-scoring decks in the matchup matrix: `StatisticsPage.tsx` slices `sortedDecks` to 10 entries unless `isPremium` is true. The trend chart defaults to a 14-day window, and the All Time toggle is locked for free users, marked with a padlock and deaf to clicks. Subscribers get the full matrix and the complete history.

The second is advertising itself. Free visitors see Google AdSense units: a sticky anchor bar along the bottom of every page, plus in-content units on individual routes. Premium users see none of it. Both gates hang off one hook, `useAdsState()`, which combines the master switch `ADS_ENABLED` in `adsConfig.ts`, premium status, marketing consent and page readiness into a single `showAds` decision. Placement components never make these calls themselves, so there is exactly one place where ad policy lives.

## How premium status resolves

`useIsPremium()` returns three states. It is `null` while authentication is loading or the subscription query is in flight, then resolves to `true` or `false`. A signed-out visitor resolves to `false` immediately. A signed-in visitor is checked against the Firestore Stripe payments extension for subscriptions whose status is `active`, `trialing` or `past_due`.

That status list is load-bearing. New signups start on a 7-day free trial, and during the trial their subscription status is `trialing`, not `active`. Filtering on `active` alone would make trial users look like non-subscribers: the upsell would reappear, and following it sends them back through Stripe checkout, which is how some users ended up with duplicate subscriptions. `past_due` keeps access running through Stripe's payment-retry grace period instead of cutting someone off over one failed renewal.

Downstream, `null` means "unknown", not "no". Ads stay hidden until premium status has resolved, so a subscriber never watches an ad appear and then vanish. The same applies to the gated statistics views and to the Premium panel itself, which renders nothing while status is unknown.

## Why signups are closed but the panel stays open

During the handover to a new maintainer, new Premium signups are paused. This is enforced at two levels on purpose.

In the app, `Premium.tsx` offers no purchase path. Its popup is a wind-down panel driven by the `premium.windDown.*` locale keys: it tells existing subscribers that their subscription stays active and keeps renewing until cancelled, links to the Stripe billing portal through `MANAGE_SUBSCRIPTION_URL` in `src/app/constants.ts`, and gives a contact address for refunds. The panel opens from the premium icon in the account menu for subscribers, and from the "Remove ads" link in the anchor bar for everyone else.

At the payment level, the comment above `MANAGE_SUBSCRIPTION_URL` records the rule that makes the pause real: every signup Price in Stripe, current and legacy, must be archived, because the Firebase extension can create a checkout session from any known price ID. Hiding the button in the app alone would leave the door open for anyone holding an old price ID.

The earlier announcement of the transition was handled by a dedicated banner component. That component has been removed from the app and archived at `docs/archive/FarewellNotice.tsx`; it survives for reference only and is mounted nowhere.

## The ads layer

Placements are declared once in `adsConfig.ts` under `ADSENSE_SLOTS`: `anchor`, `landing`, `tierList`, `deck` and `statistics`. Every position renders through `AdSlot`, which reads the config and the shared ad state. Swapping ad networks would touch `adsense.ts`, `AdSlot` and the config file, not the pages that host the units.

Loading is lazy and consent-first. `ensureAdSenseScript()` injects the AdSense loader the first time a real slot renders, and since a slot only renders after `showAds` turns true, the script never loads before the visitor has consented to marketing. In production the consent requirement comes straight from `useConsentManager().has("marketing")`; development skips it and shows a labelled dashed placeholder instead, so layout work needs no third-party scripts. Once loaded, each `<ins>` element is keyed by route pathname, so client-side navigation remounts it and requests a fresh ad, mirroring a normal pageview for AdSense's benefit. One gap is deliberate: the `statistics` slot ID is still an empty string, so that position falls back to the placeholder even in production until an ad unit ID is filled in.

Ad-blocker detection is a single probe. `useAdBlocked()` injects a throwaway script element pointing at the AdSense URL; if the element fires `error`, a blocker is present. The hook stays `false` until the probe settles, and a 2.5-second timeout counts as not blocked, so the UI never flashes a false positive on a slow connection. `AdBlockerNotice` consumes the result to show its message near the top of the layout.

The ContentReady handshake exists because AdSense policy forbids ads on screens without publisher content, and an SPA spends real time on screens that have none: loading spinners, error states, empty results. Each page calls `useMarkContentReady()` once meaningful content has rendered, passing `false` again whenever it drops back to a loading or error view. `ContentReadyContext` stores the path that marked itself ready and compares it against the current pathname, so navigation resets readiness automatically without an effect that could race the next page's own marking. Pages that never become ready simply never show ads, and global units such as the anchor bar disappear while the current route sits in a content-less state. Slots also reserve their height up front (fixed minimums in `adsConfig.ts`, published to the page as the `--ad-anchor-h` CSS variable for the anchor), which keeps the layout from jumping when an ad fills.

## The consent layer

Consent runs on c15t. `ConsentProvider` in `src/consent/` wraps the app in `ConsentManagerProvider` (offline mode) and registers the same Google tag twice, once under the `measurement` category and once under `marketing`. c15t injects gtag with Consent Mode v2 denied by default and updates on the visitor's choice, so accepting marketing is what unlocks personalised ad signals. AdSense itself loads through the separate path described above, so the premium and readiness gates keep applying even after consent is granted.

The styling story is a cascade dispute. c15t ships its component styles inside a CSS `@layer`, and unlayered styles beat layered ones at any specificity. The app's own globals, set by styled-components at the document level, are unlayered: a 10px root font size, `button { background: none }`, `* { padding: 0 }`. Left alone, the layered c15t defaults lose every collision and the banner renders cramped and flattened. There are two responses. `consent-theme.ts` restyles the banner through c15t's supported tokens and slots wherever possible: colours, typography, spacing, button modes, the glass card background. Whatever tokens cannot express falls to `consent-overrides.css`, which is deliberately left unlayered so it wins the same cascade fight the app globals started. It targets c15t's stable class prefixes (`c15t-ui-card`, `c15t-ui-button`, and so on) and `data-testid` attributes rather than incidental selectors, because those hooks survive upstream changes. The file's own header sets the boundary: colour, fill and button treatment belong in the theme file, overrides only handle what tokens genuinely cannot.

One override is worth knowing about beyond looks: the banner is fixed to the bottom of the viewport, the same strip the sticky anchor bar occupies on mobile, and it is portaled to `document.body` while the anchor lives inside `#root`. The override sheet lifts the banner by `--ad-anchor-h` and pins its z-index to the maximum, so its buttons never hide under the ad bar and stacking-context comparisons between the two trees cannot bury it.

Finally, the prerender guard. The postbuild step renders routes to static HTML with a browser whose user agent is `prerender-routes`. During that run, c15t portals the banner to `document.body`, outside the `#root` mount point. The live client boots with `createRoot`, which does not adopt pre-existing DOM, so a banner baked into the static HTML would survive as a second, handler-less copy frozen on screen; for a returning visitor who had already stored a consent choice, it would be the only copy, and Accept and Reject would silently do nothing. `ConsentProvider` checks the user agent and renders no banner at all while the prerenderer drives the page, keeping dead markup out of the static HTML. Real visitors still get the banner from the live client.

## Related

[Frontend architecture](../reference/frontend-architecture.md#provider-stack)
describes the provider stack these layers wrap around.
