import { useParams } from "react-router-dom";
import styled from "styled-components";
import useDecks from "../../app/use-decks";

const StyledDeckPage = styled.div`
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

const CardList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
  gap: 2.4rem;
  width: 100%;
  max-width: 120rem;
`;

const CardImage = styled.img`
  width: 100%;
`;

const DeckPage = () => {
  const deckId = useParams().deckId;
  const decks = useDecks();

  if (!deckId) return <p>Deck not found</p>;
  if (!decks) return <p>Loading...</p>;

  const deck = decks.find((deck) => deck.id === deckId);

  if (!deck) return <p>Deck not found</p>;

  return (
    <StyledDeckPage>
      <Header>{deck.name}</Header>
      <CardList>
        {deck.cards.map((card) => (
          <CardImage src={card.image} alt={card.name} key={card.id} />
        ))}
      </CardList>
    </StyledDeckPage>
  );
};

export default DeckPage;
