import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { CustomerInfo, Package } from "@revenuecat/purchases-js";

import { getRevenueCat, initializeRevenueCat } from "../services/revenuecat";

interface SubscriptionContextValue {
  isPremium: boolean;
  loading: boolean;
  purchasing: boolean;
  error: string | null;
  customerInfo: CustomerInfo | null;
  packages: Package[];

  refreshCustomerInfo: () => Promise<void>;
  purchasePackage: (selectedPackage: Package) => Promise<boolean>;
}

const SubscriptionContext = createContext<SubscriptionContextValue | null>(
  null,
);

interface SubscriptionProviderProps {
  children: ReactNode;
}

export function SubscriptionProvider({ children }: SubscriptionProviderProps) {
  const [isPremium, setIsPremium] = useState(false);

  const [loading, setLoading] = useState(true);

  const [purchasing, setPurchasing] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);

  const [packages, setPackages] = useState<Package[]>([]);

  const refreshCustomerInfo = useCallback(async () => {
    const purchases = getRevenueCat();

    if (!purchases) {
      setLoading(false);
      return;
    }

    try {
      setError(null);

      const info = await purchases.getCustomerInfo();

      setCustomerInfo(info);

      setIsPremium("premium" in info.entitlements.active);
    } catch (err) {
      console.error("Failed to get RevenueCat customer info:", err);

      setError("Не вдалося отримати статус підписки.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadOfferings = useCallback(async () => {
    const purchases = getRevenueCat();

    if (!purchases) {
      return;
    }

    try {
      const offerings = await purchases.getOfferings();

      if (offerings.current && offerings.current.availablePackages.length > 0) {
        setPackages(offerings.current.availablePackages);
      } else {
        setPackages([]);
      }
    } catch (err) {
      console.error("Failed to get RevenueCat offerings:", err);

      setError("Не вдалося завантажити Premium плани.");
    }
  }, []);

  const purchasePackage = useCallback(async (selectedPackage: Package) => {
    const purchases = getRevenueCat();

    if (!purchases) {
      setError("RevenueCat ще не налаштований.");

      return false;
    }

    try {
      setPurchasing(true);
      setError(null);

      const result = await purchases.purchase({
        rcPackage: selectedPackage,
      });

      const info = result.customerInfo;

      setCustomerInfo(info);

      const premiumActive = "premium" in info.entitlements.active;

      setIsPremium(premiumActive);

      return premiumActive;
    } catch (err) {
      console.error("RevenueCat purchase failed:", err);

      setError("Не вдалося завершити покупку.");

      return false;
    } finally {
      setPurchasing(false);
    }
  }, []);

  useEffect(() => {
    initializeRevenueCat();

    void refreshCustomerInfo();
    void loadOfferings();
  }, [refreshCustomerInfo, loadOfferings]);

  const value = useMemo(
    () => ({
      isPremium,
      loading,
      purchasing,
      error,
      customerInfo,
      packages,
      refreshCustomerInfo,
      purchasePackage,
    }),
    [
      isPremium,
      loading,
      purchasing,
      error,
      customerInfo,
      packages,
      refreshCustomerInfo,
      purchasePackage,
    ],
  );

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export { SubscriptionContext };
