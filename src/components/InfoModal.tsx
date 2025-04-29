import React from "react";
import styled from "styled-components";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: var(--bg);
  color: var(--text);
  padding: 3rem;
  border-radius: 12px;
  max-width: 900px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-size: 1.25rem;
  line-height: 1.6;
`;

const SectionHeading = styled.h3`
  font-size: 1.8rem;
  margin: 0 0 1.2rem 0;
`;

const Paragraph = styled.p`
  margin: 0 0 1.2rem 0;
  font-size: 1.25rem;
`;

const List = styled.ul`
  margin: 0 0 1.2rem 0;
  padding-left: 2rem;
  font-size: 1.25rem;
`;

const ListItem = styled.li`
  margin-bottom: 1rem;
  font-size: 1.25rem;
`;

const StrongText = styled.strong`
  font-size: 1.3rem;
`;

const Link = styled.a`
  color: var(--text);
  text-decoration: underline;
  font-size: 1.25rem;

  &:hover {
    opacity: 0.8;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: none;
  border: none;
  color: var(--text);
  font-size: 2.5rem;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.8;
  }
`;

const Title = styled.h2`
  margin: 0 0 2.5rem 0;
  font-size: 2.5rem;
  line-height: 1.2;
`;

const Section = styled.div`
  margin-bottom: 2.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <Title>About Pokemon TCG Pocket Deck Tier List</Title>

        <Section>
          <SectionHeading>What is this website?</SectionHeading>
          <Paragraph>
            This website shows the current best decks for the Pokemon TCG Pocket
            game based on tournament performance data from{" "}
            <Link
              href="https://limitlesstcg.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Limitless Tournaments
            </Link>
            . The tier list is updated regularly to reflect the latest meta.
          </Paragraph>
        </Section>

        <Section>
          <SectionHeading>How to use this website</SectionHeading>
          <List>
            <ListItem>
              <StrongText>View Deck Lists:</StrongText> Click on any deck in the
              tier list to view its complete card list.
            </ListItem>
            <ListItem>
              <StrongText>Missing Cards Feature:</StrongText> When viewing a
              deck list, you can click on cards you don't have. The website will
              then show you the next best deck that you can make without those
              cards.
            </ListItem>
            <ListItem>
              <StrongText>Dynamic Tier List:</StrongText> As you mark cards as
              missing, the tier list will update to reflect the new ratings
              based on the cards you have available.
            </ListItem>
          </List>
        </Section>

        <Section>
          <SectionHeading>Data Sources</SectionHeading>
          <Paragraph>This project uses two main data sources:</Paragraph>
          <List>
            <ListItem>
              Tournament data from{" "}
              <Link
                href="https://limitlesstcg.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Limitless
              </Link>
              , a leading platform for Pokemon TCG tournaments.
            </ListItem>
            <ListItem>
              Card data from{" "}
              <Link
                href="https://github.com/chase-manning/pokemon-tcg-pocket-cards"
                target="_blank"
                rel="noopener noreferrer"
              >
                pokemon-tcg-pocket-cards
              </Link>
              , an open-source repository that provides comprehensive card
              information.
            </ListItem>
          </List>
        </Section>

        <Section>
          <SectionHeading>Open Source</SectionHeading>
          <Paragraph>
            This website is open source. You can find the source code on{" "}
            <Link
              href="https://github.com/chase-manning/pokemon-tcg-pocket-tier-list"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </Link>
            . Contributions are welcome!
          </Paragraph>
        </Section>
      </ModalContent>
    </ModalOverlay>
  );
};

export default InfoModal;
