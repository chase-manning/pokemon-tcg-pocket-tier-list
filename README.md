# Pokemon TCG Pocket Deck Tier List

<img width="1677" alt="image" src="https://github.com/user-attachments/assets/76cb84ed-d0b0-44a6-a914-a3586c30449b" />

A comprehensive web application that tracks and displays the current best decks for the Pokemon TCG Pocket game. This project aims to help players stay informed about the competitive meta by analyzing tournament data from [Limitless](https://limitlesstcg.com/) Tournaments.

## Features

- Real-time deck tier rankings based on tournament performance
- Detailed deck statistics and win rates
- Easy-to-use interface for browsing top decks
- Regular updates based on tournament results
- Mobile-friendly design

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/chase-mew/pokemon-tcg-pocket-tier-list.git
cd pokemon-tcg-pocket-tier-list
```

2. Install frontend dependencies at the repo root, and analysis dependencies separately:

```bash
yarn install
cd analysis && yarn install && cd ..
```

3. Start the development server:

```bash
yarn start
```

4. Open your browser and navigate to `http://localhost:3000`

## Maintaining deck data

The site is powered by a small analysis pipeline under `analysis/`. Once tournaments are downloaded from Limitless, that pipeline names decks, scores them, and writes JSON the frontend loads from `public/data/`.

### Routine refresh

From `analysis/`, set a Limitless `API_KEY`, then run:

```bash
export API_KEY=your_limitless_api_key
yarn download
yarn start
```

If `API_KEY` is missing, `yarn download` logs an error and returns instead of failing hard — check that tournaments were actually processed.

`yarn start` updates:

- `public/data/best-decks.json`
- `public/data/card-scores.json`
- `public/data/matchup-data.json`
- `src/app/last-updated.ts`

plus copies under `analysis/data/`. Card IDs are checked against [pokemon-tcg-pocket-cards](https://github.com/chase-manning/pokemon-tcg-pocket-cards); a missing card makes `yarn start` throw.

### New expansion checklist

1. Update `EXPANSION_RELEASE_DATE` in `analysis/src/settings.ts` (filters out older decks and resets recency weighting).
2. Update archetypes in `analysis/src/utils/get-deck-name.ts` — this is where most ongoing maintenance happens.

### Archetype naming

Only decks named by `get-deck-name.ts` appear in rankings. Unmatched decks are dropped in `populate-deck-names.ts`.

Names come from the ordered `ARCHITYPES` list. Each entry has a `primary` card and an optional `secondary` list of alternative pairings. A value can be one card string, or an array of related cards that count toward the same slot.

Criteria use `"Name Set Number"` (for example `"Mega Lucario ex B3 81"`). The matcher prefixes `1` or `2` when comparing against deck lists (`cardToString` stores cards as `"count Name Set Number"`).

Matching runs in two passes:

1. Walk the full list requiring at least two copies toward the primary. For each archetype, try each secondary pairing one at a time (also needing at least two) before primary-only.
2. Walk again allowing a single primary copy; any secondary pairing still needs at least two.

Alias arrays can accumulate copies across their entries. Within a pass, earlier entries win. Because the stricter pass finishes first, a later archetype with two copies can beat an earlier one that would only match on the looser pass.

If a popular deck is missing after a refresh, check whether it failed naming or simply had fewer than `MIN_ARCHETYPE_QUALIFIED_GAMES` qualified games (currently `25` in `settings.ts`). Add or adjust `ARCHITYPES` entries as needed, reuse existing named constants for shared printings, and keep list order intentional. For ambiguous or precedence-sensitive cases, add a focused test in `analysis/src/__tests__/get-deck-name.test.ts`.

## Contributing

We welcome contributions to improve this project! Here's how you can help:

1. Fork the repository
2. Create a new branch for your feature (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

### Guidelines for Contributions

- Ensure your code follows the existing style and conventions
- Add appropriate tests for new features
- Update documentation as needed
- Keep commits focused and atomic
- Provide clear descriptions in pull requests

## Translations

This project supports multiple languages to make it accessible to Pokemon TCG players worldwide. The translation system uses JSON files to manage localized content, making it easy to add new languages or update existing translations.

If you'd like to contribute a new language translation:

1. Check the `locales` directory for existing translations
2. Create a new JSON file for your language following the existing format
3. Submit a Pull Request with your translation

We welcome translations for any language! If you spot any errors in existing translations or want to add a new language, feel free to raise a PR.

## Data Sources

This project uses two main data sources:

1. Tournament data from [Limitless](https://limitlesstcg.com/), a leading platform for Pokemon TCG tournaments. The deck rankings and statistics are based on:

   - Tournament participation rates
   - Win rates
   - Top cut appearances
   - Overall performance in recent tournaments

2. Card data from [pokemon-tcg-pocket-cards](https://github.com/chase-manning/pokemon-tcg-pocket-cards), an open-source repository that provides comprehensive card information for Pokemon TCG Pocket. This data is used to display detailed card information and deck compositions.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Limitless](https://limitlesstcg.com/) for providing tournament data
- [pokemon-tcg-pocket-cards](https://github.com/chase-manning/pokemon-tcg-pocket-cards) for maintaining the card database
- The Pokemon TCG community for their support and feedback
- All contributors who help improve this project

## Contact

If you have any questions or suggestions, please feel free to open an issue in the repository.
