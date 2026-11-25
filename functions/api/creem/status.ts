interface PagesContext {
  request: Request;
  env: Record<string, string | undefined>;
}

interface CreemCheckout {
  status?: string;
  created_at?: string | number;
  completed_at?: string | number;
  paid_at?: string | number;
  product?: string | { id?: string };
  metadata?: Record<string, string | undefined>;
  order?: { status?: string; created_at?: string | number; paid_at?: string | number };
  subscription?: { status?: string; started_at?: string | number };
}

const ACCESS_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

function getPaidAt(checkout: CreemCheckout): number | null {
  const value = checkout.paid_at
    ?? checkout.completed_at
    ?? checkout.order?.paid_at
    ?? checkout.subscription?.started_at
    ?? checkout.order?.created_at
    ?? checkout.created_at;
  if (value === undefined) return null;
  const parsedTimestamp = typeof value === "number" ? value : Date.parse(value);
  const timestamp = parsedTimestamp > 0 && parsedTimestamp < 1_000_000_000_000
    ? parsedTimestamp * 1000
    : parsedTimestamp;
  return Number.isFinite(timestamp) ? timestamp : null;
}

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { "Content-Type": "application/json" },
});

async function getCreemError(response: Response): Promise<string> {
  const text = await response.text();
  try {
    const body = JSON.parse(text) as {
      message?: string;
      error?: string;
      detail?: string;
      trace_id?: string;
    };
    const reason = body.message ?? body.error ?? body.detail ?? "Unknown Creem error";
    return body.trace_id ? `${reason} (trace_id: ${body.trace_id})` : reason;
  } catch {
    return text.slice(0, 240) || "Unknown Creem error";
  }
}

export const onRequestGet = async ({ request, env }: PagesContext) => {
  const apiKey = env.CREEM_API_KEY;
  const url = new URL(request.url);
  const checkoutId = url.searchParams.get("checkout_id");
  const userId = url.searchParams.get("user_id");

  if (!apiKey || !checkoutId || !userId) {
    return json({ message: "checkout_id and user_id are required." }, 400);
  }

  const apiBase = apiKey.startsWith("creem_test_")
    ? "https://test-api.creem.io"
    : "https://api.creem.io";
  const creemResponse = await fetch(
    `${apiBase}/v1/checkouts?checkout_id=${encodeURIComponent(checkoutId)}`,
    { headers: { "x-api-key": apiKey } },
  );

  if (!creemResponse.ok) {
    const reason = await getCreemError(creemResponse);
    console.error("Creem checkout verification failed", {
      status: creemResponse.status,
      checkoutId,
      reason,
    });
    return json({
      message: `Creem checkout could not be verified (${creemResponse.status}): ${reason}`,
    }, 502);
  }

  const checkout = (await creemResponse.json()) as CreemCheckout;
  if (checkout.metadata?.referenceId !== userId) {
    return json({ message: "This checkout does not belong to the signed-in user." }, 403);
  }

  const isPaid = checkout.status === "completed" || checkout.order?.status === "paid";
  const subscriptionStatus = checkout.subscription?.status;
  const isActive = ["active", "trialing", "paid"].includes(subscriptionStatus || "");

  if (!isPaid || (checkout.subscription && !isActive)) {
    return json({ tier: "free" });
  }

  const paidAt = getPaidAt(checkout);
  if (paidAt === null) {
    console.error("Creem checkout has no payment timestamp", { checkoutId });
    return json({ tier: "free" });
  }

  const expiresAt = paidAt + ACCESS_DURATION_MS;
  if (Date.now() >= expiresAt) return json({ tier: "free", expiresAt: new Date(expiresAt).toISOString() });

  const productId = typeof checkout.product === "string" ? checkout.product : checkout.product?.id;
  const tier = productId === env.CREEM_PRODUCT_PRO_PLUS ? "pro_plus"
    : productId === env.CREEM_PRODUCT_PRO ? "pro" : "free";

  return json({ tier, expiresAt: new Date(expiresAt).toISOString() });
};
