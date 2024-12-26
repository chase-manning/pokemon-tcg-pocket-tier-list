import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FullDeckType } from "../app/use-decks";
import { DEBUG, MIN_PERCENT_TO_QUALIFY } from "../app/config";

const StyledDeckCard = styled.button<{ $disabled: boolean }>`
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
  position: relative;

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

  const exactCard = deck.cards.find(
    (card) =>
      `${card.name}-${card.id}`.toLowerCase() === deck.name.toLowerCase()
  );
  let mainCard = deck.cards.find((card) => card.name.includes(deck.name));

  mainCard = exactCard || mainCard || deck.cards[0];

  const isAboveMin = deck.percentOfGames > MIN_PERCENT_TO_QUALIFY;
  if (!isAboveMin && !DEBUG) {
    return null;
  }

  const round = (num: number, decimals = 2) => {
    return Math.round(num * 10 ** decimals) / 10 ** decimals;
  };

  return (
    <StyledDeckCard
      onClick={() => navigate(`/deck/${deck.id}`)}
      $disabled={!isAboveMin}
    >
      <DeckImage src={mainCard.image} alt={deck.name} />
      {DEBUG && <Percent>{round(deck.percentOfGames, 5)}%</Percent>}
    </StyledDeckCard>
  );
};

export default DeckCard;
