// scripts/__tests__/sitemap-xml.test.js
const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");

// Runs the generator as a side effect (it reads public/data/best-decks.json
// and writes public/sitemap.xml). Coupled to real data on purpose: a hand-made
// fixture would never carry the "&" compound-slug decks that exercise the
// XML-escaping branch.
require("../generate-sitemap.js");

const sitemap = fs.readFileSync(
  path.join(__dirname, "..", "..", "public", "sitemap.xml"),
  "utf8"
);

test("sitemap is well-formed XML with balanced url/loc tags", () => {
  const urlOpen = (sitemap.match(/<url>/g) || []).length;
  const urlClose = (sitemap.match(/<\/url>/g) || []).length;
  const locOpen = (sitemap.match(/<loc>/g) || []).length;
  const locClose = (sitemap.match(/<\/loc>/g) || []).length;
  assert.strictEqual(urlOpen, urlClose);
  assert.strictEqual(locOpen, locClose);
  assert.ok(urlOpen > 8);
});

test("deck slugs with '&' are XML-escaped and no raw ampersands remain", () => {
  const rawAmp = sitemap.match(/&(?!amp;|lt;|gt;|quot;|apos;|#)/g) || [];
  assert.strictEqual(rawAmp.length, 0);
  assert.ok(sitemap.includes("&amp;"));
});
