import styled from "styled-components";

import logo from "../assets/logo.webp";
import { Link } from "react-router-dom";

const Container = styled(Link)`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StyledLogo = styled.img`
  width: 8rem;

  @media (max-width: 900px) {
    width: 6rem;
  }
`;

const StyledText = styled.p`
  font-size: 2.8rem;
  font-weight: 600;
  color: var(--main);

  @media (max-width: 1156px) {
    display: none;
    font-size: 2rem;
  }
`;

const Logo = () => {
  return (
    <Container to="/">
      <StyledLogo src={logo} alt="logo" />
      <StyledText>Top Pocket Decks</StyledText>
    </Container>
  );
};

export default Logo;
