import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import {
  useDecks,
  FullDeckType,
  MatchupType,
} from "../../contexts/DecksContext";
import useMissing from "../../app/use-missing";
import DeckCard from "../../components/DeckCard";
import { MIN_MATCHUP_GAMES, WINRATE_THRESHOLD } from "../../app/config";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useIsPremium from "../../app/use-is-premium";
import UserAccount from "../../components/UserAccount";
import { CardType, fetchCards } from "../../app/cards-api";
import arrowRight from "../../assets/arrow-right.svg";
import AdInContent from "../../ads/AdInContent";
import SeoContent from "../../components/SeoContent";
import { useMarkContentReady } from "../../ads/ContentReadyContext";
import { Helmet } from "react-helmet-async";

const StyledDeckPage = styled.div`
  width: 100%;
  min-height: 100dvh;
  display: flex;
  padding: 3rem;
  gap: 3rem;

  @media (max-width: 900px) {
    padding: 2.4rem;
    flex-direction: column;
    align-items: center;
  }
`;

const CardSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.4rem;
  flex: 1;
  width: calc(100% - 35rem - 3rem);

  @media (max-width: 900px) {
    width: 100%;
  }
`;

const PannelSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.4rem;
  width: 35rem;

  @media (max-width: 900px) {
    width: 100%;
  }
`;

const DeckFinderHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 8rem;
  background: var(--e);
  color: var(--bg);
  font-size: 3.2rem;
  font-weight: 500;
  text-align: center;
  padding: 0 4rem;

  @media (max-width: 900px) {
    font-size: 2.4rem;
    height: auto;
    padding: 2rem;
  }
`;

const RelativeStrength = styled.div<{ $relativeScore: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 8rem;
  background: ${(props) => {
    const colors = [
      "var(--s)",
      "var(--a)",
      "var(--b)",
      "var(--c)",
      "var(--d)",
      "var(--e)",
    ];
    const index = Math.floor(props.$relativeScore * (colors.length - 1));
    return colors[index];
  }};
  color: var(--bg);
  font-size: 3.2rem;
  font-weight: 500;
  text-align: center;
  padding: 0 4rem;
  margin-bottom: 2rem;

  @media (max-width: 900px) {
    font-size: 2.4rem;
    height: auto;
    padding: 2rem;
  }
`;

const CardList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
  gap: 2.4rem;
  width: 100%;
  max-width: 160rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const CardContainer = styled.button`
  position: relative;
  width: 100%;
  cursor: pointer;
`;

const CardImage = styled.img`
  width: 100%;
  aspect-ratio: 63 / 88;
  display: block;
`;

const CardNumber = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  background: var(--s);
  color: var(--bg);
  height: 4rem;
  width: 4rem;
  transform: translate(30%, 30%);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.8rem;
  font-weight: 500;
  border-radius: 50%;

  @media (max-width: 900px) {
    height: 3rem;
    width: 3rem;
    font-size: 2rem;
  }
`;

const Overlay = styled.div`
  height: 100dvh;
  width: 100dvw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2.4rem;
  font-size: 2rem;
  font-weight: 500;
`;

const Shrug = styled.div`
  font-size: 5rem;
  font-weight: 400;
  color: var(--main);
  line-height: 1.2;
  max-width: 60rem;
  text-align: center;

  @media (max-width: 900px) {
    font-size: 3.4rem;
  }
`;

const EmptyMessage = styled.p`
  font-size: 2rem;
  font-weight: 500;
  max-width: 60rem;
  text-align: center;
  line-height: 1.6;
  color: var(--main);

  strong,
  em {
    font-size: inherit;
  }
`;

const EmptyActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1.6rem;
`;

const Or = styled.span`
  font-size: 1.8rem;
  color: rgba(255, 255, 255, 0.6);
`;

const UndoButton = styled.button<{ $disabled?: boolean }>`
  font-size: 1.8rem;
  font-weight: 500;
  color: var(--main);
  background: transparent;
  border: 1px solid var(--main);
  border-radius: 1.2rem;
  padding: 1rem 2.4rem;
  cursor: ${(props) => (props.$disabled ? "default" : "pointer")};
  opacity: ${(props) => (props.$disabled ? 0.4 : 1)};
  transition: opacity 0.2s ease;

  &:focus-visible {
    outline: 2px solid var(--main);
    outline-offset: 2px;
  }

  &:hover:not(:disabled) {
    opacity: 0.8;
  }
`;

const StyledLink = styled(Link)`
  color: var(--main);
  font-weight: 500;
  font-size: 2rem;
  margin-left: 5px;
  text-decoration: underline;
`;

