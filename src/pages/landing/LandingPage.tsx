import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import useDecks from "../../app/use-decks";

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

const RowHeader = styled.div<{ backgroundColor: string }>`
  height: 100%;
  aspect-ratio: 1 / 1;
  background: ${(props) => props.backgroundColor};
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

const DeckCard = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.2rem;
  border-radius: 1.2rem;
  color: var(--bg);
  height: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  position: relative;
  cursor: pointer;
`;

const DeckImage = styled.img`
  position: absolute;
  top: -32%;
  left: 50%;
  transform: translateX(-50%);
  height: 280%;
`;

const LandingPage = () => {
  const navigate = useNavigate();
  const decks = useDecks();

  if (!decks) return <p>Loading...</p>;

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
        <RowHeader backgroundColor="var(--s)">S</RowHeader>
        <RowContent>
          {sTier.map((deck) => {
            let mainCard = deck.cards.find((card) =>
              card.name.includes(deck.name)
            );

            mainCard = mainCard || deck.cards[0];

            return (
              <DeckCard
                key={deck.id}
                onClick={() => navigate(`/deck/${deck.id}`)}
              >
                <DeckImage src={mainCard.image} alt={deck.name} />
              </DeckCard>
            );
          })}
        </RowContent>
      </DeckRow>
      <DeckRow>
        <RowHeader backgroundColor="var(--a)">A</RowHeader>
        <RowContent>
          {aTier.map((deck) => {
            let mainCard = deck.cards.find((card) =>
              card.name.includes(deck.name)
            );

            mainCard = mainCard || deck.cards[0];

            return (
              <DeckCard
                key={deck.id}
                onClick={() => navigate(`/deck/${deck.id}`)}
              >
                <DeckImage src={mainCard.image} alt={deck.name} />
              </DeckCard>
            );
          })}
        </RowContent>
      </DeckRow>
      <DeckRow>
        <RowHeader backgroundColor="var(--b)">B</RowHeader>
        <RowContent>
          {bTier.map((deck) => {
            let mainCard = deck.cards.find((card) =>
              card.name.includes(deck.name)
            );

            mainCard = mainCard || deck.cards[0];

            return (
              <DeckCard
                key={deck.id}
                onClick={() => navigate(`/deck/${deck.id}`)}
              >
                <DeckImage src={mainCard.image} alt={deck.name} />
              </DeckCard>
            );
          })}
        </RowContent>
      </DeckRow>
      <DeckRow>
        <RowHeader backgroundColor="var(--c)">C</RowHeader>
        <RowContent>
          {cTier.map((deck) => {
            let mainCard = deck.cards.find((card) =>
              card.name.includes(deck.name)
            );

            mainCard = mainCard || deck.cards[0];

            return (
              <DeckCard
                key={deck.id}
                onClick={() => navigate(`/deck/${deck.id}`)}
              >
                <DeckImage src={mainCard.image} alt={deck.name} />
              </DeckCard>
            );
          })}
        </RowContent>
      </DeckRow>
      <DeckRow>
        <RowHeader backgroundColor="var(--d)">D</RowHeader>
        <RowContent>
          {dTier.map((deck) => {
            let mainCard = deck.cards.find((card) =>
              card.name.includes(deck.name)
            );

            mainCard = mainCard || deck.cards[0];

            return (
              <DeckCard
                key={deck.id}
                onClick={() => navigate(`/deck/${deck.id}`)}
              >
                <DeckImage src={mainCard.image} alt={deck.name} />
              </DeckCard>
            );
          })}
        </RowContent>
      </DeckRow>
      <DeckRow>
        <RowHeader backgroundColor="var(--e)">E</RowHeader>
        <RowContent>
          {eTier.map((deck) => {
            let mainCard = deck.cards.find((card) =>
              card.name.includes(deck.name)
            );

            mainCard = mainCard || deck.cards[0];

            return (
              <DeckCard
                key={deck.id}
                onClick={() => navigate(`/deck/${deck.id}`)}
              >
                <DeckImage src={mainCard.image} alt={deck.name} />
              </DeckCard>
            );
          })}
        </RowContent>
      </DeckRow>
    </StyledLandingPage>
  );
};

export default LandingPage;
