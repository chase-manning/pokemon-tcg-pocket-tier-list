import styled from "styled-components";
import { Link } from "react-router-dom";
import { FullDeckType } from "../contexts/DecksContext";
import { DEBUG } from "../app/config";

const Container = styled.div`
  position: relative;
  height: 100%;

  @media (max-width: 900px) {
    height: auto;
    width: 100%;
    aspect-ratio: 1 / 1;
  }
`;

const StyledDeckCard = styled(Link) <{ $disabled: boolean }>`
  position: relative;
  border-radius: 1.2rem;
  color: var(--bg);
  display: flex;
  height: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  cursor: pointer;

  filter: ${(props) => (props.$disabled ? "grayscale(1)" : "none")};
  opacity: ${(props) => (props.$disabled ? 0.5 : 1)};
`;

const SubCard = styled(Link) <{ $disabled: boolean }>`
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
  font-size: 1.6rem;
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

const round = (num: number, decimals = 2) => {
    return Math.round(num * 10 ** decimals) / 10 ** decimals;
};

const DeckCard = ({ deck }: Props) => {
    return (
        <Container>
            <StyledDeckCard to={`/deck/${deck.id}`} $disabled={false}>
                <DeckImage key={deck.iconPrimary.id} src={deck.iconPrimary.image} alt={deck.iconPrimary.name} />
                {DEBUG && <Percent>{round(deck.percentOfGames, 5)}%</Percent>}
            </StyledDeckCard>
            {deck.iconSecondary && (
                <SubCard to={`/deck/${deck.id}`} $disabled={false}>
                    <DeckImage
                        key={deck.iconSecondary.id}
                        src={deck.iconSecondary.image}
                        alt={deck.iconSecondary.name}
                    />
                </SubCard>
            )}
        </Container>
    );
};

export default DeckCard;
