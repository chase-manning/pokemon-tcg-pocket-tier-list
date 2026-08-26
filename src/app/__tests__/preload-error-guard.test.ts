import { afterEach, describe, expect, it, vi } from "vitest";
import { handlePreloadError } from "../preload-reload-guard";

const fire = (reload: () => void) =>
  handlePreloadError({ preventDefault: () => {} }, reload);

afterEach(() => {
  sessionStorage.clear();
  vi.restoreAllMocks();
});

describe("vite:preloadError reload guard", () => {
  it("reloads once when storage works", () => {
    const reload = vi.fn();
    fire(reload);
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it("does not retry within ten seconds", () => {
    const reload = vi.fn();
    fire(reload);
    fire(reload);
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it("does not reload at all when storage is blocked", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    const reload = vi.fn();
    fire(reload);
    expect(reload).not.toHaveBeenCalled();
  });

  it("cannot loop across page lives when storage is blocked", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    const reload = vi.fn();
    // Each call stands for a fresh page life: module state is not shared.
    for (let i = 0; i < 5; i++) fire(reload);
    expect(reload).not.toHaveBeenCalled();
  });
});
