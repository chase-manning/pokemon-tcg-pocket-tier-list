/**
 * The single deck route-ID formula, e.g. "Greninja ex & Oricorio" ->
 * "greninja-ex-&-oricorio". Authored as ESM so src/ can import it directly;
 * the build scripts require() it, which Node supports for ESM without a
 * top-level await.
 */
export const deckSlug = (name) => name.toLowerCase().replace(/\s/g, "-");
