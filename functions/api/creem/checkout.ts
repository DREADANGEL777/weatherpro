interface CheckoutRequest {
  plan?: "pro" | "proPlus";
  userId?: string;
  email?: string | null;
}

interface PagesContext {
  request: Request;
  env: Record<string, string | undefined>;
}

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { "Content-Type": "application/json" },
});

export const onRequestPost = async ({ request, env }: PagesContext) => {
  const apiKey = env.CREEM_API_KEY;
  const successUrl = env.CREEM_SUCCESS_URL;
  if (!apiKey || !successUrl) {
    return json({ message: "Creem server configuration is incomplete." }, 500);
  }

  let body: CheckoutRequest;
  try { body = (await request.json()) as CheckoutRequest; }
  catch { return json({ message: "Invalid request body." }, 400); }

  if (!body.plan || !body.userId || !body.email) {
    return json({ message: "plan, userId, and email are required." }, 400);
  }

  const productId = body.plan === "pro" ? env.CREEM_PRODUCT_PRO : env.CREEM_PRODUCT_PRO_PLUS;
  if (!productId) return json({ message: `No Creem product configured for ${body.plan}.` }, 500);

  const apiBase = apiKey.startsWith("creem_test_")
    ? "https://test-api.creem.io"
    : "https://api.creem.io";
  const creemResponse = await fetch(`${apiBase}/v1/checkouts`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": apiKey },
    body: JSON.stringify({
      product_id: productId,
      // Creem appends checkout_id and order_id to the success URL automatically.
      success_url: successUrl,
      customer: { email: body.email },
      metadata: { referenceId: body.userId, plan: body.plan },
    }),
  });

  const result = (await creemResponse.json()) as { checkout_url?: string; message?: string };
  if (!creemResponse.ok || !result.checkout_url) {
    console.error("Creem checkout creation failed", { status: creemResponse.status, message: result.message });
    return json({ message: "Creem could not create the checkout." }, 502);
  }
  return json({ checkoutUrl: result.checkout_url });
};
