import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { CardType, FullDeckType } from "../app/use-decks";
import { DEBUG, MIN_PERCENT_TO_QUALIFY } from "../app/config";

const Container = styled.div`
  position: relative;
  height: 100%;

  @media (max-width: 900px) {
    height: auto;
    width: 100%;
    aspect-ratio: 1 / 1;
  }
`;

const StyledDeckCard = styled.button<{ $disabled: boolean }>`
  position: relative;
  border-radius: 1.2rem;
  color: var(--bg);
  height: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  cursor: pointer;

  filter: ${(props) => (props.$disabled ? "grayscale(1)" : "none")};
  opacity: ${(props) => (props.$disabled ? 0.5 : 1)};
`;

const SubCard = styled.div<{ $disabled: boolean }>`
  position: absolute;
  bottom: -1rem;
  right: -1rem;
  border-radius: 0.6rem;
  color: var(--bg);
  height: 50%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border: solid 1px rgba(0, 0, 0, 0.7);
  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.7);

  filter: ${(props) => (props.$disabled ? "grayscale(1)" : "none")};
  opacity: ${(props) => (props.$disabled ? 0.5 : 1)};
`;

const DeckImage = styled.img`
  position: absolute;
  top: -32%;
  left: 50%;
  transform: translateX(-50%);
  height: 280%;
`;

const Percent = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  position: absolute;
  bottom: 0.5rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.7);
`;

interface Props {
  deck: FullDeckType;
}

const DeckCard = ({ deck }: Props) => {
  const navigate = useNavigate();

  const cardIds = deck.name.split("&");

  const cards: CardType[] = cardIds.map((cardId) => {
    const exactCard = deck.cards.find(
      (card) => `${card.name}-${card.id}`.toLowerCase() === cardId.toLowerCase()
    );
    let mainCard = deck.cards.find((card) => card.name.includes(cardId));

    return exactCard || mainCard || deck.cards[0];
  });

  const isAboveMin = deck.percentOfGames > MIN_PERCENT_TO_QUALIFY;

  const round = (num: number, decimals = 2) => {
    return Math.round(num * 10 ** decimals) / 10 ** decimals;
  };

  return (
    <Container>
      <StyledDeckCard
        onClick={() => navigate(`/deck/${deck.id}`)}
        $disabled={!isAboveMin && DEBUG}
      >
        <DeckImage key={cards[0].id} src={cards[0].image} alt={cards[0].name} />
        {DEBUG && <Percent>{round(deck.percentOfGames, 5)}%</Percent>}
      </StyledDeckCard>
      {cards.length > 1 && (
        <SubCard
          onClick={() => navigate(`/deck/${deck.id}`)}
          $disabled={!isAboveMin && DEBUG}
        >
          <DeckImage
            key={cards[1].id}
            src={cards[1].image}
            alt={cards[1].name}
          />
        </SubCard>
      )}
    </Container>
  );
};

export default DeckCard;
