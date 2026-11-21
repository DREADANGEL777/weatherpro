export type CreemPlan = "pro" | "proPlus";
export type CreemTier = "free" | "pro" | "pro_plus";

interface CreateCheckoutResponse {
  checkoutUrl?: string;
  checkout_url?: string;
  message?: string;
}

export async function createCreemCheckout(
  plan: CreemPlan,
  user: { uid: string; email: string | null },
): Promise<string> {
  const response = await fetch("/api/creem/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plan, userId: user.uid, email: user.email }),
  });
  const responseText = await response.text();
  let data: CreateCheckoutResponse = {};
  try {
    data = JSON.parse(responseText) as CreateCheckoutResponse;
  } catch {
    throw new Error(`Checkout endpoint returned HTTP ${response.status}.`);
  }
  if (!response.ok) throw new Error(data.message || "Unable to create Creem checkout.");
  const checkoutUrl = data.checkoutUrl || data.checkout_url;
  if (!checkoutUrl) throw new Error("Creem did not return a checkout URL.");
  return checkoutUrl;
}

interface CreemSubscriptionResponse {
  tier?: CreemTier;
  message?: string;
}

export async function getCreemSubscription(
  checkoutId: string,
  userId: string,
): Promise<CreemTier> {
  const params = new URLSearchParams({ checkout_id: checkoutId, user_id: userId });
  const response = await fetch(`/api/creem/status?${params.toString()}`);
  const data = (await response.json()) as CreemSubscriptionResponse;

  if (!response.ok) throw new Error(data.message || "Unable to verify Creem subscription.");

  return data.tier || "free";
}
