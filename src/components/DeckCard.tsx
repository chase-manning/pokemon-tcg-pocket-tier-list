import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { CardType, FullDeckType } from "../app/use-decks";
import { DEBUG, MIN_PERCENT_TO_QUALIFY } from "../app/config";

const StyledDeckCard = styled.button<{ $disabled: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 1.2rem;
  color: var(--bg);
  height: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  position: relative;

  filter: ${(props) => (props.$disabled ? "grayscale(1)" : "none")};
  opacity: ${(props) => (props.$disabled ? 0.5 : 1)};
`;

const Container = styled.div<{ $full?: boolean; $right?: boolean }>`
  position: absolute;
  top: ${(props) => (props.$right ? "50%" : "0")};
  left: 0;
  width: 100%;
  height: ${(props) => (props.$full ? "100%" : "50%")};
  overflow: hidden;
`;

const DeckImage = styled.img`
  position: absolute;
  top: -32%;
  left: 50%;
  transform: translateX(-50%);
  height: 280%;
  aspect-ratio: 1 / 1;
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
    <StyledDeckCard
      onClick={() => navigate(`/deck/${deck.id}`)}
      $disabled={!isAboveMin && DEBUG}
    >
      {cards.map((card, index) => {
        return (
          <Container
            $full={cards.length === 1}
            key={card.id}
            $right={index === 1}
          >
            <DeckImage key={card.id} src={card.image} alt={deck.name} />
          </Container>
        );
      })}
      {DEBUG && <Percent>{round(deck.percentOfGames, 5)}%</Percent>}
    </StyledDeckCard>
  );
};

export default DeckCard;
