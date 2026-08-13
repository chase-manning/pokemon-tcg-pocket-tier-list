import { createContext, useState, ReactNode } from "react";
import { FREE_DECK_AMOUNT } from "../app/constants";

export enum SortBy {
  SCORE = "score",
  POPULARITY = "popularity",
  STRENGTH = "strength",
  WIN_RATE = "winRate",
}

interface FilterContextType {
  energy: string | null;
  setEnergy: (energy: string | null) => void;
  includeEx: boolean;
  setIncludeEx: (include: boolean) => void;
  deckAmount: number;
  setDeckAmount: (deckAmount: number) => void;
  sortBy: SortBy;
  setSortBy: (sortBy: SortBy) => void;
  expansion: string | null;
  setExpansion: (expansion: string | null) => void;
  latestExpansionCards: number | null;
  setLatestExpansionCards: (count: number | null) => void;
}

export const FilterContext = createContext<FilterContextType>({
  energy: null,
  setEnergy: () => { },
  includeEx: true,
  setIncludeEx: () => { },
  deckAmount: FREE_DECK_AMOUNT,
  setDeckAmount: () => { },
  sortBy: SortBy.SCORE,
  setSortBy: () => { },
  expansion: null,
  setExpansion: () => { },
  latestExpansionCards: null,
  setLatestExpansionCards: () => { },
});

interface Props {
  children: ReactNode;
}

const FilterContextProvider = ({ children }: Props) => {
  const [energy, setEnergy] = useState<string | null>(null);
  const [includeEx, setIncludeEx] = useState<boolean>(true);
  const [deckAmount, setDeckAmount] = useState<number>(FREE_DECK_AMOUNT);
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.SCORE);
  const [expansion, setExpansion] = useState<string | null>(null);
  const [latestExpansionCards, setLatestExpansionCards] = useState<number | null>(null);

  return (
    <FilterContext.Provider
      value={{
        energy,
        setEnergy: (energy) => {
          setEnergy(energy);
        },
        includeEx,
        setIncludeEx: (include) => {
          setIncludeEx(include);
        },
        deckAmount,
        setDeckAmount: (deckAmount) => {
          setDeckAmount(deckAmount);
        },
        sortBy,
        setSortBy: (sortBy: SortBy) => {
          setSortBy(sortBy);
        },
        expansion,
        setExpansion: (expansion) => {
          setExpansion(expansion);
        },
        latestExpansionCards,
        setLatestExpansionCards: (count) => {
          setLatestExpansionCards(count);
        },
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export default FilterContextProvider;