const Matchups = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 2.4rem;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const SubHeader = styled.div<{ $backgroundColor: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 1rem 0;
  background: ${(props) => props.$backgroundColor};
  color: var(--bg);
  font-size: 2.8rem;
  font-weight: 500;
  opacity: 0.9;
`;

const MatchupSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  gap: 2.4rem;
  height: auto;

  @media (max-width: 900px) {
    width: 100%;
  }
`;

const MatchupList = styled.div<{ $blur?: boolean }>`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  gap: 1.2rem;
  flex: 1;
  width: 100%;
  filter: ${(props) => (props.$blur ? "blur(10px) saturate(1.2)" : "none")};

  @media (max-width: 900px) {
    grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
  }
`;

const MatchupContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  gap: 1.2rem;
`;

const DeckCardContainer = styled.div`
  position: relative;
  height: 10rem;
  aspect-ratio: 1 / 1;

  @media (max-width: 900px) {
    height: 12rem;
  }
`;

const MatchupLabel = styled.div<{ $winRate: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  font-size: 2.4rem;
  font-weight: 500;
  color: ${(props) =>
      props.$winRate > WINRATE_THRESHOLD ? "var(--e)" : "var(--s)"};

  @media (max-width: 900px) {
    font-size: 2rem;
  }
`;

const KeyStats = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

const KeyStat = styled.div`
  font-size: 2.4rem;
  font-weight: 400;
`;

const KeyStatValue = styled.span`
  font-size: 2.4rem;
  font-weight: 500;
`;

const AlternativeContainer = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 4.8rem;
`;

const AlternativeCard = styled.img`
  width: calc(50% - 2.4rem);
  aspect-ratio: 63 / 88;
  display: block;
`;

const ArrowRight = styled.img`
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);
  height: 5rem;
