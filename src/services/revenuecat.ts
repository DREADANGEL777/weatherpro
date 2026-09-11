import { Purchases } from "@revenuecat/purchases-js";

const REVENUECAT_API_KEY = import.meta.env.VITE_REVENUECAT_PUBLIC_API_KEY;

let purchases: Purchases | null = null;

export function initializeRevenueCat(): Purchases | null {
  if (purchases) {
    return purchases;
  }

  if (!REVENUECAT_API_KEY) {
    console.warn("RevenueCat API key is not configured.");

    return null;
  }

  purchases = Purchases.configure({
    apiKey: REVENUECAT_API_KEY,
    appUserId: null,
  });

  return purchases;
}

export function getRevenueCat(): Purchases | null {
  return purchases;
}
