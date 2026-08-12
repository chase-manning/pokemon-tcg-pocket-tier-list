import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useDecks } from "../../contexts/DecksContext";
import DeckCard from "../../components/DeckCard";
import useFilters from "../../app/use-filters";
import useIsPremium from "../../app/use-is-premium";
import { getSortValue } from "../../app/sorting-helper";
import { buildTiers } from "../../app/tier-helper";
import UserAccount from "../../components/UserAccount";
import { SortBy } from "../../components/FilterContext";
import LastUpdated from "../../components/LastUpdated";
import Dropdown from "../../components/Dropdown";
import SeoContent from "../../components/SeoContent";
import AdInContent from "../../ads/AdInContent";
import { useMarkContentReady } from "../../ads/ContentReadyContext";
import React, { type ChangeEvent } from "react";

const StyledTierListPage = styled.div`
  width: 100%;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  @media (max-width: 900px) {
    height: auto;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  position: absolute;
  top: 2rem;
  right: 2rem;
  gap: 1.5rem;
  z-index: 10;

  @media (max-width: 900px) {
    position: relative;
    top: 0;
    right: 0;
    margin: 2rem;
    width: calc(100% - 4rem);
    justify-content: space-between;
    align-items: center;
  }
`;

const DeckAmountContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  font-size: 1.4rem;
  color: var(--main);
`;

const DeckAmountSelect = styled(Dropdown)`
  min-width: 8rem;
`;

const IncludeExContainer = styled.label`
  display: flex;
  align-items: center;
  font-size: 1.4rem;
  color: var(--main);
  cursor: pointer;
  user-select: none;
  gap: 0.8rem;
`;

const IncludeExCheckbox = styled.input.attrs({ type: "checkbox" })`
  width: 1.6rem;
  height: 1.6rem;
  accent-color: var(--e);
  background: var(--bg);
  border: 2px solid var(--main);
  border-radius: 0.3rem;
  margin-left: 0.8rem;
  cursor: pointer;
`;

const DeckRow = styled.div`
  width: 100%;
  display: flex;
  flex: 1;
  border-bottom: 0.4rem solid var(--border);

  /* Gradient on right side */
  @media (min-width: 900px) {
    position: relative;
    &::after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      width: 100px;
      height: 100%;
      background: linear-gradient(to right, rgba(255, 255, 255, 0), var(--bg));
    }
  }

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const RowHeader = styled.div<{ $backgroundColor: string }>`
  height: 100%;
  aspect-ratio: 1 / 1;
  background: ${(props) => props.$backgroundColor};
  color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3.3rem;
  font-weight: 400;

  @media (max-width: 900px) {
    width: 100%;
    height: 8rem;
  }
`;

const RowContent = styled.div`
  height: 100%;
  flex: 1;
  padding: 1.5rem 2rem;
  display: flex;
  gap: 2rem;
  width: 100%;

  @media (min-width: 900px) {
    overflow-x: auto;
  }

  @media (max-width: 900px) {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    padding: 2rem;
  }
`;

const Loading = styled.div`
  height: 100dvh;
  width: 100dvw;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-weight: 500;
`;

const ENERGY_TYPES = [
  "Grass",
  "Fire",
  "Water",
  "Lightning",
  "Psychic",
  "Fighting",
  "Darkness",
  "Metal",
  "Dragon",
  "Colorless",
];

