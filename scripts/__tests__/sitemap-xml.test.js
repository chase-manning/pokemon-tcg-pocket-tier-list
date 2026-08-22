// scripts/__tests__/sitemap-xml.test.js
const test = require("node:test");
const assert = require("node:assert");

const { buildSitemap } = require("../generate-sitemap");

const FIXTURE_DECKS = [
  { name: "venusaur-ex-a1-004" },
  { name: "suicune-ex-a4a-020&baxcalibur-b2a-036" },
];
const LASTMOD = "2026-08-22";

test("sitemap is well-formed XML with balanced url/loc tags", () => {
  const xml = buildSitemap({ decks: FIXTURE_DECKS, lastmod: LASTMOD });
  const urlOpen = (xml.match(/<url>/g) || []).length;
  const urlClose = (xml.match(/<\/url>/g) || []).length;
  const locOpen = (xml.match(/<loc>/g) || []).length;
  const locClose = (xml.match(/<\/loc>/g) || []).length;
  assert.strictEqual(urlOpen, urlClose);
  assert.strictEqual(locOpen, locClose);
  assert.strictEqual(urlOpen, locOpen);
});

test("deck slugs with '&' are XML-escaped and no raw ampersands remain", () => {
  const xml = buildSitemap({ decks: FIXTURE_DECKS, lastmod: LASTMOD });
  const rawAmp = xml.match(/&(?!amp;|lt;|gt;|quot;|apos;|#)/g) || [];
  assert.strictEqual(rawAmp.length, 0);
  assert.ok(xml.includes("&amp;"));
});
