import { useQuery } from "@tanstack/react-query";
import { getCurrentUserSubscriptions } from "@invertase/firestore-stripe-payments";
import { useEffect, useState } from "react";
import { payments } from "../config/firebase";
import { useAuth } from "../contexts/AuthContext";

const useIsPremium = () => {
  const [failedUid, setFailedUid] = useState<string | null>(null);
  const { user, loading } = useAuth();

  // Count subscriptions that grant Premium access. "trialing" is essential:
  // new sign-ups start a 7-day free trial, so their subscription status is
  // "trialing" (not "active") until the trial ends and the first invoice is
  // paid. Filtering on "active" alone makes trialing users look non-premium,
  // which re-shows the upsell and sends them back through Stripe checkout,
  // some end up with duplicate subscriptions. "past_due" keeps access during
  // Stripe's payment-retry grace period instead of yanking it on a single
  // failed renewal.
  const query = useQuery<boolean, Error>({
    queryKey: ["premium", user?.uid ?? null],
    enabled: !loading && !!user,
    retry: false,
    queryFn: async () => {
      const subscriptions = await getCurrentUserSubscriptions(payments, {
        status: ["active", "trialing", "past_due"],
      });
      return subscriptions.length > 0;
    },
  });

  useEffect(() => {
    if (query.error) setFailedUid(user?.uid ?? null);
  }, [query.error, user?.uid]);

  if (query.error && failedUid !== user?.uid) console.error(query.error);

  if (loading) return null;
  if (!user || failedUid === user?.uid) return false;
  return query.isPending ? null : (query.data ?? false);
};

export default useIsPremium;
