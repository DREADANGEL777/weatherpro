import type { CustomerInfo, Package } from "@revenuecat/purchases-js";

export interface SubscriptionState {
  isPremium: boolean;
  loading: boolean;
  purchasing: boolean;
  error: string | null;
  customerInfo: CustomerInfo | null;
  packages: Package[];
}
