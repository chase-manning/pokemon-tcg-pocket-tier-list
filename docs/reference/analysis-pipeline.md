# Analysis pipeline reference

The `analysis` module is the data backend for the Pokémon TCG Pocket tier list. It downloads tournament results and uses that data to score the current meta. 

## Core data flow

The pipeline downloads data from the Limitless API and assigns standardised names to the deck lists. The scoring scripts then calculate the tier rankings and write JSON files to the public directory for the frontend application.

## Data acquisition

The `download-decks.ts` script fetches data. It pulls tournament standings and pairings for events not present in `processed-tournaments.json`. The `get-tournament-decks.ts` script converts the raw Limitless API responses into `Deck` objects. It tracks wins and losses against specific opponents by matching player IDs.  

## Deck naming

The `get-deck-name.ts` module assigns names to raw card lists. It checks the cards against the `ARCHITYPES` array.   
The matching logic relies on two passes. Pass 1 checks for at least two copies of a primary card. If an archetype has secondary card options, it also requires at least two copies of one of those secondary cards. Pass 2 runs if Pass 1 finds no match. It relaxes the primary card requirement to a single copy but still requires two copies of any secondary card. Earlier entries in the array always have priority.  

## Statistical scoring

The maths prevents decks with tiny sample sizes from receiving artificially high scores.
The `calculate-card-scores.ts` file uses a Wilson-style shrinkage estimator. This lower bound is calculated as:
$$\frac{\hat{p} + \frac{z^2}{2n} - z \sqrt{\frac{\hat{p}(1-\hat{p})}{n} + \frac{z^2}{4n^2}}}{1 + \frac{z^2}{n}}$$
where $\hat{p}$ is the observed proportion, $n$ is the sample size, and $z \approx 1.96$.   
This bound applies to both win rate and popularity. Card scores are a weighted combination of these two metrics. Deck scores, calculated in `calculate-deck-score.ts`, aggregate the scores of the 20 cards in the list and blend them with the deck's overall meta popularity.  

## Configuration variables

The `settings.ts` file holds the pipeline constants.    
The `MIN_WINRATE_THRESHOLD` is `0.6`. A player must win at least 60 percent of their games in a tournament for their deck to enter the scoring pool.  
The `MIN_ARCHETYPE_QUALIFIED_GAMES` is `25`. An archetype needs 25 games in that qualified pool before it can appear in the rankings. This filters out lucky one-off tournament runs. 