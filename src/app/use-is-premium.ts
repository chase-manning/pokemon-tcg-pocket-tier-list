import { getCurrentUserSubscriptions } from "@invertase/firestore-stripe-payments";
import { useEffect, useState } from "react";
import { payments } from "../config/firebase";
import { useAuth } from "../contexts/AuthContext";

const useIsPremium = () => {
  const [isPremium, setIsPremium] = useState<boolean | null>(null);
  const { user, loading } = useAuth();

  useEffect(() => {
    // During build-time prerendering, leave premium status unresolved (null) so
    // the prerendered HTML matches the client's initial hydration render and
    // avoids hydration mismatches on premium-dependent UI.
    const isPrerender =
      typeof navigator !== "undefined" &&
      /ReactSnap/i.test(navigator.userAgent);
    if (isPrerender) return;

    if (loading) return;
    if (!user) {
      setIsPremium(false);
      return;
    }
    // Count subscriptions that grant Premium access. "trialing" is essential:
    // new sign-ups start a 7-day free trial, so their subscription status is
    // "trialing" (not "active") until the trial ends and the first invoice is
    // paid. Filtering on "active" alone makes trialing users look non-premium,
    // which re-shows the upsell and sends them back through Stripe checkout,
    // some end up with duplicate subscriptions. "past_due" keeps access during
    // Stripe's payment-retry grace period instead of yanking it on a single
    // failed renewal.
    getCurrentUserSubscriptions(payments, {
      status: ["active", "trialing", "past_due"],
    })
      .then((subscriptions) => {
        setIsPremium(subscriptions.length > 0);
      })
      .catch((error) => {
        console.error(error);
        setIsPremium(false);
      });
  }, [user, loading]);

  return isPremium;
};

export default useIsPremium;
