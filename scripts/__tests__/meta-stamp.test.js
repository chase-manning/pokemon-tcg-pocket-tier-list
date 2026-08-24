const test = require("node:test");
const assert = require("node:assert");
const { stampHead } = require("../meta-stamp");

const TEMPLATE = `<!doctype html><html><head>
<title>Old</title>
<link rel="canonical" href="https://pocketdecks.top">
<meta name="description" content="old desc">
</head><body><div id="root"></div></body></html>`;

test("replaces title, description and hardcoded canonical", () => {
  const out = stampHead(TEMPLATE, {
    title: "New Title",
    description: "New description",
    canonical: "https://pocketdecks.top/tier-list/",
  });
  assert.ok(out.includes("<title>New Title</title>"));
  assert.ok(out.includes('content="New description"'));
  assert.ok(!out.includes('href="https://pocketdecks.top">'));
  assert.ok(out.includes('rel="canonical" href="https://pocketdecks.top/tier-list/"'));
});

test("injects JSON-LD as single script block", () => {
  const out = stampHead(TEMPLATE.replace(/<link[^>]*canonical[^>]*>/, ""), {
    canonical: "https://pocketdecks.top/",
    jsonLd: { "@type": "WebSite", name: "Top Pocket Decks" },
  });
  assert.strictEqual(out.split('type="application/ld+json"').length - 1, 1);
  assert.ok(out.includes('"@type":"WebSite"'));
});

test("throws when head closing tag missing", () => {
  assert.throws(() => stampHead("<html><body></body></html>", { canonical: "x" }));
});

const fs = require("node:fs");
const path = require("node:path");

test("HTML template ships no canonical tag", () => {
  const tpl = fs.readFileSync(
    path.join(__dirname, "..", "..", "index.html"), "utf8"
  );
  assert.ok(!tpl.includes('rel="canonical"'));
});

const { renderDeckHtml } = require("../prerender-decks");

test("deck pages get self-canonical and breadcrumb JSON-LD", () => {
  const out = renderDeckHtml(
    {
      slug: "hoopa-ex-b4-103",
      title: "Hoopa ex | Pokémon TCG Pocket Deck Stats and Matchups",
      ogImage: "https://pocketdecks.top/og/deck/hoopa-ex-b4-103.png",
      ogUrl: "https://pocketdecks.top/deck/hoopa-ex-b4-103",
      description: "Pokémon TCG Pocket deck profile for Hoopa ex.",
    },
    TEMPLATE
  );
  assert.ok(out.includes('rel="canonical" href="https://pocketdecks.top/deck/hoopa-ex-b4-103/"'));
  assert.ok(out.includes('"BreadcrumbList"'));
  assert.ok(out.includes("Hoopa ex"));
});

const { buildSitemap } = require("../generate-sitemap");

test("sitemap URLs carry trailing slashes and match canonical form", () => {
  const xml = buildSitemap({ decks: [{ name: "hoopa-ex-b4-103" }], lastmod: "2026-08-24" });
  assert.ok(xml.includes("<loc>https://pocketdecks.top/tier-list/</loc>"));
  assert.ok(xml.includes("<loc>https://pocketdecks.top/deck/hoopa-ex-b4-103/</loc>"));
  assert.ok(!xml.includes("<loc>https://pocketdecks.top/tier-list<"));
});
