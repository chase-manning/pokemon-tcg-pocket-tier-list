import styled, { keyframes } from "styled-components";
import Header from "../../components/Header";
import tierList from "../../assets/tier-list.webp";
import Button from "../../components/Button";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const rainbowAnimation = keyframes`
  0% {
    background-position: 0 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
`;

const StyledHero = styled.div`
  width: 100%;
  min-height: 80dvh;
  display: flex;
  flex-direction: column;
  padding: 2rem 4rem;

  @media (max-width: 900px) {
    padding: 2rem;
    min-height: 0;
  }
`;

const Content = styled.div`
  width: 100%;
  margin: auto;
  display: flex;
  align-items: center;
  flex: 1;
  gap: 4rem;

  @media (max-width: 1024px) {
    flex-direction: column;
    text-align: center;
    gap: 8rem;
  }
`;

const TextSection = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 4rem;

  @media (max-width: 1024px) {
    align-items: center;
    gap: 2rem;
  }
`;

const StyledHeader = styled.h1`
  font-size: 5.5rem;
  font-weight: 600;

  @media (max-width: 1400px) {
    font-size: 4.5rem;
  }

  @media (max-width: 900px) {
    font-size: 3.6rem;
  }
`;

const StyledSubheader = styled.h2`
  font-size: 2rem;
  font-weight: 500;
  max-width: 65rem;

  @media (max-width: 1400px) {
    font-size: 1.8rem;
  }

  @media (max-width: 900px) {
    font-size: 1.6rem;
  }
`;

const ImageSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1000px;

  @media (max-width: 1024px) {
    width: 100%;
  }
`;

const ImageContainer = styled(Link)<{ $rotateX: number; $rotateY: number }>`
  padding: 4px;
  border-radius: 16px;
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
  background-size: 300% 300%;
  animation: ${rainbowAnimation} 8s ease infinite;
  transform-style: preserve-3d;
  transform: rotateX(${(props) => props.$rotateX}deg)
    rotateY(${(props) => props.$rotateY}deg);
  transition: all 0.2s ease;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 255, 255, 0.1),
    0 0 40px rgba(255, 255, 255, 0.05);
  filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.1));
  cursor: pointer;

  @media (max-width: 1024px) {
    transform: none;
    animation: none;
  }
`;

const Image = styled.img`
  width: 65dvh;
  object-fit: cover;
  border-radius: 12px;
  display: block;

  @media (max-width: 1024px) {
    width: 100%;
    max-width: 50rem;
  }
`;

const Hero = () => {
  const { t } = useTranslation();
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 5;
      const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * 5;

      setRotateX(rotateX);
      setRotateY(rotateY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <StyledHero>
      <Header />
      <Content>
        <TextSection>
          <StyledHeader>{t("hero.title")}</StyledHeader>
          <StyledSubheader>{t("hero.subtitle")}</StyledSubheader>
          <div>
            <Button to="/tier-list">{t("hero.button")}</Button>
          </div>
        </TextSection>
        <ImageSection ref={containerRef}>
          <ImageContainer $rotateX={rotateX} $rotateY={rotateY} to="/tier-list">
            <Image src={tierList} alt={t("hero.title")} />
          </ImageContainer>
        </ImageSection>
      </Content>
    </StyledHero>
  );
};

export default Hero;
