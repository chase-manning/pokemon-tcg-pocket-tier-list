// Shared deck route-ID formula. Must match DecksContext.tsx:
//   id: oldDeck.name.toLowerCase().replace(/\s/g, "-")
const deckSlug = (name) => name.toLowerCase().replace(/\s/g, "-");

module.exports = { deckSlug };
