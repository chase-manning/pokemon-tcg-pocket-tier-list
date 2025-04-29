import styled from "styled-components";
import GitHubIcon from "./GitHubIcon";

const FooterContainer = styled.footer`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
`;

const GitHubLink = styled.a`
  color: var(--text);
  opacity: 0.7;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <GitHubLink
        href="https://github.com/chase-manning/pokemon-tcg-pocket-tier-list"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View source code on GitHub"
      >
        <GitHubIcon />
      </GitHubLink>
    </FooterContainer>
  );
};

export default Footer;
