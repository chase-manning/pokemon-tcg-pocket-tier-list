import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useDecks } from "../../contexts/DecksContext";
import useMissing from "../../app/use-missing";
import ShareDeckCode from "../../components/ShareDeckCode";
import AdInContent from "../../ads/AdInContent";
import SeoContent from "../../components/SeoContent";
import { useMarkContentReady } from "../../ads/ContentReadyContext";
import { useQuery } from "@tanstack/react-query";
import { CardType, fetchCards } from "../../app/cards-api";
import { countById } from "../../app/deck-diff";
import {
  CardContainer,
  CardImage,
  CardList,
  CardNumber,
  CardSection,
  DeckFinderHeader,
  EmptyActions,
  EmptyMessage,
  Or,
  Overlay,
  RelativeStrength,
  Shrug,
  StyledDeckPage,
  StyledLink,
  UndoButton,
} from "./deck-page.styles";

const DeckFinderPage = () => {
  const { decks, loading, error } = useDecks();
  const { addMissing, undoMissing, canUndo, lastRemovedId } = useMissing();
  const { t } = useTranslation();
  const [bestScore, setBestScore] = useState<number | null>(null);

  // Card data for resolving a removed card's name in the empty-deck notice.
  // React Query dedupes this against the same queryKey used elsewhere, so it is
  // a cache read, not a second network fetch.
  const { data: cardsData } = useQuery<CardType[]>({
    queryKey: ["cards"],
    queryFn: fetchCards,
  });
  const cardsById = new Map(
    (cardsData ?? []).map((card) => [card.id, card] as [string, CardType])
  );
  const lastCutName = lastRemovedId
    ? (cardsById.get(lastRemovedId)?.name ?? null)
    : null;

  useEffect(() => {
    if (bestScore !== null) return;
    if (!decks || decks.length === 0) return;
    const sortedDecks = [...decks].sort((a, b) => b.score - a.score);
    setBestScore(sortedDecks[0].score);
  }, [decks, bestScore]);

  const deck = decks
    ? [...decks].sort((a, b) => b.score - a.score)[0]
    : undefined;

  // Ready (for showing ads) only once a real deck is resolved, never on the
  // loading or "not enough cards" screens.
  useMarkContentReady(!loading && !!decks && !!deck);

  if (loading) return <Overlay>Loading...</Overlay>;
  if (error) return <Overlay>Error loading data: {error.message}</Overlay>;
  if (!decks) return <Overlay>Loading...</Overlay>;

  if (!deck) {
    return (
      <Overlay>
        <Shrug>{t("deckPage.notEnoughShrug")}</Shrug>
        {lastCutName ? (
          <EmptyMessage>
            {t("deckPage.notEnoughBody", { card: lastCutName })}
          </EmptyMessage>
        ) : (
          <EmptyMessage>{t("deckPage.notEnoughCards")}</EmptyMessage>
        )}
        <EmptyActions>
          <UndoButton $disabled={!canUndo} onClick={undoMissing}>
            {t("deckPage.undo")}
          </UndoButton>
          <Or>or</Or>
          <StyledLink to="/tier-list">{t("deckPage.tryAnotherDeck")}</StyledLink>
        </EmptyActions>
      </Overlay>
    );
  }

  const relativeScore = deck && bestScore ? deck.score / bestScore : 0;
  const uniqueCards = deck.bestList.cards.filter(
    (card, index, self) => self.findIndex((c) => c.id === card.id) === index
  );
  const cardCounts = countById(deck.bestList.cards);

  const deckDisplayName =
    [deck.iconPrimary?.name, deck.iconSecondary?.name]
      .filter(Boolean)
      .join(" / ") || "This deck";

  return (
    <>
      <title>{`${deckDisplayName} ${t("deckPage.ogTitleSuffix", "Deck List | Top Pocket Decks")}`}</title>
      <meta
        name="description"
        content={`${deckDisplayName} ${t(
          "deckPage.ogDescription",
          "deck list, matchups, and win rate for Pokémon TCG Pocket. See the full card list and how it performs against the current meta."
        )}`}
      />
      <meta
        property="og:title"
        content={`${deckDisplayName} ${t("deckPage.ogBrand", "| Top Pocket Decks")}`}
      />
      <meta
        property="og:description"
        content={`${deckDisplayName} ${t(
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
      <StyledDeckPage>
        <CardSection>
          <DeckFinderHeader>{t("deckPage.deckFinderHeader")}</DeckFinderHeader>
          <RelativeStrength $relativeScore={relativeScore}>
            {t("deckPage.relativeStrength")}{" "}
            {`${(relativeScore * 100).toFixed(0)}%`}
          </RelativeStrength>
          <CardList>
            {uniqueCards.map((card) => {
              const count = cardCounts.get(card.id) ?? 0;
              return (
                <CardContainer
                  key={card.id}
                  onClick={() => {
                    if (count === 1) {
                      addMissing([card.id, card.id]);
                    } else {
                      addMissing([card.id]);
                    }
                  }}
                >
                  <CardImage src={card.image} alt={card.name} />
                  <CardNumber>{count}</CardNumber>
                </CardContainer>
              );
            })}
          </CardList>
          <AdInContent placement="deck" />
          <ShareDeckCode
            deckName={deck.name}
            code={deck.bestList.deckCode}
            energyCount={deck.bestList.energyIds.length}
          />
        </CardSection>
      </StyledDeckPage>

      <SeoContent>
        <h2>Pokémon TCG Pocket | Best Deck Finder</h2>
        <p>
          Find the strongest Pokémon TCG Pocket decks you can build with the cards you actually own.
          The Best Deck Finder starts with the top-rated list in the current meta. If you are missing a card,
          simply tap it. The tool recalculates instantly to show you the most competitive alternative
          that does not rely on that card.
        </p>
        <p>
          Keep removing missing cards until you find a decklist you can complete today. The relative
          strength indicator shows how your build compares to tournament-winning decks, helping you
          decide which cards to craft next.
        </p>
      </SeoContent>
    </>
  );
};

export default DeckFinderPage;