`;

const DeckPage = () => {
  const deckId = useParams().deckId;
    const { decks, loading, error } = useDecks();
    const { addMissing, undoMissing, canUndo, lastRemovedId } = useMissing();
    const { t } = useTranslation();
    const [bestScore, setBestScore] = useState<number | null>(null);
    const isPremium = useIsPremium();

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
    const lastCutName = lastRemovedId ? (cardsById.get(lastRemovedId)?.name ?? null) : null;

  useEffect(() => {
      if (deckId) return;
      if (bestScore !== null) return;
      if (!decks || decks.length === 0) return;
      const sortedDecks = [...decks].sort((a, b) => b.score - a.score);
      const bestDeck = sortedDecks[0];
      setBestScore(bestDeck.score);
    }, [deckId, decks, bestScore]);

    let deck: FullDeckType | undefined = undefined;
    if (decks) {
      if (deckId) {
        deck = decks.find((d) => d.id === deckId);
      } else {
        const sortedDecks = [...decks].sort((a, b) => b.score - a.score);
        deck = sortedDecks[0];
      }
    }

  // Ready (for showing ads) only once a real deck is resolved, never on the
  // loading or "not enough cards" screens.
  useMarkContentReady(!loading && !!decks && !!deck);

    if (loading) return <Overlay>Loading...</Overlay>;
    if (error) return <Overlay>Error loading data: {error.message}</Overlay>;
    if (!decks) return <Overlay>Loading...</Overlay>;

    const relativeScore = deck && bestScore ? deck.score / bestScore : 0;

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
                            <UndoButton
                              $disabled={!canUndo}
                              onClick={undoMissing}
                            >
                              {t("deckPage.undo")}
                            </UndoButton>
                            <Or>or</Or>
                            <StyledLink to="/tier-list">{t("deckPage.tryAnotherDeck")}</StyledLink>
                          </EmptyActions>
          </Overlay>
      );
    }

  const uniqueCards = deck.bestList.cards.filter(
      (card, index, self) => self.findIndex((c) => c.id === card.id) === index
  );

  const isDeckFinderMode = !deckId;

  const listsWithOneCardDifferenceFromBestList = deck.lists.filter((list) => {
    let differenceCount = 0;

    const uniqueListCards = list.cards.filter(
        (card, index, self) => self.findIndex((c) => c.id === card.id) === index
    );

    const uniqueTotalCards = new Set([...uniqueListCards, ...uniqueCards]);

    for (const card of uniqueTotalCards) {
      const thisListCount = list.cards.filter((c) => c.id === card.id).length;
      const bestListCount = deck!.bestList.cards.filter((c) => c.id === card.id).length;

      if (thisListCount !== bestListCount) {
        if (differenceCount === 2) return false;
        differenceCount++;
      }
    }

    return differenceCount === 2;
  });

  const sortedAlternatives = listsWithOneCardDifferenceFromBestList
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

  const totalMatchup = deck.matchups?.find((m) => m.name === "Total");
  const winRatePct = totalMatchup ? Math.round(totalMatchup.winRate * 100) : null;

  const deckMap = new Map(decks.map((d) => [d.name, d]));

  const validMatchups =
      deck.matchups?.filter(
          (m) =>
              m &&
              m.totalGames > MIN_MATCHUP_GAMES &&
              m.name !== deck?.name &&
              deckMap.has(m.name)
      ) || [];

  const strongAgainst = validMatchups
      .filter((m) => m.winRate > WINRATE_THRESHOLD)
      .sort((a, b) => {
        const scoreDiff = deckMap.get(b.name)!.score - deckMap.get(a.name)!.score;
        return scoreDiff !== 0 ? scoreDiff : b.winRate - a.winRate;
      })
      .slice(0, 6);

  const weakAgainst = validMatchups
      .filter((m) => m.winRate <= WINRATE_THRESHOLD)
      .sort((a, b) => a.winRate - b.winRate)
      .slice(0, 6);

  const deckDisplayName =
    [deck.iconPrimary?.name, deck.iconSecondary?.name]
      .filter(Boolean)
      .join(" / ") || "This deck";

  return (
      <>
        <Helmet>
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
        </Helmet>
        <StyledDeckPage>
          <CardSection>
            {isDeckFinderMode && (
                <>
                  <DeckFinderHeader>
                    {t("deckPage.deckFinderHeader")}
                  </DeckFinderHeader>
                  <RelativeStrength $relativeScore={relativeScore}>
                    {t("deckPage.relativeStrength")}{" "}
                    {`${(relativeScore * 100).toFixed(0)}%`}
                  </RelativeStrength>
                </>
            )}
            <CardList>
              {uniqueCards.map((card) => (
                  <CardContainer
                      key={card.id}
                      onClick={() => {
                        const count = deck!.bestList.cards.filter(
                            (c) => c.id === card.id
                        ).length;
                        if (count === 1) {
                          addMissing([card.id, card.id]);
                        } else {
                          addMissing([card.id]);
                        }
                      }}
                  >
                    <CardImage src={card.image} alt={card.name} />
                    <CardNumber>
                      {deck!.bestList.cards.filter((c) => c.id === card.id).length}
                    </CardNumber>
                  </CardContainer>
              ))}
            </CardList>
            <AdInContent placement="deck" />
          </CardSection>
          {!isDeckFinderMode && (
              <PannelSection>
                <UserAccount hideIfPremium />
                <Matchups>
                  <MatchupSection>
                    <SubHeader $backgroundColor="var(--c)">
                      {t("deckPage.keyStats")}
                    </SubHeader>
                    <KeyStats>
                      <KeyStat>
                        {t("deckPage.strength")}:{" "}
                        <KeyStatValue>{(deck.strength * 10).toFixed(1)}</KeyStatValue>
                      </KeyStat>
                      <KeyStat>
                        {t("deckPage.popularity")}:{" "}
                        <KeyStatValue>
                          {(deck.popularity * 10).toFixed(1)}
                        </KeyStatValue>
                      </KeyStat>
                      <KeyStat>
                        {t("deckPage.winRate")}:{" "}
                        <KeyStatValue>{winRatePct ?? 0}%</KeyStatValue>
                      </KeyStat>
                    </KeyStats>
                  </MatchupSection>

                  {sortedAlternatives.length > 0 && (
                      <MatchupSection>
                        <SubHeader $backgroundColor="var(--c)">
                          {t("deckPage.alternatives")}
                        </SubHeader>
                        {sortedAlternatives.map((list) => {
                          const missingCards = [];
                          const newCards = [];

                          const uniqueListCards = list.cards.filter(
                              (card, index, self) =>
                                  self.findIndex((c) => c.id === card.id) === index
                          );

                          const uniqueTotalCards = new Set([
                            ...uniqueListCards,
                            ...uniqueCards,
                          ]);

                          for (const card of uniqueTotalCards) {
                            const thisListCount = list.cards.filter((c) => c.id === card.id).length;
                            const bestListCount = deck!.bestList.cards.filter((c) => c.id === card.id).length;

                            if (thisListCount === bestListCount) continue;

                            if (thisListCount < bestListCount) {
                              missingCards.push(card);
                            } else {
                              newCards.push(card);
                            }
                          }

                          if (missingCards.length !== 1 || newCards.length !== 1) {
                            return null;
                          }

                          return (
                                                        <AlternativeContainer key={`${list.score}-${list.cards.map((c) => c.id).join("-")}`}>
                                                          <AlternativeCard src={missingCards[0].image} />
                                                          <AlternativeCard src={newCards[0].image} />
                                                          <ArrowRight src={arrowRight} />
                                                        </AlternativeContainer>
                                                    );
                        })}
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
          )}
        </StyledDeckPage>

        {isDeckFinderMode ? (
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
        ) : (
            <SeoContent>
              <h2>{deckDisplayName} Deck Guide</h2>
              <p>
                {deckDisplayName} is a top-rated Pokémon TCG Pocket deck, ranked on our{" "}
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
        )}
      </>
  );
};

export default DeckPage;