interface PagesContext {
  request: Request;
  env: Record<string, string | undefined>;
}

interface CreemCheckout {
  status?: string;
  product?: string | { id?: string };
  metadata?: Record<string, string | undefined>;
  order?: { status?: string };
  subscription?: { status?: string };
}

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { "Content-Type": "application/json" },
});

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
    return json({ message: "Creem checkout could not be verified." }, 502);
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

  const productId = typeof checkout.product === "string" ? checkout.product : checkout.product?.id;
  const tier = productId === env.CREEM_PRODUCT_PRO_PLUS ? "pro_plus"
    : productId === env.CREEM_PRODUCT_PRO ? "pro" : "free";

  return json({ tier });
};
