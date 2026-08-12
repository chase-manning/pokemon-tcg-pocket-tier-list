import { useState } from "react";
import styled from "styled-components";
import { Trans, useTranslation } from "react-i18next";
import Popup from "./Popup";
import {
  CARDS_REPO_URL,
  CONTACT_EMAIL,
  MANAGE_SUBSCRIPTION_URL,
} from "../app/constants";

// The full note opens by itself on a visitor's first load. After that the
// banner is the way back in, so returning visitors aren't interrupted.
const SEEN_KEY = "farewell-notice-seen";

const hasSeenNotice = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(SEEN_KEY) === "true";
  } catch {
    return false;
  }
};

const Banner = styled.button`
  position: sticky;
  top: 0;
  z-index: 950;
  width: 100%;
  padding: 1.2rem 2rem;
  cursor: pointer;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--bg);
  background: linear-gradient(
    90deg,
    var(--s),
    var(--a),
    var(--b),
    var(--c),
    var(--d),
    var(--e)
  );

  @media (max-width: 900px) {
    padding: 1rem 1.2rem;
    font-size: 1.3rem;
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

const SectionTitle = styled.h3`
  margin: 1rem 0 0;
  font-size: 2.1rem;
  font-weight: 600;
  color: var(--e);

  @media (max-width: 900px) {
    font-size: 1.8rem;
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

const SignOff = styled(Text)`
  font-weight: 600;
`;

const Signature = styled(Text)`
  opacity: 0.7;
`;

const FarewellNotice = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(() => !hasSeenNotice());

  const close = () => {
    setIsOpen(false);
    try {
      window.localStorage.setItem(SEEN_KEY, "true");
    } catch {
      // Blocked storage just means the note greets them again next visit.
    }
  };

  const mailLink = (
    <InlineLink href={`mailto:${CONTACT_EMAIL}`} key="email" />
  );

  return (
    <>
      <Banner onClick={() => setIsOpen(true)}>{t("farewell.banner")}</Banner>
      <Popup
        width="72rem"
        isOpen={isOpen}
        header="farewell.title"
        close={close}
      >
        <Text>{t("farewell.intro")}</Text>
        <Text>{t("farewell.enjoyed")}</Text>
        <Text>{t("farewell.why")}</Text>
        <Text>{t("farewell.thanks")}</Text>

        <SectionTitle>{t("farewell.takeover.title")}</SectionTitle>
        <Text>
          <Trans
            i18nKey="farewell.takeover.body"
            components={[
              mailLink,
              <InlineLink
                href={CARDS_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                key="cards-api"
              />,
            ]}
          />
        </Text>

        <SectionTitle>{t("farewell.premium.title")}</SectionTitle>
        <Text>{t("farewell.premium.status")}</Text>
        <Text>
          <Trans
            i18nKey="farewell.premium.cancel"
            components={[
              <InlineLink
                href={MANAGE_SUBSCRIPTION_URL}
                target="_blank"
                rel="noopener noreferrer"
                key="billing"
              />,
            ]}
          />
        </Text>
        <Text>
          <Trans i18nKey="farewell.premium.refund" components={[mailLink]} />
        </Text>

        <SignOff>{t("farewell.signOff")}</SignOff>
        <Signature>{t("farewell.signature")}</Signature>
      </Popup>
    </>
  );
};

export default FarewellNotice;
