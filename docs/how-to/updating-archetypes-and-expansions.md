# How-to guide: Updating archetypes and expansions

The meta shifts when players discover new decks or new cards are released. You maintain the tier list by updating the `ARCHITYPES` array and the expansion release date.    

## Adding a new archetype

The `get-deck-name.ts` file contains the `ARCHITYPES` array. Every ranked deck needs an entry here. Unmatched decks are dropped during the naming phase.   
Each entry requires a `primary` card and an optional array of `secondary` cards.
```TypeScript
{ primary: "Charizard ex A2b 10", secondary: ["Skeledirge B2a 18"] }
```
Card names must match the database string format using only the name, set, and number (without a count). The matcher automatically prepends `"1 "` or `"2 "` during comparison. Use `PA` or `PB` for promo sets, not `P-A` or `P-B`.

## How the matching passes work

The system reads the `ARCHITYPES` list in order. Earlier entries have priority over later entries. The matcher runs two passes to identify a deck.    

Pass 1 looks for at least two copies of the primary card. If you defined secondary cards, the deck must also contain at least two copies of one of those secondary cards.     

Pass 2 runs if Pass 1 fails. It looks for a single copy of the primary card but still requires two copies of any secondary card.

## Handling shared printings

Some decks use alternate arts or different printings of the same card. You can group these using an array for the primary or secondary slot. 
```TypeScript
const CHARIZARD = [
"Mega Charizard X ex B2b 9",
"Charizard ex A2b 10"
];
```

The matcher treats these aliases interchangeably and accumulates copies across the array entries to meet the copy requirements.  

## Preparing for a new expansion

Open `settings.ts` and update the `EXPANSION_RELEASE_DATE` when a new set drops. This variable filters out older decks and resets the recency weighting logic. This ensures the tier list only reflects the new format.  

## Troubleshooting missing decks

If a popular deck is missing from the frontend after an update, check two things.    
First, verify the decklists match your defined archetype strings.     
Second, check the `MIN_ARCHETYPE_QUALIFIED_GAMES` constant in `settings.ts`. If the deck has fewer than `25` qualified games in the Limitless dataset, the pipeline drops it for having too small of a sample size. 