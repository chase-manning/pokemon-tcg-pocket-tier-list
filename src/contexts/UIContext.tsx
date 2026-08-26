import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from "react";

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

  const toggleNav = useCallback(() => setIsNavOpen((open) => !open), []);

  const value = useMemo(() => ({ isNavOpen, toggleNav }), [isNavOpen, toggleNav]);

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
};

const useUI = () => useContext(UIContext);

export { UIProvider, useUI, UIContext };