const LandingPage = () => {
  const { decks, loading } = useDecks();
  const {
    energy,
    setEnergy,
    includeEx,
    setIncludeEx,
    deckAmount,
    setDeckAmount,
    sortBy,
    setSortBy,
    latestExpansionCards,
    setLatestExpansionCards,
  } = useFilters();
  const { t } = useTranslation();
  const isPremium = useIsPremium();

  const ready = !loading && !!decks && decks.length > 0;
  useMarkContentReady(ready);
  const renderTiers = () => {
    if (loading || !decks) return <Loading>Loading...</Loading>;
    if (decks.length === 0) return <Loading>No decks found</Loading>;

    const tiers = buildTiers(decks, (d) => getSortValue(d, sortBy));

    return (
        <>
          {tiers.map((tier) => (
              <DeckRow key={tier.label}>
                <RowHeader $backgroundColor={tier.color}>{tier.label}</RowHeader>
                <RowContent>
                  {tier.data.map((deck) => (
                      <DeckCard key={deck.id} deck={deck} />
                  ))}
                </RowContent>
              </DeckRow>
          ))}
          <AdInContent placement="tierList" mobileOnly />
          <LastUpdated />
        </>
    );
  };

  return (
    <>
      <StyledTierListPage>
        <FilterContainer>
          <UserAccount />
          {isPremium && (
            <>
              <Dropdown
                value={energy ?? ""}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  const value = e.target.value;
                  setEnergy(value === "" ? null : value);
                }}
              >
                <option value="">{t("energyDropdown.all")}</option>
                {ENERGY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {t(`energyDropdown.${type}`)}
                  </option>
                ))}
              </Dropdown>
              <IncludeExContainer>
                {t("filter.includeEx")}
                <IncludeExCheckbox
                  type="checkbox"
                  checked={includeEx}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIncludeEx(e.target.checked)}
                />
              </IncludeExContainer>
              <DeckAmountContainer>
                {t("filter.deckAmount")}
                <DeckAmountSelect
                  value={deckAmount}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDeckAmount(Number(e.target.value))}
                >
                  {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((amount) => (
                    <option key={amount} value={amount}>
                      {amount}
                    </option>
                  ))}
                </DeckAmountSelect>
              </DeckAmountContainer>
              <DeckAmountContainer>
                {t("filter.sortBy")}
                <DeckAmountSelect
                  value={sortBy}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value as SortBy)}
                >
                  {[SortBy.SCORE, SortBy.POPULARITY, SortBy.STRENGTH].map(
                    (sortByOption) => (
                      <option key={sortByOption} value={sortByOption}>
                        {t(`filter.${sortByOption}`)}
                      </option>
                    )
                  )}
                </DeckAmountSelect>
              </DeckAmountContainer>
              <DeckAmountContainer>
                {t("filter.latestExpansionCards")}
                <DeckAmountSelect
                  value={latestExpansionCards ?? ""}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    const value = e.target.value;
                    setLatestExpansionCards(value === "" ? null : Number(value));
                  }}
                >
                  <option value="">{t("filter.latestExpansionCardsAny")}</option>
                  {[2, 6, 12].map((count) => (
                    <option key={count} value={count}>
                      {count}
                    </option>
                  ))}
                </DeckAmountSelect>
              </DeckAmountContainer>
            </>
          )}
        </FilterContainer>

        {renderTiers()}
      </StyledTierListPage>

      <SeoContent>
        <h2>About the Pokémon TCG Pocket tier list</h2>
        <p>
          This tier list ranks the best decks in Pokémon TCG Pocket using real
          competitive results rather than opinion. Every deck is scored from
          tournament data collected from{" "}
          <a
            href="https://limitlesstcg.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Limitless
          </a>{" "}
          events, then sorted into tiers from S (strongest) down to E. The list
          is refreshed regularly so it reflects the current metagame as new
          expansions and balance changes shake things up.
        </p>

        <h3>How the rankings are calculated</h3>
        <p>
          Each deck's placement is based on a blend of how often it is played,
          how well it performs, and its results against the rest of the field.
          We aggregate decklists from recent tournaments, group them by
          archetype, and calculate an overall score along with separate
          popularity and strength ratings. Decks with a higher win rate and
          strong showings in top cuts rise toward the S and A tiers, while
          fringe or underperforming decks settle into the lower tiers.
        </p>

        <h3>What the tiers mean</h3>
        <ul>
          <li>
            <strong>S tier</strong> — the strongest, most consistent decks in
            the current meta. Safe, powerful choices for ranked play.
          </li>
          <li>
            <strong>A and B tier</strong> — highly competitive decks that can win
            events in the right hands or with favourable matchups.
          </li>
          <li>
            <strong>C and D tier</strong> — viable but less consistent; often
            budget-friendly or matchup-dependent options.
          </li>
          <li>
            <strong>E tier</strong> — niche or experimental decks that struggle
            against the top of the meta.
          </li>
        </ul>

        <h3>Building the best deck you can</h3>
        <p>
          Don't own every card yet? Open any deck to see its full decklist and
          card-for-card alternatives, or use the Best Deck Finder to mark the
          cards you're missing and instantly surface the strongest deck you can
          actually build with your collection. You can also filter by energy
          type and rank decks by popularity or raw strength to find the style
          that suits you.
        </p>

        <h3>How often is the tier list updated?</h3>
        <p>
          The tier list updates as fresh tournament results come in, with the
          fastest updates available to Premium members. The "last updated" date
          shown above the rankings always reflects the most recent refresh.
        </p>
      </SeoContent>
    </>
  );
};

export default LandingPage;
