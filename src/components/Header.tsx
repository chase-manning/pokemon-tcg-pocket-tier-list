import styled from "styled-components";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import Socials from "./Socials";
import Navbar from "./Navbar";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import UserAccount from "./UserAccount";
import { useUI } from "../contexts/UIContext";
import useIsMobile from "../ads/useIsMobile";
import menuIcon from "../assets/menu.svg";
import closeIcon from "../assets/close.svg";

const StyledHeader = styled.div<{ $footer?: boolean }>`
  width: 100%;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  position: relative;
  margin-bottom: ${(props) => (props.$footer ? "2rem" : "0")};

  @media (max-width: 900px) {
    gap: 1rem;
    padding: ${(props) => (props.$footer ? "2rem" : "0.75rem 1rem")};
    margin-bottom: ${(props) => (props.$footer ? "2rem" : "1rem")};
    /* On mobile the nav is absolutely positioned, so a grid middle column
       would overflow: flex keeps the logo and actions at opposite edges. */
    display: flex;
    justify-content: space-between;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 900px) {
    gap: 1rem;
  }
`;

const MenuButton = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  border-radius: 0.75rem;
  color: var(--main);
  cursor: pointer;
  background: rgba(255, 255, 255, 0.06);
  transition: background 150ms ease-in-out;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
  }

  @media (max-width: 900px) {
    display: flex;
  }
`;

const MenuIcon = styled.img`
  width: 2.4rem;
  height: 2.4rem;
`;

const FooterBar = styled.footer`
  width: 100%;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  margin-top: 4rem;
  padding: 0 2rem;
`;

const FooterBarInner = styled.div`
  width: 100%;
  max-width: 150rem;
  margin: 0 auto;
  padding: 1.5rem 0 2.5rem;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
`;

const FooterLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 2.4rem;
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

const FooterTools = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 900px) {
    gap: 1.6rem;
  }
`;

interface Props {
  footer?: boolean;
}

const Header = ({ footer }: Props) => {
  const { t } = useTranslation();
  const { isNavOpen, toggleNav } = useUI();
  const isMobile = useIsMobile();

  return (
    <>
      <StyledHeader $footer={footer}>
        <Logo />
        <Navbar />
        {!footer && (
          <RightSection>
            <UserAccount />
            {isMobile && (
              <MenuButton
                onClick={toggleNav}
                aria-expanded={isNavOpen}
                aria-label={isNavOpen ? "Close menu" : "Open menu"}
              >
                <MenuIcon
                  src={isNavOpen ? closeIcon : menuIcon}
                  alt=""
                />
              </MenuButton>
            )}
          </RightSection>
        )}
      </StyledHeader>
      {footer && (
        <FooterBar>
          <FooterBarInner>
            <FooterLinks>
              <FooterLink to="/about">{t("footer.about")}</FooterLink>
              <FooterLink to="/privacy">{t("footer.privacy")}</FooterLink>
            </FooterLinks>
            <FooterTools>
              <LanguageSwitcher />
              <Socials />
            </FooterTools>
          </FooterBarInner>
        </FooterBar>
      )}
    </>
  );
};

export default Header;