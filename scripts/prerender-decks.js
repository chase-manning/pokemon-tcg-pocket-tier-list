// scripts/prerender-decks.js
const fs = require("fs");
const path = require("path");

const SITE_URL = "https://pocketdecks.top";
const ROOT = path.join(__dirname, "..");
const BUILD_DIR = path.join(ROOT, "build");
const DATA_FILE = path.join(ROOT, "public", "data", "best-decks.json");

const isEx = (name) => /\bex$/i.test(name.trim());

const deckNameFromId = (id) => {
  const parts = id.split("-");
  const nameWords = parts.slice(0, -2);
  return nameWords
    .map((w) =>
      w.toLowerCase() === "ex" ? "ex" : w.charAt(0).toUpperCase() + w.slice(1)
    )
    .join(" ");
};

const friendlyName = (deckName) => {
  const names = deckName.split("&").map((p) => deckNameFromId(p.trim()));
  names.sort((a, b) => Number(isEx(b)) - Number(isEx(a)));
  return names.join(" & ");
};

const { deckSlug } = require("./deck-slug");

const slugFor = deckSlug;

const escapeXml = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const stripMeta = (html, attr) =>
  html.replace(
    new RegExp(`<meta[^>]+(?:property|name)="${attr}"[^>]*>`, "gi"),
    ""
  );

const renderDeckHtml = (deck, templateHtml) => {
  const { slug, title, ogImage, ogUrl, description } = deck;

  const eTitle = escapeXml(title);
  const eDesc = escapeXml(description);
  const eImage = escapeXml(ogImage);
  const eUrl = escapeXml(ogUrl);

  let html = templateHtml;
  for (const attr of [
    "og:title",
    "og:description",
    "og:image",
    "og:url",
    "twitter:title",
    "twitter:description",
    "twitter:image",
    "twitter:card",
    "description",
  ]) {
    html = stripMeta(html, attr);
  }

  const meta = [
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${eTitle}" />`,
    `<meta property="og:description" content="${eDesc}" />`,
    `<meta property="og:image" content="${eImage}" />`,
    `<meta property="og:url" content="${eUrl}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${eTitle}" />`,
    `<meta name="twitter:description" content="${eDesc}" />`,
    `<meta name="twitter:image" content="${eImage}" />`,
    `<meta name="description" content="${eDesc}" />`,
  ].join("\n    ");

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${eTitle}</title>`);
  html = html.replace(/<\/head>/i, `    ${meta}\n  </head>`);
  return html;
};

const main = () => {
  if (!fs.existsSync(BUILD_DIR)) {
    console.error("build/ not found; run `yarn build` first.");
    process.exit(1);
  }
  const template = fs.readFileSync(path.join(BUILD_DIR, "index.html"), "utf8");
  const decks = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));

  let count = 0;
  for (const deck of decks) {
    const slug = slugFor(deck.name);
    const name = friendlyName(deck.name);
    const title = `${name} | Pokémon TCG Pocket Deck Stats and Matchups`;
    const description = `Pokémon TCG Pocket deck profile for ${name}: card list, matchups, and win rate.`;
    const ogImage = `${SITE_URL}/og/deck/${slug}.png`;
    const ogUrl = `${SITE_URL}/deck/${slug}`;

    const html = renderDeckHtml(
      { slug, title, ogImage, ogUrl, description },
      template
    );
    const outDir = path.join(BUILD_DIR, "deck", slug);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, "index.html"), html);
    count += 1;
  }
  console.log(`Prerendered ${count} deck pages into build/deck/`);
};

if (require.main === module) {
  main();
}

module.exports = { renderDeckHtml, friendlyName, slugFor };
