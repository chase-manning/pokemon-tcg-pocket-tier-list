import React from "react";
import styled from "styled-components";
import { useTranslation, Trans } from "react-i18next";

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
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <Title>{t("infoModal.title")}</Title>

        <Section>
          <SectionHeading>{t("infoModal.whatIsThis.title")}</SectionHeading>
          <Paragraph>
            <Trans
              i18nKey="infoModal.whatIsThis.description"
              components={[
                <Link
                  href="https://limitlesstcg.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Limitless Tournaments
                </Link>,
              ]}
            />
          </Paragraph>
        </Section>

        <Section>
          <SectionHeading>{t("infoModal.howToUse.title")}</SectionHeading>
          <List>
            <ListItem>
              <StrongText>
                {t("infoModal.howToUse.features.deckLists.title")}:
              </StrongText>{" "}
              {t("infoModal.howToUse.features.deckLists.description")}
            </ListItem>
            <ListItem>
              <StrongText>
                {t("infoModal.howToUse.features.missingCards.title")}:
              </StrongText>{" "}
              {t("infoModal.howToUse.features.missingCards.description")}
            </ListItem>
            <ListItem>
              <StrongText>
                {t("infoModal.howToUse.features.dynamicTierList.title")}:
              </StrongText>{" "}
              {t("infoModal.howToUse.features.dynamicTierList.description")}
            </ListItem>
          </List>
        </Section>

        <Section>
          <SectionHeading>{t("infoModal.dataSources.title")}</SectionHeading>
          <Paragraph>{t("infoModal.dataSources.intro")}</Paragraph>
          <List>
            <ListItem>
              <Trans
                i18nKey="infoModal.dataSources.sources.tournament"
                components={[
                  <Link
                    href="https://limitlesstcg.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Limitless Tournaments
                  </Link>,
                ]}
              />
            </ListItem>
            <ListItem>
              <Trans
                i18nKey="infoModal.dataSources.sources.cards"
                components={[
                  <Link
                    href="https://github.com/chase-manning/pokemon-tcg-pocket-cards"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    pokemon-tcg-pocket-cards
                  </Link>,
                ]}
              />
            </ListItem>
          </List>
        </Section>

        <Section>
          <SectionHeading>{t("infoModal.openSource.title")}</SectionHeading>
          <Paragraph>
            <Trans
              i18nKey="infoModal.openSource.description"
              components={[
                <Link
                  href="https://github.com/chase-manning/pokemon-tcg-pocket-tier-list"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </Link>,
              ]}
            />
          </Paragraph>
        </Section>
      </ModalContent>
    </ModalOverlay>
  );
};

export default InfoModal;
