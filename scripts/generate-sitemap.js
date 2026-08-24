// scripts/generate-sitemap.js
//
// Regenerates public/sitemap.xml from the current deck list plus the site's
// static routes. Run as a prebuild step so CRA copies the fresh file into
// build/ automatically — Firebase Hosting serves static files under public/
// ahead of the SPA rewrite rule (firebase.json's "**" -> /index.html), so
// this is reachable at /sitemap.xml with no hosting config change.
const fs = require("fs");
const path = require("path");

const { deckSlug } = require("./deck-slug");

const SITE_URL = "https://pocketdecks.top";
const STATIC_ROUTES = [
  "/",
  "/tier-list",
  "/cards-list",
  "/expansion-list",
  "/statistics",
  "/deck",
  "/about",
  "/privacy",
];

// Deck names are the raw compound slugs (e.g. "greninja-a1-089&oricorio-a3-066"),
// so the route contains an unescaped "&". XML requires "&" to be escaped, and
// leaving it raw makes the <loc> invalid and breaks any crawler that follows it.
const escapeXml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const buildSitemap = ({ decks, siteUrl = SITE_URL, staticRoutes = STATIC_ROUTES, lastmod }) => {
  // Trailing slashes match the canonical form stamped by the prerenderers;
  // the server 301s slashless paths, and sitemap/canonical must agree.
  const deckRoutes = decks.map((deck) => `/deck/${deckSlug(deck.name)}/`);
  const allRoutes = [
    ...staticRoutes.map((r) => (r === "/" ? "/" : `${r}/`)),
    ...deckRoutes,
  ];

  const urlEntries = allRoutes
    .map(
      (route) =>
        `  <url>\n    <loc>${escapeXml(siteUrl + route)}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;
};

const main = () => {
  const bestDecksPath = path.join(__dirname, "..", "public", "data", "best-decks.json");
  const bestDecks = JSON.parse(fs.readFileSync(bestDecksPath, "utf8"));
  const today = new Date().toISOString().split("T")[0];

  const sitemap = buildSitemap({ decks: bestDecks, lastmod: today });

  const outPath = path.join(__dirname, "..", "public", "sitemap.xml");
  fs.writeFileSync(outPath, sitemap);
  console.log(`Wrote ${STATIC_ROUTES.length + bestDecks.length} routes to ${outPath}`);
};

if (require.main === module) {
  main();
}

module.exports = { buildSitemap, escapeXml };
