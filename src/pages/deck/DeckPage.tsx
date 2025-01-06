import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import useDecks, { FullDeckType } from "../../app/use-decks";
import useMissing from "../../app/use-missing";

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
  max-width: 140rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const CardContainer = styled.button`
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

const Overlay = styled.div`
  height: 100dvh;
  width: 100dvw;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-weight: 500;
`;

const Link = styled.button`
  color: var(--main);
  font-weight: 500;
  font-size: 2rem;
  margin-left: 5px;
  text-decoration: underline;
`;

const DeckPage = () => {
  const deckId = useParams().deckId;
  const decks = useDecks();
  const navigate = useNavigate();
  const { addMissing } = useMissing();

  if (!decks) return <Overlay>Loading...</Overlay>;

  let deck: FullDeckType | undefined = undefined;

  if (deckId) {
    deck = decks.find((deck) => deck.id === deckId);
  } else {
    deck = decks.sort((a, b) => b.score - a.score)[0];
  }

  if (deck === undefined) {
    return (
      <Overlay>
        Not enough cards,{" "}
        <Link onClick={() => navigate("/")}>try another deck</Link>
      </Overlay>
    );
  }

  const uniqueCards =
    deck &&
    deck.cards.filter(
      (card, index, self) => self.findIndex((c) => c.id === card.id) === index
    );

  return (
    <StyledDeckPage>
      <CardList>
        {uniqueCards.map((card) => (
          <CardContainer key={card.id} onClick={() => addMissing(card.id)}>
            <CardImage src={card.image} alt={card.name} />
            <CardNumber>
              {deck && deck.cards.filter((c) => c.id === card.id).length}
            </CardNumber>
          </CardContainer>
        ))}
      </CardList>
    </StyledDeckPage>
  );
};

export default DeckPage;
