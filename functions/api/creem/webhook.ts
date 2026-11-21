interface PagesContext {
  request: Request;
  env: Record<string, string | undefined>;
}

function toHex(bytes: ArrayBuffer): string {
  return [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function verifySignature(body: string, signature: string, secret: string): Promise<boolean> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const digest = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
  return toHex(digest) === signature;
}

export const onRequestPost = async ({ request, env }: PagesContext) => {
  const secret = env.CREEM_WEBHOOK_SECRET;
  const signature = request.headers.get("creem-signature");
  const body = await request.text();

  if (!secret || !signature || !(await verifySignature(body, signature, secret))) {
    return new Response("Invalid webhook signature", { status: 401 });
  }

  const event = JSON.parse(body) as { id?: string; eventType?: string };
  console.log("Verified Creem webhook", { id: event.id, eventType: event.eventType });

  // TODO: persist the event idempotently and update the user's subscription record.
  // Use metadata.referenceId to map the event to the Firebase user. Grant access
  // for subscription.trialing/active/paid and revoke it for expired/paused.
  return new Response("ok", { status: 200 });
};
