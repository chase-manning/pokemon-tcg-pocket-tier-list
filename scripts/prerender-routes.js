// scripts/prerender-routes.js
//
// Renders the SPA's static routes in headless Chromium and writes each result
// as <route>/index.html inside the build output, mirroring what Firebase
// Hosting's rewrite rule serves to crawlers. Replaces react-snap, which is
// unmaintained and cannot parse Vite's <script type="module"> markup.
// Deck detail pages are stamped separately by prerender-decks.js.
const fs = require("fs");
const http = require("http");
const path = require("path");
const puppeteer = require("puppeteer");

const ROOT = path.join(__dirname, "..");
// BUILD_DIR lets this run against CRA's build/ before the Vite cutover.
const DIST_DIR = process.env.BUILD_DIR
  ? path.resolve(process.env.BUILD_DIR)
  : path.join(ROOT, "dist");
const PORT = 4173;
const ORIGIN = `http://127.0.0.1:${PORT}`;
const ROUTES = [
  "/",
  "/tier-list",
  "/cards-list",
  "/expansion-list",
  "/statistics",
  "/about",
  "/privacy",
];

const MIME = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".webp": "image/webp",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain",
  ".xml": "application/xml",
  ".map": "application/json",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

// Serves the output dir with SPA fallback so each client-side route boots at
// its own URL and react-router sees the right location.
const startServer = () =>
  new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent(new URL(req.url, ORIGIN).pathname);
      let filePath = path.join(DIST_DIR, urlPath);
      if (!filePath.startsWith(DIST_DIR)) {
        res.writeHead(403);
        return res.end();
      }
      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(DIST_DIR, "index.html");
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        "Content-Type": MIME[ext] || "application/octet-stream",
      });
      fs.createReadStream(filePath).pipe(res);
    });
    server.listen(PORT, "127.0.0.1", () => resolve(server));
  });

const main = async () => {
  if (!fs.existsSync(path.join(DIST_DIR, "index.html"))) {
    console.error(`No index.html in ${DIST_DIR}; run \`yarn build\` first.`);
    process.exit(1);
  }
  const server = await startServer();
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setUserAgent("prerender-routes");
  const pageErrors = [];

  page.on("pageerror", (err) =>
    pageErrors.push(`${page.url()}: ${err.message}`)
  );

  // Third-party traffic (ads, Firebase, fonts) must neither hang the render
  // nor leak into the snapshot; this mirrors react-snap's
  // skipThirdPartyRequests.
  await page.setRequestInterception(true);
  page.on("request", (req) => {
    if (req.url().startsWith(ORIGIN)) req.continue();
    else req.abort();
  });

  for (const route of ROUTES) {
    await page.goto(`${ORIGIN}${route}`, { waitUntil: "networkidle0" });
    await page.waitForSelector("#root > *");
    // Vite stamps lazy-chunk hrefs with the preview origin while the page
    // boots; captured markup must stay root-relative.
    const html = (
      await page.evaluate(
        () => `<!doctype html>\n${document.documentElement.outerHTML}`
      )
    ).split(ORIGIN).join("");
    const outFile =
      route === "/"
        ? path.join(DIST_DIR, "index.html")
        : path.join(DIST_DIR, route.slice(1), "index.html");
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, html);
    console.log(`Prerendered ${route}`);
  }

  await browser.close();
  server.close();

  if (pageErrors.length > 0) {
    console.error(`Page errors during prerender:\n${pageErrors.join("\n")}`);
    process.exit(1);
  }
  console.log(`Prerendered ${ROUTES.length} routes into ${DIST_DIR}`);
};

main();
