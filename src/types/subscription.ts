import type { CustomerInfo, Package } from "@revenuecat/purchases-js";

export interface SubscriptionState {
  tier: "free" | "pro" | "pro_plus"
  hasPro: boolean
  hasProPlus: boolean;
  expiresAt: string | null;
  loading: boolean;
  purchasing: boolean;
  error: "config" | "load" | "purchase" | null;
  customerInfo: CustomerInfo | null;
  packages: Package[];
}
