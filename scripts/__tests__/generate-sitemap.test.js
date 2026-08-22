// scripts/__tests__/generate-sitemap.test.js
const test = require("node:test");
const assert = require("node:assert");

const { buildSitemap, escapeXml } = require("../generate-sitemap");

// Deck route IDs come from src/contexts/DecksContext.tsx:
//   id: oldDeck.name.toLowerCase().replace(/\s/g, "-")
// If that formula ever changes, update both this copy and scripts/deck-slug.js.
const decksContextId = (name) => name.toLowerCase().replace(/\s/g, "-");
const { deckSlug } = require("../deck-slug");

const FIXTURE_DECKS = [
  { name: "venusaur-ex-a1-004" },
  { name: "butterfree-b3b-003" },
  { name: "suicune-ex-a4a-020&baxcalibur-b2a-036" },
];
const LASTMOD = "2026-08-22";

test("shared helper matches the DecksContext route id formula", () => {
  for (const deck of FIXTURE_DECKS) {
    assert.strictEqual(deckSlug(deck.name), decksContextId(deck.name));
  }
});

test("every fixture deck gets a route, single- and double-card alike", () => {
  const xml = buildSitemap({ decks: FIXTURE_DECKS, lastmod: LASTMOD });
  for (const deck of FIXTURE_DECKS) {
    assert.ok(
      xml.includes(
        `<loc>https://pocketdecks.top/deck/${escapeXml(deck.name)}</loc>`
      ),
      `missing route for "${deck.name}"`
    );
  }
});

test("compound deck names retain '&' in the slug before XML escaping", () => {
  const xml = buildSitemap({ decks: FIXTURE_DECKS, lastmod: LASTMOD });
  assert.ok(
    xml.includes("<loc>https://pocketdecks.top/deck/suicune-ex-a4a-020&amp;baxcalibur-b2a-036</loc>"),
    "compound '&' should be escaped to &amp; inside <loc>"
  );
});

test("no raw ampersands remain anywhere in the XML output", () => {
  const xml = buildSitemap({ decks: FIXTURE_DECKS, lastmod: LASTMOD });
  assert.doesNotMatch(xml, /&(?!amp;|lt;|gt;|quot;|apos;|#)/);
});
