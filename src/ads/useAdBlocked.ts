import { useEffect, useState } from "react";
import { ADSENSE_SCRIPT_URL } from "./adsConfig";

// Detects an ad blocker by probing the ad script URL: a blocked script fires
// onerror on the injected element.
const probeAdScript = (timeoutMs = 2500): Promise<boolean> =>
  new Promise((resolve) => {
    if (typeof document === "undefined") {
      resolve(false);
      return;
    }

    const el = document.createElement("script");
    el.async = true;
    el.src = ADSENSE_SCRIPT_URL;

    let done = false;
    const cleanup = (blocked: boolean) => {
      if (done) return;
      done = true;
      window.clearTimeout(timer);
      el.removeEventListener("error", onError);
      el.removeEventListener("load", onLoad);
      el.remove();
      resolve(blocked);
    };

    const onError = () => cleanup(true);
    const onLoad = () => cleanup(false);
    const timer = window.setTimeout(() => cleanup(false), timeoutMs);

    el.addEventListener("error", onError);
    el.addEventListener("load", onLoad);

    document.head.appendChild(el);
  });

// Stays false until the probe resolves so the UI never flashes a false positive.
const useAdBlocked = (): boolean => {
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    probeAdScript().then((isBlocked) => {
      if (!cancelled) setBlocked(isBlocked);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return blocked;
};

export default useAdBlocked;