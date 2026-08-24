// scripts/meta-stamp.js
//
// Shared per-route <head> surgery for both prerenderers. The template ships
// without a canonical tag; anything stamped here is authoritative for the page.
const escapeXml = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const stampHead = (html, { title, description, canonical, jsonLd } = {}) => {
  if (!/<\/head>/i.test(html)) throw new Error("No </head> in template");
  let out = html;
  if (title) out = out.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeXml(title)}</title>`);
  if (description) {
    out = out.replace(/<meta[^>]+name="description"[^>]*>/gi, "");
    out = out.replace(/<\/head>/i, `  <meta name="description" content="${escapeXml(description)}">\n  </head>`);
  }
  if (canonical) {
    out = out.replace(/<link[^>]+rel="canonical"[^>]*>/gi, "");
    out = out.replace(/<\/head>/i, `  <link rel="canonical" href="${escapeXml(canonical)}">\n  </head>`);
  }
  if (jsonLd) {
    // Raw quotes are correct inside a script tag; do not XML-escape JSON.
    const block = `  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n  </head>`;
    out = out.replace(/<\/head>/i, block);
  }
  return out;
};

module.exports = { stampHead, escapeXml };
