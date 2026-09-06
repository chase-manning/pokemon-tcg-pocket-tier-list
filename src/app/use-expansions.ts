import { useQuery } from "@tanstack/react-query";
import { EXPANSIONS_URL } from "./constants";

export interface PackType {
  id: string;
  name: string;
  image: string | null;
}

export interface ExpansionType {
  id: string;
  name: string;
  packs: PackType[];
}

/// Deluxe/reprint packs the app never treats as the "current" meta set.
/// a4b (and its future counterpart b4b) repackage existing cards, so they are
/// kept out of the expansion list and the latest-name lookup. Promo splits
/// (pa/pb) stay eligible: they carry exclusive cards such as Ultra Necrozma ex.
const EXCLUDED_IDS = new Set(["a4b"]);

const ALL_EXPANSIONS = EXPANSIONS_URL as unknown as ExpansionType[];

/// The newest eligible expansion name, taken from the last non-excluded entry
/// of the package's ordered list so the banner and stats copy track the live
/// meta without a hardcoded constant. Returns null when nothing survives.
export const latestExpansionName = (): string | null => {
  for (let i = ALL_EXPANSIONS.length - 1; i >= 0; i--) {
    const expansion = ALL_EXPANSIONS[i];
    if (expansion && !EXCLUDED_IDS.has(expansion.id)) {
      return expansion.name;
    }
  }
  return null;
};

const useExpansions = (): ExpansionType[] | null => {
  const { data: expansions } = useQuery({
    queryKey: ["expansions"],
    queryFn: async () => ALL_EXPANSIONS,
  });

  if (!expansions) return null;

  return expansions.filter(
    (expansion: ExpansionType) => !EXCLUDED_IDS.has(expansion.id)
  );
};

export default useExpansions;
