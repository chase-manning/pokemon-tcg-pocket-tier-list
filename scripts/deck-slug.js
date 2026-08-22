// Shared deck route-ID formula. Must match src/app/deck-slug.ts.
const deckSlug = (name) => name.toLowerCase().replace(/\s/g, "-");

module.exports = { deckSlug };
