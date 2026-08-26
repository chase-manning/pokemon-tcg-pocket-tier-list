const RELOAD_STAMP = "chunk-reload-at";
const THROTTLE_MS = 10000;

/**
 * A deploy replaces every hashed chunk, so a tab opened before it asks for a
 * filename the host no longer has. One reload picks up the new manifest.
 *
 * The stamp is what stops a genuinely missing chunk looping. It has to survive
 * the reload to do that, so when storage is unavailable we do not reload at all
 * and let the error boundary surface the failure instead.
 */
export const handlePreloadError = (
  event: { preventDefault: () => void },
  reload: () => void = () => window.location.reload()
): void => {
  try {
    const last = Number(sessionStorage.getItem(RELOAD_STAMP) ?? 0);
    if (Date.now() - last < THROTTLE_MS) return;
    sessionStorage.setItem(RELOAD_STAMP, String(Date.now()));
  } catch {
    return;
  }
  event.preventDefault();
  reload();
};
