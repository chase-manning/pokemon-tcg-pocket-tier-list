import styled from "styled-components";
import useDecks from "../../app/use-decks";
import DeckCard from "../../components/DeckCard";

const StyledNewPage = styled.div`
  width: 100%;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  padding: 8rem;
  gap: 8rem;

  @media (max-width: 900px) {
    padding: 2.4rem;
  }
`;

const Column = styled.div`
  height: 100%;
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20rem;
  padding: 0 10rem;
  flex-direction: column;
`;

const Header = styled.h2`
  margin: auto;
  font-size: 8rem;
  font-weight: 500;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: auto;
  margin-bottom: 4rem;
  height: 13dvh;
  gap: 8rem;
  width: 100%;
  max-width: 55rem;
`;

const Text = styled.div<{ color: string }>`
  color: ${(props) => props.color};
  font-size: 6rem;
  font-weight: 600;
`;

const NewPage = () => {
  const oldDecks = useDecks(true);
  const newDecks = useDecks();

  if (!oldDecks || !newDecks) return <div>Loading...</div>;

  const formatPlace = (place: number) =>
    `#${place.toString().padStart(2, "0")}`;

  const newNewDecks = newDecks.filter(
    (newDeck) => !oldDecks.find((deck) => deck.id === newDeck.id)
  );

  return (
    <StyledNewPage>
      <Header>New Decks</Header>
      <Column>
        {newNewDecks.map((deck) => (
          <Row>
            <DeckCard deck={deck} />
            <Text color="lightgreen">{`${formatPlace(deck.place)}`}</Text>
          </Row>
        ))}
      </Column>
    </StyledNewPage>
  );
};

export default NewPage;
