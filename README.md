# Pokemon TCG Pocket Deck Tier List

<img width="1677" alt="image" src="https://github.com/user-attachments/assets/76cb84ed-d0b0-44a6-a914-a3586c30449b" />

A web application that tracks and displays the current best decks for the Pokemon TCG Pocket game. This project aims to help players stay informed about the competitive meta by analysing tournament data from [Limitless](https://limitlesstcg.com/) Tournaments.

## ✨ Features

- Real-time deck tier rankings based on tournament performance
- Detailed deck statistics and win rates
- Easy-to-use interface for browsing top decks
- Regular updates based on tournament results
- Mobile-friendly design

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher (the analysis pipeline uses global `fetch`)
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

## 📚 Documentation

The site relies on a data analysis pipeline located in the `analysis/` directory. Maintainers use this pipeline to download tournaments, name decks, score them, and write the JSON files that power the frontend.     

Detailed documentation for maintaining the project is available in the `docs/` directory:
- **[Tutorial: Running a local pipeline update](docs/tutorial/running-pipeline-updates.md)**: Step-by-step instructions for fetching data and generating the frontend JSON files.
- **[How-to guide: Updating archetypes and expansions](docs/how-to/updating-archetypes-and-expansions.md)**: Instructions for modifying the archetype matcher and rolling over the pipeline for a new set release.
- **[Explanation: Statistical scoring and recency weighting](docs/explanation/statistical-scoring.md)**: The math behind the tier list, including the Wilson shrinkage estimator and recency multipliers.
- **[Reference: Analysis pipeline](docs/reference/analysis-pipeline.md)**: A technical overview of the backend data flow and scripting architecture.

## 🙌 Contributing

We welcome contributions to improve this project! Here is how you can help:

1. Fork the repository
2. Create a new branch for your feature (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

Ensure your code follows the existing style and conventions. Add appropriate tests for new features and update documentation as needed. Keep commits focused and atomic.

## 🌐 Translations

**Accessibility matters.** This project supports multiple languages. The translation system uses JSON files to manage localised content.

To contribute a new language translation:
1. Check the `locales` directory for existing translations
2. Create a new JSON file for your language following the existing format
3. Submit a Pull Request with your translation

## 💾 Data Sources

This project uses two data sources:

1. Tournament data from **[Limitless](https://limitlesstcg.com/)**, a platform for Pokemon TCG tournaments.    
The deck rankings and statistics are based on tournament participation rates, win rates, top cut appearances, and overall performance.
2. Card data from **[pokemon-tcg-pocket-cards](https://github.com/chase-manning/pokemon-tcg-pocket-cards)**, an open-source repository that provides card information for Pokemon TCG Pocket.   
_This data is used to display detailed card information and deck compositions._

## 📜 License

This project is licensed under the **[MIT License](https://mit-license.org/)**. See the **[LICENSE](LICENSE)** file for details.

## 🙏🏻 Acknowledgments

- [Limitless](https://limitlesstcg.com/) for providing tournament data
- [pokemon-tcg-pocket-cards](https://github.com/chase-manning/pokemon-tcg-pocket-cards) for maintaining the card database
- The Pokemon TCG community for their support and feedback
- All contributors who help improve this project