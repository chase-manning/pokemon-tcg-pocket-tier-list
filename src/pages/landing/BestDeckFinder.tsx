import styled, { keyframes } from "styled-components";
import bestDeck from "../../assets/best-deck.webp";
import Button from "../../components/Button";
import { useTranslation } from "react-i18next";

const rainbowAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const StyledBestDeckFinder = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8rem 4.8rem;
  gap: 4.8rem;
  background: var(--bg);
  margin-bottom: 10rem;

  @media (max-width: 900px) {
    padding: 4.8rem 2.4rem;
    margin-bottom: 0;
  }
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  gap: 8rem;
  max-width: 150rem;
  width: 100%;

  @media (max-width: 900px) {
    flex-direction: column;
    gap: 4.8rem;
  }
`;

const TextSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
`;

const Title = styled.h2`
  font-size: 5.6rem;
  font-weight: 500;
  color: var(--text);

  @media (max-width: 900px) {
    font-size: 4rem;
    text-align: center;
  }
`;

const Description = styled.p`
  font-size: 1.8rem;
  color: var(--text-secondary);
  line-height: 1.6;

  @media (max-width: 900px) {
    font-size: 1.6rem;
    text-align: center;
  }
`;

const ImageSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  perspective: 1000px;
`;

const ImageContainer = styled.div`
  padding: 3px;
  border-radius: 12px;
  background: linear-gradient(
    45deg,
    var(--s),
    var(--a),
    var(--b),
    var(--c),
    var(--d),
    var(--e),
    var(--s)
  );
  background-size: 200% 200%;
  animation: ${rainbowAnimation} 12s ease infinite;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2), 0 0 12px rgba(255, 255, 255, 0.1);
`;

const Image = styled.img`
  width: 100%;
  max-width: 50rem;
  height: auto;
  border-radius: 8px;
  display: block;
`;

const ButtonContainer = styled.div`
  display: flex;

  @media (max-width: 900px) {
    align-items: center;
    justify-content: center;
  }
`;

const BestDeckFinder = () => {
  const { t } = useTranslation();

  return (
    <StyledBestDeckFinder>
      <Content>
        <TextSection>
          <Title>{t("bestDeckFinder.title")}</Title>
          <Description>{t("bestDeckFinder.description1")}</Description>
          <Description>{t("bestDeckFinder.description2")}</Description>
          <ButtonContainer>
            <Button to="/deck">{t("bestDeckFinder.button")}</Button>
          </ButtonContainer>
        </TextSection>
        <ImageSection>
          <ImageContainer>
            <Image src={bestDeck} alt={t("bestDeckFinder.title")} />
          </ImageContainer>
        </ImageSection>
      </Content>
    </StyledBestDeckFinder>
  );
};

export default BestDeckFinder;
