import styled from "styled-components";
import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import { useUI } from "../contexts/UIContext";
import useIsMobile from "../ads/useIsMobile";

const Nav = styled.nav<{ $open: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  @media (max-width: 900px) {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 60;
    flex-direction: column;
    align-items: stretch;
    gap: 0.25rem;
    background: var(--bg);
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
    padding: 1rem 1rem 1.5rem;
    opacity: ${(props) => (props.$open ? 1 : 0)};
    transform: ${(props) =>
      props.$open ? "translateY(0)" : "translateY(-0.5rem)"};
    visibility: ${(props) => (props.$open ? "visible" : "hidden")};
    pointer-events: ${(props) => (props.$open ? "auto" : "none")};
    transition: opacity 200ms ease-out, transform 200ms ease-out,
      visibility 200ms;
  }

  @media (max-width: 900px) and (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const NavItem = styled(NavLink)`
  font-size: 1.4rem;
  font-weight: 500;
  color: var(--main);
  padding: 0.375rem 1rem;
  border-radius: 0.375rem;
  white-space: nowrap;
  opacity: 0.7;
  transition: opacity 0.2s ease, background 0.2s ease;

  &.active {
    opacity: 1;
  }

  &:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.08);
  }

  @media (max-width: 900px) {
    width: 100%;
    text-align: left;
  }
`;

const Navbar = () => {
  const { t } = useTranslation();
  const { isNavOpen, toggleNav } = useUI();
  const isMobile = useIsMobile();

  const items = [
    { to: "/tier-list", label: t("header.tierList") },
    { to: "/deck", label: t("header.bestDeckFinder") },
    { to: "/cards-list", label: t("header.bestCards") },
    { to: "/expansion-list", label: t("header.bestExpansions") },
    { to: "/statistics", label: t("header.statistics") },
  ];

  // On desktop the nav stays in the header row. On mobile it is the animated
  // dropdown that opens only after the user taps the menu button.
  const open = !isMobile || isNavOpen;

  return (
    <Nav $open={open}>
      {items.map((item) => (
        <NavItem key={item.to} to={item.to} onClick={isMobile ? toggleNav : undefined}>
          {item.label}
        </NavItem>
      ))}
    </Nav>
  );
};

export default Navbar;