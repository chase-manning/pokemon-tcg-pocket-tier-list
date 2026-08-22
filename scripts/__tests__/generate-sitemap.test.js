// scripts/__tests__/generate-sitemap.test.js
const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");

const SITE_URL = "https://pocketdecks.top";

// Canonical deck-route id formula, copied verbatim from
// src/contexts/DecksContext.tsx: `id: oldDeck.name.toLowerCase().replace(/\s/g, "-")`.
// The sitemap generator must produce exactly this slug for each deck, or the
// sitemap <loc> won't match the client route `/deck/<id>` and crawlers hit 404s.
// Unlike a duplicated-and-compared copy, this compares the generator's REAL
// output against the canonical formula, so a change to the generator's slug
// logic fails the test instead of silently staying in sync with itself.
const decksContextSlug = (name) => name.toLowerCase().replace(/\s/g, "-");

require("../generate-sitemap.js");

const sitemap = fs.readFileSync(
  path.join(__dirname, "..", "..", "public", "sitemap.xml"),
  "utf8"
);
const deckNames = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "..", "..", "public", "data", "best-decks.json"),
    "utf8"
  )
).map((d) => d.name);

const expectedLoc = (name) =>
  `${SITE_URL}/deck/${decksContextSlug(name)}`.replace(/&/g, "&amp;");

test("every deck's sitemap slug matches the DecksContext route id formula", () => {
  for (const name of deckNames) {
    assert.ok(
      sitemap.includes(`<loc>${expectedLoc(name)}</loc>`),
      `sitemap missing deck route for "${name}" (expected slug "${decksContextSlug(name)}")`
    );
  }
});

test("compound deck names retain '&' in the slug before XML escaping", () => {
  const compound = deckNames.find((n) => n.includes("&"));
  assert.ok(compound, "expected at least one compound deck name with '&'");
  assert.ok(
    decksContextSlug(compound).includes("&"),
    "compound slug should retain '&' (it is escaped to &amp; in the XML only)"
  );
});
