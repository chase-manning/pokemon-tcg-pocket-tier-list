import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import useDecks from "../../app/use-decks";

const StyledLandingPage = styled.div`
  width: 100%;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.h1`
  font-size: 3.6rem;
  font-weight: 700;
  margin-bottom: 2.4rem;
`;

const DeckList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
  gap: 2.4rem;
  width: 100%;
  max-width: 120rem;
`;

const DeckCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.4rem;
  border-radius: 1.2rem;
  background: var(--primary);
  color: var(--bg);
`;

const DeckTitle = styled.h2`
  font-size: 2.4rem;
  font-weight: 700;
  margin-bottom: 1.2rem;
`;

const DeckImage = styled.img`
  width: 100%;
  max-width: 20rem;
  margin-bottom: 1.2rem;
`;

const DeckDescription = styled.p`
  font-size: 1.6rem;
  text-align: center;
`;

const DeckButton = styled.button`
  margin-top: 1.2rem;
  padding: 1.2rem 2.4rem;
  border-radius: 1.2rem;
  background: var(--secondary);
  color: var(--bg);
  font-size: 1.6rem;
  font-weight: 700;
  cursor: pointer;
`;

const LandingPage = () => {
  const navigate = useNavigate();
  const decks = useDecks();

  return (
    <StyledLandingPage>
      <Header>Pokemon TCG Pocket Best Decks</Header>
      <DeckList>
        {decks &&
          decks.map((deck) => (
            <DeckCard key={deck.id}>
              <DeckTitle>{deck.name}</DeckTitle>
              {/* <DeckImage src={deck.image} alt={deck.title} />
            <DeckDescription>{deck.description}</DeckDescription> */}
              <DeckButton onClick={() => navigate(`/deck/${deck.id}`)}>
                View Deck
              </DeckButton>
            </DeckCard>
          ))}
      </DeckList>
    </StyledLandingPage>
  );
};

export default LandingPage;
