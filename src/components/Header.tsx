import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";
import Socials from "./Socials";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import UserAccount from "./UserAccount";
import { useAuth } from "../contexts/AuthContext";

const StyledHeader = styled.div<{ $footer?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 2rem;
  position: relative;
  margin-bottom: ${(props) => (props.$footer ? "2rem" : "0")};

  @media (max-width: 768px) {
    padding: ${(props) => (props.$footer ? "0 2rem" : "0")};
    margin-bottom: ${(props) => (props.$footer ? "2rem" : "5rem")};
  }
`;

const Nav = styled.nav`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 4rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavItem = styled(Link)<{ $active: boolean }>`
  font-size: 1.8rem;
  font-weight: 500;
  color: var(--main);
  text-decoration: none;
  opacity: ${(props) => (props.$active ? 1 : 0.7)};
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 900px) {
    gap: 1rem;
    flex-direction: column;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 900px) {
    gap: 1.6rem;
  }
`;

const FooterLink = styled(Link)`
  font-size: 1.4rem;
  font-weight: 500;
  color: var(--main);
  opacity: 0.7;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }
`;

interface Props {
  footer?: boolean;
}

const Header = ({ footer }: Props) => {
  const location = useLocation();
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <StyledHeader $footer={footer}>
      <Logo />
      <Nav>
        <NavItem to="/tier-list" $active={location.pathname === "/tier-list"}>
          {t("header.tierList")}
        </NavItem>
        <NavItem to="/deck" $active={location.pathname.startsWith("/deck")}>
          {t("header.bestDeckFinder")}
        </NavItem>
        <NavItem to="/cards-list" $active={location.pathname === "/cards-list"}>
          {t("header.bestCards")}
        </NavItem>
      </Nav>
      <RightSection>
        {footer && (
          <FooterLinks>
            <FooterLink to="/about">{t("footer.about")}</FooterLink>
            <FooterLink to="/privacy">{t("footer.privacy")}</FooterLink>
          </FooterLinks>
        )}
        {footer && <LanguageSwitcher />}
        {(!user || footer) && <Socials />}
        {!footer && <UserAccount />}
      </RightSection>
    </StyledHeader>
  );
};

export default Header;
