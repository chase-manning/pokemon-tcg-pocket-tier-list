import styled from "styled-components";
import UserAccount from "../../components/UserAccount";
import useCards from "../../app/use-cards";
import useFilters from "../../app/use-filters";
import { buildTiers } from "../../app/tier-helper";
import CardIcon from "../../components/CardIcon";
import LastUpdated from "../../components/LastUpdated";
import useExpansions, { ExpansionType } from "../../app/use-expansions";
import Dropdown from "../../components/Dropdown";
import SeoContent from "../../components/SeoContent";
import { useMarkContentReady } from "../../ads/ContentReadyContext";
import React, { type ChangeEvent } from "react";

const StyledCardsListPage = styled.div`
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

const CardsListPage = () => {
  const cards = useCards(30);
  const { expansion, setExpansion } = useFilters();
  const expansions = useExpansions();

  const ready = !!cards && cards.length > 0;
  useMarkContentReady(ready);

  const renderTiers = () => {
    if (!cards) return <Loading>Loading...</Loading>;
    if (cards.length === 0) return <Loading>No cards found</Loading>;

    const tiers = buildTiers(cards, (c) => c.score);

    return (
        <>
          {tiers.map((tier) => (
              <DeckRow key={tier.label}>
                <RowHeader $backgroundColor={tier.color}>{tier.label}</RowHeader>
                <RowContent>
                  {tier.data.map((card) => (
                      <CardIcon key={card.id} card={card} />
                  ))}
                </RowContent>
              </DeckRow>
          ))}
          <LastUpdated />
        </>
    );
  };

  return (
    <>
      <StyledCardsListPage>
        <FilterContainer>
          <UserAccount />
          <Dropdown
            value={expansion ?? ""}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              const value = e.target.value;
              setExpansion(value === "" ? null : value);
            }}
          >
            <option value="">All</option>
            {expansions?.map((expansion: ExpansionType) => (
              <option key={expansion.id} value={expansion.id}>
                {expansion.name}
              </option>
            ))}
          </Dropdown>
        </FilterContainer>
        {renderTiers()}
      </StyledCardsListPage>
      <SeoContent>
        <h2>Pokémon TCG Pocket | Card Tier List</h2>
        <p>
          This tier list ranks individual cards in Pokémon TCG Pocket based on their
          contribution to winning decks. Instead of guessing which Pokémon and Trainer
          cards are worth pulling or crafting, you can see exactly which cards appear
          most frequently in the strongest tournament decks.
        </p>

        <h3>Calculating card scores</h3>
        <p>
          A card's score comes directly from the performance and popularity of the
          decks it appears in. Cards central to multiple high-tier archetypes earn the
          highest ratings. Cards that see little competitive play settle lower. You
          can filter the list by expansion to evaluate a specific set before spending
          your pack points or wonder picks.
        </p>

        <h3>Using the card rankings</h3>
        <p>
          Pair this list with the <a href="/tier-list">deck tier list</a> and the Best
          Deck Finder to plan your collection. This helps you prioritise high-tier
          cards that unlock competitive decks and avoid spending resources on cards
          with minimal impact. The card rankings refresh automatically alongside the
          deck data.
        </p>
      </SeoContent>
    </>
  );
};

export default CardsListPage;
