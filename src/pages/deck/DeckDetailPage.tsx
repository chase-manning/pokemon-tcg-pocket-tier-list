import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { useDecks, MatchupType } from "../../contexts/DecksContext";
import useMissing from "../../app/use-missing";
import DeckCard from "../../components/DeckCard";
import { MIN_MATCHUP_GAMES, WINRATE_THRESHOLD } from "../../app/config";
import useIsPremium from "../../app/use-is-premium";
import UserAccount from "../../components/UserAccount";
import ShareDeckCode from "../../components/ShareDeckCode";
import Tooltip from "../../components/Tooltip";
import type { MetaShareEntry } from "../../types/pipeline-data";
import arrowRight from "../../assets/arrow-right.svg";
import AdInContent from "../../ads/AdInContent";
import SeoContent from "../../components/SeoContent";
import { useMarkContentReady } from "../../ads/ContentReadyContext";
import { countById, oneSwapAlternatives } from "../../app/deck-diff";
import { deckDisplayName } from "../../app/deck-display";
import {
  AlternativeCard,
  AlternativeContainer,
  ArrowRight,
  CardContainer,
  CardImage,
  CardList,
  CardNumber,
  CardSection,
  DeckCardContainer,
  KeyStats,
  KeyStatRow,
  KeyStatValue,
  MatchupContainer,
  MatchupLabel,
  MatchupList,
  MatchupSection,
  Matchups,
  Overlay,
  PannelSection,
  StyledDeckPage,
  SubHeader,
} from "./deck-page.styles";

