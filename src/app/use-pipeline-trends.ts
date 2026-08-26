import { useQuery } from "@tanstack/react-query";
import { PipelineTrendRow } from "../types/pipeline-data";

// The trends file is optional: the pipeline may not have written it yet.
// Any failure (network, 404, malformed JSON) degrades to failed with no
// rows instead of an error the page must catch.
const loadTrends = async (): Promise<PipelineTrendRow[]> => {
  const res = await fetch("/data/historical-trends.json");
  if (!res.ok) throw new Error(`historical-trends.json: ${res.status}`);
  const data = await res.json();
  // `date` is the one fixed field; the rest are the dynamic deck-name keys.
  const rows = data as unknown;
  if (
    !Array.isArray(rows) ||
    rows.some(
      (row) =>
        typeof row !== "object" ||
        row === null ||
        typeof (row as PipelineTrendRow).date !== "string"
    )
  ) {
    throw new Error("historical-trends.json has an invalid row shape");
  }
  return rows as PipelineTrendRow[];
};

const usePipelineTrends = () => {
  const query = useQuery<PipelineTrendRow[], Error>({
    queryKey: ["historical-trends"],
    retry: false,
    staleTime: Infinity,
    queryFn: loadTrends,
  });

  return {
    rows: query.data ?? [],
    isLoading: query.isPending,
    failed: query.isError,
  };
};

export default usePipelineTrends;
