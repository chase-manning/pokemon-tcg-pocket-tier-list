import styled from "styled-components";
import Hero from "./Hero";
import HomeBanner from "../../components/HomeBanner";
import Header from "../../components/Header";
import Features from "./Features";
import BestDeckFinder from "./BestDeckFinder";
import AdInContent from "../../ads/AdInContent";
import { useMarkContentReady } from "../../ads/ContentReadyContext";

const StyledLandingPage = styled.div`
  width: 100%;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 150rem;
  margin: 0 auto;
  background-color: var(--bg);
`;

const LandingPage = () => {
  useMarkContentReady(true);

  return (
    <StyledLandingPage>
      <HomeBanner />
      <Hero />
      <Features />
      <AdInContent placement="landing" />
      <BestDeckFinder />
      <Header footer />
    </StyledLandingPage>
  );
};

export default LandingPage;
