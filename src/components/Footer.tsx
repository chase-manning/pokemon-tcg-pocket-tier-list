import React, { useState } from "react";
import styled from "styled-components";
import GitHubIcon from "./GitHubIcon";
import InfoIcon from "./InfoIcon";
import InfoModal from "./InfoModal";

const FooterContainer = styled.footer`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  gap: 16px;
`;

const IconLink = styled.a`
  color: var(--text);
  opacity: 0.7;
  transition: opacity 0.2s;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 1;
  }
`;

const IconButton = styled.button`
  color: var(--text);
  opacity: 0.7;
  transition: opacity 0.2s;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 1;
  }
`;

const Footer = () => {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  return (
    <FooterContainer>
      <IconButton
        onClick={() => setIsInfoModalOpen(true)}
        aria-label="Information about this website"
      >
        <InfoIcon />
      </IconButton>

      <IconLink
        href="https://github.com/chase-manning/pokemon-tcg-pocket-tier-list"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View source code on GitHub"
      >
        <GitHubIcon />
      </IconLink>

      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />
    </FooterContainer>
  );
};

export default Footer;
