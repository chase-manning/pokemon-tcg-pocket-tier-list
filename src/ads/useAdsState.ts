import useIsPremium from "../app/use-is-premium";
import { ADS_ENABLED, IS_DEV } from "./adsConfig";
import { useContentReady } from "./ContentReadyContext";

export interface AdsState {
  // Premium status has resolved (avoids rendering then yanking ads).
  resolved: boolean;
  // Whether any ad UI (real or dev placeholder) should render.
  showAds: boolean;
  // Whether to load real AdSense ads vs a dev placeholder.
  useReal: boolean;
}

// Single source of truth for ad gating. Nothing renders unless ADS_ENABLED is
// on; beyond that, ads are hidden for Premium users (ad-free is a Premium
// benefit) and never rendered until premium status is known. Development shows
// placeholders in place of real AdSense units.
const useAdsState = (): AdsState => {
  const isPremium = useIsPremium();
  const contentReady = useContentReady();
  const resolved = isPremium !== null;
  const isFree = resolved && !isPremium;

  // Only show ads once the current page has rendered real content, so ads never
  // appear on loading, error, or content-less screens (AdSense policy).
  const showAds = ADS_ENABLED && isFree && contentReady;
  const useReal = showAds && !IS_DEV;

  return { resolved, showAds, useReal };
};

export default useAdsState;
