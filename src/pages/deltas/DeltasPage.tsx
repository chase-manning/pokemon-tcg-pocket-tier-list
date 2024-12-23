import styled from "styled-components";
import useDecks from "../../app/use-decks";
import DeckCard from "../../components/DeckCard";

const StyledDeckPage = styled.div`
  width: 100%;
  min-height: 100dvh;
  display: flex;
  padding: 8rem;
  gap: 8rem;

  @media (max-width: 900px) {
    padding: 2.4rem;
  }
`;

const Column = styled.div`
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Header = styled.h2`
  margin: auto;
  font-size: 8rem;
  font-weight: 500;
  margin-bottom: 4.8rem;
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

const DeltasPage = () => {
  const oldDecks = useDecks(true);
  const newDecks = useDecks();

  if (!oldDecks || !newDecks) return <div>Loading...</div>;

  const biggestIncreases = newDecks
    .filter((newDeck) => !!oldDecks.find((deck) => deck.id === newDeck.id))
    .map((newDeck) => {
      const oldDeck = oldDecks.find((deck) => deck.id === newDeck.id);
      if (!oldDeck) throw new Error("Deck not found");

      const increase = oldDeck.place - newDeck.place;
      return { ...newDeck, increase };
    })
    .sort((a, b) => b.increase - a.increase)
    .filter((deck) => deck.increase > 0)
    .slice(0, 4);

  const biggestDecreases = newDecks
    .filter((newDeck) => !!oldDecks.find((deck) => deck.id === newDeck.id))
    .map((newDeck) => {
      const oldDeck = oldDecks.find((deck) => deck.id === newDeck.id);
      if (!oldDeck) throw new Error("Deck not found");

      const decrease = newDeck.place - oldDeck.place;
      return { ...newDeck, decrease };
    })
    .sort((a, b) => b.score - a.score)
    .sort((a, b) => b.decrease - a.decrease)
    .filter((deck) => deck.decrease > 0)
    .slice(0, 4);

  const formatPlace = (place: number) =>
    `#${place.toString().padStart(2, "0")}`;

  return (
    <StyledDeckPage>
      <Column>
        <Header>Top Gainers</Header>
        {biggestIncreases.map((deck) => (
          <Row>
            <DeckCard deck={deck} />
            <Text color="lightgreen">{`${formatPlace(
              deck.place + deck.increase
            )} → ${formatPlace(deck.place)}`}</Text>
          </Row>
        ))}
      </Column>
      <Column>
        <Header>Top Losers</Header>
        {biggestDecreases.map((deck) => (
          <Row>
            <DeckCard deck={deck} />
            <Text color="lightcoral">{`${formatPlace(
              deck.place - deck.decrease
            )} → ${formatPlace(deck.place)}`}</Text>
          </Row>
        ))}
      </Column>
    </StyledDeckPage>
  );
};

export default DeltasPage;
