import { afterEach, beforeEach, describe, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import usePipelineTrends from "../use-pipeline-trends";

const Probe = () => {
  const { rows, isLoading, failed } = usePipelineTrends();
  return (
    <p>
      {isLoading ? "loading" : failed ? "failed" : `rows:${rows.length}`}
    </p>
  );
};

let queryClient: QueryClient;

beforeEach(() => {
  queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(new Response("[]", { status: 200 }))
  );
});

afterEach(() => {
  queryClient.clear();
  vi.unstubAllGlobals();
});

const renderProbe = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <Probe />
    </QueryClientProvider>
  );

describe("usePipelineTrends", () => {
  it("returns the rows from a well-formed payload", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify([
            { date: "2026-08-25", "hoopa-ex-b4-103": 6.2 },
            { date: "2026-08-26", "hoopa-ex-b4-103": 7.1 },
          ]),
          { status: 200 }
        )
      )
    );

    renderProbe();
    await screen.findByText("rows:2");
  });

  it("reports failed on a 404", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("nope", { status: 404 }))
    );

    renderProbe();
    await screen.findByText("failed");
  });

  it("reports failed on malformed JSON instead of throwing", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ notAnArray: true }), { status: 200 })
      )
    );

    renderProbe();
    await screen.findByText("failed");
  });

  it.each([[null], [{}], [{ date: 5 }]])(
    "reports failed on an invalid row (%j)",
    async (badRow) => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(
          new Response(JSON.stringify([badRow]), { status: 200 })
        )
      );

      renderProbe();
      await screen.findByText("failed");
    }
  );
});
