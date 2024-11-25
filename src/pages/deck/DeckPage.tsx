import { useParams } from "react-router-dom";
import styled from "styled-components";
import useDecks from "../../app/use-decks";
import cardToString from "../../app/card-to-string";

const StyledDeckPage = styled.div`
  width: 100%;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4.8rem;

  @media (max-width: 900px) {
    padding: 2.4rem;
  }
`;

const CardList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
  gap: 2.4rem;
  width: 100%;
  max-width: 120rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const CardContainer = styled.div`
  position: relative;
  width: 100%;
`;

const CardImage = styled.img`
  width: 100%;
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

const DeckPage = () => {
  const deckId = useParams().deckId;
  const decks = useDecks();

  if (!deckId) return <p>Deck not found</p>;
  if (!decks) return <p>Loading...</p>;

  const deck = decks.find((deck) => deck.id === deckId);

  if (!deck) return <p>Deck not found</p>;

  const uniqueCards = deck.cards.filter(
    (card, index, self) => self.findIndex((c) => c.id === card.id) === index
  );

  console.log(uniqueCards);
  for (const card of uniqueCards) {
    console.log(cardToString(card));
  }

  return (
    <StyledDeckPage>
      <CardList>
        {uniqueCards.map((card) => (
          <CardContainer key={card.id}>
            <CardImage src={card.image} alt={card.name} />
            <CardNumber>
              {deck.cards.filter((c) => c.id === card.id).length}
            </CardNumber>
          </CardContainer>
        ))}
      </CardList>
    </StyledDeckPage>
  );
};

export default DeckPage;
