import styled from "styled-components";
import { useState, useRef, useEffect, KeyboardEvent } from "react";

const TooltipContainer = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  margin-left: 0.8rem;

  @media (max-width: 900px) {
    margin-left: 0.4rem;
  }
`;

const TooltipIcon = styled.div`
  width: 1.8rem;
  height: 1.8rem;
  border-radius: 50%;
  border: 1px solid var(--main);
  color: var(--main);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: help;
  opacity: 0.7;
  transition: opacity 0.2s ease;
  user-select: none;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    opacity: 1;
  }

  @media (max-width: 900px) {
    width: 1.6rem;
    height: 1.6rem;
    font-size: 1.1rem;
  }
`;

const TooltipContent = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 100%;
  margin-bottom: 0.8rem;
  background: var(--bg);
  border: 1px solid var(--main);
  padding: 1.2rem;
  border-radius: 0.4rem;
  font-size: 1.6rem;
  color: var(--main);
  opacity: ${(props) => (props.$isVisible ? 1 : 0)};
  visibility: ${(props) => (props.$isVisible ? "visible" : "hidden")};
  transition: all 0.2s ease;
  z-index: 1000;
  width: 30rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 0.6rem;
    border-style: solid;
    border-color: var(--main) transparent transparent transparent;
  }

  @media (max-width: 900px) {
    width: 24rem;
    font-size: 1.4rem;
    padding: 1rem;
    margin-bottom: 0.6rem;
  }
`;

interface Props {
  text: string;
}

const Tooltip = ({ text }: Props) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    };

    const handleScroll = () => {
      if (isVisible) {
        setIsVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("scroll", handleScroll, { capture: true, passive: true });

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", handleScroll, { capture: true });
    };
  }, [isVisible]);

  const handleToggle = () => {
    setIsVisible(!isVisible);
  };

  return (
    <TooltipContainer ref={tooltipRef}>
      <TooltipIcon
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={handleToggle}
        role="button"
        aria-label="Show tooltip"
        tabIndex={0}
        onKeyDown={(e: KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggle();
          }
        }}
      >
        ?
      </TooltipIcon>
      <TooltipContent $isVisible={isVisible}>{text}</TooltipContent>
    </TooltipContainer>
  );
};

export default Tooltip;
