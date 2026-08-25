import { afterEach, describe, expect, it, vi } from "vitest";

// Mirrors the vite:preloadError handler in src/index.tsx, which cannot be
// imported here because importing it mounts React.
describe("vite:preloadError reload guard", () => {
  const reloadSpy = vi.fn();
  let remove: (() => void) | null = null;

  const loadHandler = () => {
    let reloadedAt = 0;
    const RELOAD_STAMP = "chunk-reload-at";
    const handler = (event: { preventDefault: () => void }) => {
      event.preventDefault();
      let last = reloadedAt;
      try {
        last = Number(sessionStorage.getItem(RELOAD_STAMP) ?? reloadedAt);
        if (Date.now() - last < 10000) return;
        sessionStorage.setItem(RELOAD_STAMP, String(Date.now()));
      } catch {
        if (Date.now() - last < 10000) return;
        reloadedAt = Date.now();
      }
      reloadSpy();
    };
    window.addEventListener("vite:preloadError", handler);
    return () => window.removeEventListener("vite:preloadError", handler);
  };

  const firePreloadError = () => {
    window.dispatchEvent(
      new Event("vite:preloadError") as unknown as Event & {
        preventDefault: () => void;
      }
    );
  };

  afterEach(() => {
    remove?.();
    remove = null;
    sessionStorage.clear();
    reloadSpy.mockClear();
    vi.restoreAllMocks();
  });

  it("reloads once when storage works", () => {
    remove = loadHandler();
    firePreloadError();
    expect(reloadSpy).toHaveBeenCalledTimes(1);
  });

  it("does not retry within ten seconds when storage works", () => {
    remove = loadHandler();
    firePreloadError();
    firePreloadError();
    expect(reloadSpy).toHaveBeenCalledTimes(1);
  });

  it("falls back to an in-memory stamp and still throttles when storage is blocked", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    remove = loadHandler();
    for (let i = 0; i < 5; i++) {
      firePreloadError();
    }
    expect(reloadSpy).toHaveBeenCalledTimes(1);
  });
});
