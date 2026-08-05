import Button from "./Button";
import { CONTACT_EMAIL, MANAGE_SUBSCRIPTION_URL } from "../app/constants";
import useIsPremium from "../app/use-is-premium";
import { useState } from "react";
import Popup from "./Popup";
import { Trans, useTranslation } from "react-i18next";
import styled from "styled-components";
import premiumIcon from "../assets/premium.png";

const ButtonContainer = styled.button`
  cursor: pointer;
`;

const RemoveAdsLink = styled.button`
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--e);
  white-space: nowrap;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const PremiumIcon = styled.img`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;

  @media (max-width: 900px) {
    width: 3.2rem;
    height: 3.2rem;
  }
`;

const Headline = styled.h2`
  margin: 0 0 0.5rem;
  text-align: center;
  font-size: 2.8rem;
  font-weight: 700;
  color: var(--main);

  @media (max-width: 900px) {
    font-size: 2.2rem;
  }
`;

const Text = styled.p`
  margin: 0;
  font-size: 1.7rem;
  line-height: 1.6;
  color: var(--main);

  @media (max-width: 900px) {
    font-size: 1.5rem;
  }
`;

const InlineLink = styled.a`
  color: var(--e);
  font-size: inherit;
  text-decoration: underline;

  &:hover {
    opacity: 0.8;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  width: 100%;

  @media (max-width: 900px) {
    gap: 0.8rem;
  }
`;

interface Props {
  // "link" renders a compact "Remove ads" text trigger (used by the ad anchor)
  // instead of the default premium icon.
  variant?: "default" | "link";
  linkLabel?: string;
}

// New signups are closed while the site is wound down, so this is now purely a
// self-service panel for existing subscribers: what's changing, how to cancel,
// and how to ask for a refund.
const Premium = ({ variant = "default", linkLabel }: Props) => {
  const { t } = useTranslation();
  const isPremium = useIsPremium();
  const [isOpen, setIsOpen] = useState(false);

  if (isPremium === null) return null;

  const isLink = variant === "link";

  return (
    <>
      {isLink && !isPremium && (
        <RemoveAdsLink onClick={() => setIsOpen(true)}>
          {linkLabel ?? t("ads.removeAds")}
        </RemoveAdsLink>
      )}
      {!isLink && isPremium && (
        <ButtonContainer onClick={() => setIsOpen(true)}>
          <PremiumIcon src={premiumIcon} alt="Premium" />
        </ButtonContainer>
      )}
      <Popup
        width="60rem"
        isOpen={isOpen}
        header=""
        close={() => {
          setIsOpen(false);
        }}
      >
        <Headline>{t("premium.windDown.headline")}</Headline>
        <Text>{t("premium.windDown.status")}</Text>
        <Text>{t("premium.windDown.active")}</Text>
        <Text>
          <Trans
            i18nKey="premium.windDown.refund"
            components={[
              <InlineLink href={`mailto:${CONTACT_EMAIL}`} key="email" />,
            ]}
          />
        </Text>
        <ButtonWrapper>
          <Button
            wide
            action={() => {
              window.open(MANAGE_SUBSCRIPTION_URL, "_blank")?.focus();
            }}
          >
            {t("premium.manageSubscription")}
          </Button>
        </ButtonWrapper>
      </Popup>
    </>
  );
};

export default Premium;
