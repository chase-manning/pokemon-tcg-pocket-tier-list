import { useTranslation } from "react-i18next";
import { deckDisplayName, type NamedDeck } from "../../app/deck-display";

const DeckHeadTags = ({ deck }: { deck: NamedDeck & { id: string } }) => {
  const { t } = useTranslation();
  const displayName = deckDisplayName(deck);

  return (
    <>
      <title>{`${displayName} ${t("deckPage.ogTitleSuffix", "Deck List | Top Pocket Decks")}`}</title>
      <meta
        name="description"
        content={`${displayName} ${t(
          "deckPage.ogDescription",
          "deck list, matchups, and win rate for Pokémon TCG Pocket. See the full card list and how it performs against the current meta."
        )}`}
      />
      <meta
        property="og:title"
        content={`${displayName} ${t("deckPage.ogBrand", "| Top Pocket Decks")}`}
      />
      <meta
        property="og:description"
        content={`${displayName} ${t(
          "deckPage.ogDescriptionShort",
          "deck list, matchups, and win rate for Pokémon TCG Pocket."
        )}`}
      />
      <meta
        property="og:image"
        content={`https://pocketdecks.top/og/deck/${deck.id}.png`}
      />
      <meta
        property="og:url"
        content={`https://pocketdecks.top/deck/${deck.id}`}
      />
    </>
  );
};

export default DeckHeadTags;
