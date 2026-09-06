import { useQuery } from "@tanstack/react-query";
import { EXPANSIONS_URL } from "./constants";

export interface PackType {
  id: string;
  name: string;
  image: string;
}

export interface ExpansionType {
  id: string;
  name: string;
  packs: PackType[];
}

const ALL_EXPANSIONS = EXPANSIONS_URL as unknown as ExpansionType[];

/// The newest expansion name, taken from the last entry of the package's
/// ordered list so the banner and stats copy track the live meta without a
/// hardcoded constant.
export const latestExpansionName = (): string | null => {
  const last = ALL_EXPANSIONS[ALL_EXPANSIONS.length - 1];
  return last ? last.name : null;
};

const useExpansions = (): ExpansionType[] | null => {
  const { data: expansions } = useQuery({
    queryKey: ["expansions"],
    queryFn: async () => ALL_EXPANSIONS,
  });

  if (!expansions) return null;

  return expansions.filter(
    (expansion: ExpansionType) => expansion.id !== "promo" && expansion.id !== "a4b"
  );
};

export default useExpansions;
