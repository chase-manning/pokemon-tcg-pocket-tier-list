import styled from "styled-components";
import useDecks from "../../app/use-decks";
import DeckCard from "../../components/DeckCard";

const StyledLandingPage = styled.div`
  width: 100%;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 900px) {
    height: auto;
  }
`;

const DeckRow = styled.div`
  width: 100%;
  display: flex;
  flex: 1;
  border-bottom: 0.4rem solid var(--border);

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
  gap: 1.5rem;

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

const LandingPage = () => {
  const decks = useDecks();

  if (!decks) return <Loading>Loading...</Loading>;

  const bestScore = decks.reduce(
    (best, deck) => (deck.score > best ? deck.score : best),
    0
  );

  const worstScore = decks.reduce(
    (worst, deck) => (deck.score < worst ? deck.score : worst),
    1000000
  );

  const steps = (bestScore - worstScore) / 6;

  const sTier = decks.filter((deck) => deck.score >= bestScore - steps);
  const aTier = decks.filter(
    (deck) =>
      deck.score < bestScore - steps && deck.score >= bestScore - steps * 2
  );
  const bTier = decks.filter(
    (deck) =>
      deck.score < bestScore - steps * 2 && deck.score >= bestScore - steps * 3
  );
  const cTier = decks.filter(
    (deck) =>
      deck.score < bestScore - steps * 3 && deck.score >= bestScore - steps * 4
  );
  const dTier = decks.filter(
    (deck) =>
      deck.score < bestScore - steps * 4 && deck.score >= bestScore - steps * 5
  );
  const eTier = decks.filter((deck) => deck.score < bestScore - steps * 5);

  return (
    <StyledLandingPage>
      <DeckRow>
        <RowHeader $backgroundColor="var(--s)">S</RowHeader>
        <RowContent>
          {sTier.map((deck) => (
            <DeckCard key={deck.id} deck={deck} />
          ))}
        </RowContent>
      </DeckRow>
      <DeckRow>
        <RowHeader $backgroundColor="var(--a)">A</RowHeader>
        <RowContent>
          {aTier.map((deck) => (
            <DeckCard key={deck.id} deck={deck} />
          ))}
        </RowContent>
      </DeckRow>
      <DeckRow>
        <RowHeader $backgroundColor="var(--b)">B</RowHeader>
        <RowContent>
          {bTier.map((deck) => (
            <DeckCard key={deck.id} deck={deck} />
          ))}
        </RowContent>
      </DeckRow>
      <DeckRow>
        <RowHeader $backgroundColor="var(--c)">C</RowHeader>
        <RowContent>
          {cTier.map((deck) => (
            <DeckCard key={deck.id} deck={deck} />
          ))}
        </RowContent>
      </DeckRow>
      <DeckRow>
        <RowHeader $backgroundColor="var(--d)">D</RowHeader>
        <RowContent>
          {dTier.map((deck) => (
            <DeckCard key={deck.id} deck={deck} />
          ))}
        </RowContent>
      </DeckRow>
      <DeckRow>
        <RowHeader $backgroundColor="var(--e)">E</RowHeader>
        <RowContent>
          {eTier.map((deck) => (
            <DeckCard key={deck.id} deck={deck} />
          ))}
        </RowContent>
      </DeckRow>
    </StyledLandingPage>
  );
};

export default LandingPage;
