import { Purchases } from "@revenuecat/purchases-js";

const REVENUECAT_API_KEY = import.meta.env.VITE_REVENUECAT_PUBLIC_API_KEY;

export function isRevenueCatConfigured(): boolean {
  return Boolean(REVENUECAT_API_KEY);
}

// Links the RevenueCat customer to the Firebase uid so entitlements follow the account.
export function initializeRevenueCat(appUserId: string): Purchases | null {
  if (!REVENUECAT_API_KEY) {
    console.warn("RevenueCat API key is not configured.");

    return null;
  }

  if (Purchases.isConfigured()) {
    const instance = Purchases.getSharedInstance();

    if (instance.getAppUserId() === appUserId) {
      return instance;
    }
  }

  return Purchases.configure({
    apiKey: REVENUECAT_API_KEY,
    appUserId,
  });
}
