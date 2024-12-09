import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FullDeckType } from "../app/use-decks";

const StyledDeckCard = styled.button`
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

interface Props {
  deck: FullDeckType;
}

const DeckCard = ({ deck }: Props) => {
  const navigate = useNavigate();

  const exactCard = deck.cards.find((card) => card.name === deck.name);
  let mainCard = deck.cards.find((card) => card.name.includes(deck.name));

  mainCard = exactCard || mainCard || deck.cards[0];

  return (
    <StyledDeckCard onClick={() => navigate(`/deck/${deck.id}`)}>
      <DeckImage src={mainCard.image} alt={deck.name} />
    </StyledDeckCard>
  );
};

export default DeckCard;
