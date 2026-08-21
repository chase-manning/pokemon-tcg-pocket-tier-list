import { createContext, useContext, useState, ReactNode } from "react";

interface UIContextType {
  isNavOpen: boolean;
  toggleNav: () => void;
}

const UIContext = createContext<UIContextType>({
  isNavOpen: false,
  toggleNav: () => {},
});

const UIProvider = ({ children }: { children: ReactNode }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => setIsNavOpen((open) => !open);

  return (
    <UIContext.Provider value={{ isNavOpen, toggleNav }}>
      {children}
    </UIContext.Provider>
  );
};

const useUI = () => useContext(UIContext);

export { UIProvider, useUI, UIContext };