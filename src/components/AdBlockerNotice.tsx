import styled from "styled-components";
import useAdBlocked from "../ads/useAdBlocked";
import { useTranslation } from "react-i18next";

const Notice = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 1.2rem 2rem;

  @media (max-width: 900px) {
    padding: 1rem 1.2rem;
  }
`;

const Card = styled.p`
  max-width: 97rem;
  margin: 0;
  font-size: 1.5rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.78);
  text-align: center;

  @media (max-width: 900px) {
    font-size: 1.3rem;
  }
`;

const Link = styled.a`
  color: var(--e);
  text-decoration: underline;
  font-weight: 500;

  &:hover {
    opacity: 0.8;
  }
`;

const UBLOCK_URL = "https://github.com/gorhill/uBlock#ublock-origin-ubo";
const PRIVACY_URL = "https://archive.is/4bjZ6";

const AdBlockerNotice = () => {
  const { t } = useTranslation();
  const blocked = useAdBlocked();
  if (!blocked) return null;

  return (
    <Notice>
      <Card>
        {t("adblocker.lead")}{" "}
        <Link href={PRIVACY_URL} target="_blank" rel="noopener noreferrer">
          {t("adblocker.respect")}
        </Link>
        {t("adblocker.recommend")}{" "}
        <Link href={UBLOCK_URL} target="_blank" rel="noopener noreferrer">
          uBlock Origin
        </Link>{" "}
        {t("adblocker.footer")}
      </Card>
    </Notice>
  );
};

export default AdBlockerNotice;