const DeckDetailPage = () => {
  const deckId = useParams().deckId;
  const { decks, metaShareBySlug, loading, error } = useDecks();
  const { addMissing } = useMissing();
  const { t } = useTranslation();
  const isPremium = useIsPremium();

  const deck = decks?.find((d) => d.id === deckId);
  const shareEntry: MetaShareEntry | null =
    metaShareBySlug?.[deckId ?? ""] ?? null;

  // Ready (for showing ads) only once a real deck is resolved, never on the
  // loading or "not enough cards" screens.
  useMarkContentReady(!loading && !!decks && !!deck);

  const deckMap = useMemo(
    () => new Map((decks ?? []).map((d) => [d.name, d])),
    [decks]
  );

  // Everything here depends on the resolved deck, so it is computed once per
  // deck change instead of once per render.
  const derived = useMemo(() => {
    if (!deck) return null;
    const uniqueCards = deck.bestList.cards.filter(
      (card, index, self) =>
        self.findIndex((c) => c.id === card.id) === index
    );
    const cardCounts = countById(deck.bestList.cards);
    const alternatives = oneSwapAlternatives(deck.bestList, deck.lists, 3);
    const validMatchups =
      deck.matchups?.filter(
        (m) =>
          m &&
          m.totalGames > MIN_MATCHUP_GAMES &&
          m.name !== deck.name &&
          deckMap.has(m.name)
      ) || [];
    const strongAgainst = validMatchups
      .filter((m) => m.winRate > WINRATE_THRESHOLD)
      .sort((a, b) => {
        const scoreDiff =
          deckMap.get(b.name)!.score - deckMap.get(a.name)!.score;
        return scoreDiff !== 0 ? scoreDiff : b.winRate - a.winRate;
      })
      .slice(0, 6);
    const weakAgainst = validMatchups
      .filter((m) => m.winRate <= WINRATE_THRESHOLD)
      .sort((a, b) => a.winRate - b.winRate)
      .slice(0, 6);
    return {
      uniqueCards,
      cardCounts,
      alternatives,
      strongAgainst,
      weakAgainst,
    };
  }, [deck, deckMap]);

  if (loading) return <Overlay>Loading...</Overlay>;
  if (error) return <Overlay>Error loading data: {error.message}</Overlay>;
  if (!decks) return <Overlay>Loading...</Overlay>;
  if (!derived || !deck) return <Overlay>Deck not found</Overlay>;

  const { uniqueCards, cardCounts, alternatives, strongAgainst, weakAgainst } =
    derived;

  const totalMatchup = deck.matchups?.find((m) => m.name === "Total");
  const winRatePct = totalMatchup ? Math.round(totalMatchup.winRate * 100) : null;

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
      <StyledDeckPage>
        <CardSection>
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
        </CardSection>
        <PannelSection>
          <UserAccount hideIfPremium />
          <Matchups>
            <MatchupSection>
              <SubHeader $backgroundColor="var(--c)">
                {t("deckPage.keyStats")}
              </SubHeader>
              <KeyStats>
                <KeyStatRow>
                  <span>{t("deckPage.strength")}:</span>
                  <KeyStatValue>{(deck.strength * 10).toFixed(1)}</KeyStatValue>
                  <Tooltip
                    text={t("deckPage.strengthTooltip")}
                    ariaLabel={t("deckPage.showTooltip")}
                  />
                </KeyStatRow>
                <KeyStatRow>
                  <span>{t("deckPage.popularity")}:</span>
                  <KeyStatValue>
                    {shareEntry ? Math.round(shareEntry.games14).toLocaleString() : "—"}
                  </KeyStatValue>
                  <Tooltip
                    text={t("deckPage.popularityTooltip")}
                    ariaLabel={t("deckPage.showTooltip")}
                  />
                </KeyStatRow>
                <KeyStatRow>
                  <span>{t("deckPage.winRate")}:</span>
                  <KeyStatValue>{winRatePct ?? 0}%</KeyStatValue>
                  <Tooltip
                    text={t("deckPage.winRateTooltip")}
                    ariaLabel={t("deckPage.showTooltip")}
                  />
                </KeyStatRow>
                {shareEntry && (
                  <KeyStatRow>
                    <span>{t("deckPage.metaShare")}:</span>
                    <KeyStatValue>
                      {(shareEntry.share * 100).toFixed(1)}%
                      {shareEntry.delta > 0.001
                        ? ` ▲${(shareEntry.delta * 100).toFixed(1)}`
                        : shareEntry.delta < -0.001
                          ? ` ▼${(Math.abs(shareEntry.delta) * 100).toFixed(1)}`
                          : ""}
                    </KeyStatValue>
                    <Tooltip
                      text={t("deckPage.metaShareTooltip")}
                      ariaLabel={t("deckPage.showTooltip")}
                    />
                  </KeyStatRow>
                )}
              </KeyStats>
            </MatchupSection>

            <MatchupSection>
              <SubHeader $backgroundColor="var(--c)">
                {t("deckPage.shareQrPanel", "Deck Share")}
              </SubHeader>
              <ShareDeckCode
                deckName={deck.name}
                code={deck.bestList.deckCode}
                energyCount={deck.bestList.energyIds.length}
              />
            </MatchupSection>

            {alternatives.length > 0 && (
              <MatchupSection>
                <SubHeader $backgroundColor="var(--c)">
                  {t("deckPage.alternatives")}
                </SubHeader>
                {alternatives.map(({ list, diff }) => (
                  <AlternativeContainer
                    key={`${list.score}-${list.cards.map((c) => c.id).join("-")}`}
                  >
                    <AlternativeCard src={diff.removed[0].image} />
                    <AlternativeCard src={diff.added[0].image} />
                    <ArrowRight src={arrowRight} />
                  </AlternativeContainer>
                ))}
              </MatchupSection>
            )}

            <MatchupSection>
              <SubHeader $backgroundColor="var(--e)">
                {t("deckPage.strongAgainst")}
              </SubHeader>
              <MatchupList $blur={!isPremium}>
                {strongAgainst.map((matchup: MatchupType) => (
                  <MatchupContainer key={matchup.name}>
                    <DeckCardContainer>
                      <DeckCard deck={deckMap.get(matchup.name)!} />
                    </DeckCardContainer>
                    <MatchupLabel $winRate={matchup.winRate}>
                      {`${(matchup.winRate * 100).toFixed(0)}%`}
                    </MatchupLabel>
                  </MatchupContainer>
                ))}
              </MatchupList>
            </MatchupSection>

            <MatchupSection>
              <SubHeader $backgroundColor="var(--s)">
                {t("deckPage.weakAgainst")}
              </SubHeader>
              <MatchupList $blur={!isPremium}>
                {weakAgainst.map((matchup: MatchupType) => (
                  <MatchupContainer key={matchup.name}>
                    <DeckCardContainer>
                      <DeckCard deck={deckMap.get(matchup.name)!} />
                    </DeckCardContainer>
                    <MatchupLabel $winRate={matchup.winRate}>
                      {`${(matchup.winRate * 100).toFixed(0)}%`}
                    </MatchupLabel>
                  </MatchupContainer>
                ))}
              </MatchupList>
            </MatchupSection>
          </Matchups>
        </PannelSection>
      </StyledDeckPage>

      <SeoContent>
        <h2>{displayName} Deck Guide</h2>
        <p>
          {displayName} is a top-rated Pokémon TCG Pocket deck, ranked on our{" "}
          <a href="/tier-list">tier list</a> using recent tournament data.
          {winRatePct !== null
            ? ` It currently holds a ${winRatePct}% win rate across tracked matches.`
            : ""}
        </p>
        <p>
          The recommended decklist above includes standard card counts, alternative swap options,
          and a breakdown of the deck's strengths and weaknesses. Check the matchup data to see
          which decks it counters and which ones to avoid.
        </p>
        <p>
          If you are missing cards for this build, tap them to rebuild the deck around your
          collection. You can also browse the <a href="/tier-list">tier list</a> to find other
          competitive Pokémon TCG Pocket decks.
        </p>
      </SeoContent>
    </>
  );
};

export default DeckDetailPage;
