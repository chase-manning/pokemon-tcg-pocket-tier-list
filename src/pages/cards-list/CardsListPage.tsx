import styled from "styled-components";
import UserAccount from "../../components/UserAccount";
import useCards from "../../app/use-cards";
import CardIcon from "../../components/CardIcon";
import useFilters from "../../app/use-filters";
import LastUpdated from "../../components/LastUpdated";
import useExpansions, { ExpansionType } from "../../app/use-expansions";
import Dropdown from "../../components/Dropdown";
import SeoContent from "../../components/SeoContent";
import { useMarkContentReady } from "../../ads/ContentReadyContext";

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

    const bestScore = cards[0].score;
    const worstScore = cards[cards.length - 1].score;
    const steps = (bestScore - worstScore) / 6;

    const sTier = cards.filter((card) => card.score >= bestScore - steps);
    const aTier = cards.filter(
      (card) =>
        card.score < bestScore - steps && card.score >= bestScore - steps * 2
    );
    const bTier = cards.filter(
      (card) =>
        card.score < bestScore - steps * 2 &&
        card.score >= bestScore - steps * 3
    );
    const cTier = cards.filter(
      (card) =>
        card.score < bestScore - steps * 3 &&
        card.score >= bestScore - steps * 4
    );
    const dTier = cards.filter(
      (card) =>
        card.score < bestScore - steps * 4 &&
        card.score >= bestScore - steps * 5
    );
    const eTier = cards.filter((card) => card.score < bestScore - steps * 5);

    return (
      <>
        <DeckRow>
          <RowHeader $backgroundColor="var(--s)">S</RowHeader>
          <RowContent>
            {sTier.map((card) => (
              <CardIcon key={card.id} card={card} />
            ))}
          </RowContent>
        </DeckRow>
        <DeckRow>
          <RowHeader $backgroundColor="var(--a)">A</RowHeader>
          <RowContent>
            {aTier.map((card) => (
              <CardIcon key={card.id} card={card} />
            ))}
          </RowContent>
        </DeckRow>
        <DeckRow>
          <RowHeader $backgroundColor="var(--b)">B</RowHeader>
          <RowContent>
            {bTier.map((card) => (
              <CardIcon key={card.id} card={card} />
            ))}
          </RowContent>
        </DeckRow>
        <DeckRow>
          <RowHeader $backgroundColor="var(--c)">C</RowHeader>
          <RowContent>
            {cTier.map((card) => (
              <CardIcon key={card.id} card={card} />
            ))}
          </RowContent>
        </DeckRow>
        <DeckRow>
          <RowHeader $backgroundColor="var(--d)">D</RowHeader>
          <RowContent>
            {dTier.map((card) => (
              <CardIcon key={card.id} card={card} />
            ))}
          </RowContent>
        </DeckRow>
        <DeckRow>
          <RowHeader $backgroundColor="var(--e)">E</RowHeader>
          <RowContent>
            {eTier.map((card) => (
              <CardIcon key={card.id} card={card} />
            ))}
          </RowContent>
        </DeckRow>
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
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
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
        <h2>About the Pokémon TCG Pocket card tier list</h2>
        <p>
          This card tier list ranks individual cards in Pokémon TCG Pocket by how
          much they contribute to winning decks. Instead of guessing which
          Pokémon and Trainer cards are worth pulling or crafting, you can see at
          a glance which cards show up most often in the strongest tournament
          decks, ranked from S down to E.
        </p>

        <h3>How card scores are calculated</h3>
        <p>
          Each card's score is derived from the performance and popularity of the
          decks it appears in. Cards that are core to multiple high-tier
          archetypes earn the highest ratings, while cards that see little
          competitive play settle lower. You can filter the list by expansion to
          focus on a specific set when deciding where to spend your pack points
          or wonder picks.
        </p>

        <h3>Using the card rankings</h3>
        <p>
          Pair this list with the{" "}
          <a href="/tier-list">deck tier list</a> and the Best Deck Finder to
          plan your collection: prioritise the high-tier cards that unlock the
          decks you want to play, and avoid spending resources on cards that
          rarely make an impact. The rankings refresh alongside the deck data as
          the metagame evolves.
        </p>
      </SeoContent>
    </>
  );
};

export default CardsListPage;
