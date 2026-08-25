// export const DEBUG: boolean = false;
export const EXPANSION_RELEASE_DATE: Date = new Date("2026-08-01");

export const NOEX: boolean = false;
export const OPPONENT_BATTLE: boolean = false;
export const OLD_MULTIPLIER: number = 1;
export const CARDS_IN_DECK: number = 20;
export const RED_CARD_MULTIPLIER: number = 0.9;
export const NOEX_PERCENT_CUTOFF: number = 0.2;
export const NO_TRAINER_PERCENT_CUTOFF: number = 0.1;
export const MIN_GAMES_IN_TOURNAMENT: number = 50;
export const MAX_DECKS_TO_ANALYZE: number = 400_000;
// Per-(player, tournament) win-rate gate: a deck only counts toward scoring
// if that player won at least this share of their games in the tournament.
// Restricts to genuinely strong performances without throwing away most of
// the data (current 0.6 ≈ 5-3 or better in 8 rounds, 4-2 in 6, etc.).
export const MIN_WINRATE_THRESHOLD: number = 0.6;
// Archetype must have at least this many qualified (post-threshold) games
// before it can be scored / ranked. Cuts out 1-2-deck flukes that would
// otherwise sit at the top of the tier list, while staying low enough that
// freshly-played archetypes early in a new expansion still appear.
export const MIN_ARCHETYPE_QUALIFIED_GAMES: number = 25;

const NOW = new Date();
const SECONDS_IN_WEEK = 7 * 24 * 60 * 60 * 1000;
const TIME_PASSED = NOW.getTime() - EXPANSION_RELEASE_DATE.getTime();
const WEEKS_LIVE = TIME_PASSED / SECONDS_IN_WEEK;
console.log("WEEKS_LIVE:", WEEKS_LIVE);

const _WINRATE_IMPORTANCE = 0.2 + WEEKS_LIVE * 0.15;
export const WINRATE_IMPORTANCE = Math.min(_WINRATE_IMPORTANCE, 0.75);
export const POPULARITY_IMPORTANCE: number = 1 - WINRATE_IMPORTANCE;
console.log("WINRATE_IMPORTANCE:", WINRATE_IMPORTANCE);

export const NEW_MULTIPLIER: number = 1 + WEEKS_LIVE / 1.5;
console.log("NEW_MULTIPLIER:", NEW_MULTIPLIER);
