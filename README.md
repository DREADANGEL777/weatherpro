# WeatherPro

WeatherPro is a React + TypeScript + Vite weather application. Premium checkout uses Creem hosted checkout through a Cloudflare Pages Function.

## Creem setup

### 1. Create the products

Create two recurring products in Creem:

- Pro - maps to `CREEM_PRODUCT_PRO`
- Pro Plus - maps to `CREEM_PRODUCT_PRO_PLUS`

Use test mode first. Test and live Creem products and API keys are separate.

### 2. Configure local environment variables

Add these values to `.env`:

```env
CREEM_API_KEY=your_creem_api_key
CREEM_WEBHOOK_SECRET=your_creem_webhook_secret
CREEM_PRODUCT_PRO=your_pro_product_id
CREEM_PRODUCT_PRO_PLUS=your_pro_plus_product_id
CREEM_SUCCESS_URL=https://your-domain.com/?payment=success
CREEM_CANCEL_URL=https://your-domain.com/pricing?payment=cancelled
```

`CREEM_API_KEY` must not start with `VITE_`. Only server-side Cloudflare Functions may read it.

The checkout function is [functions/api/creem/checkout.ts](./functions/api/creem/checkout.ts). It sends the selected product, customer email, and Firebase user ID as Creem metadata, then returns the hosted checkout URL to [Pricing.tsx](./src/pages/Pricing/Pricing.tsx). The success URL automatically receives `checkout_id={checkout_id}` so the app can verify the completed purchase.

### 3. Deploy the frontend and function together

Deploy the repository as a Cloudflare Pages project. Cloudflare Pages automatically exposes:

```text
POST https://your-domain.com/api/creem/checkout
```

Add the same Creem variables in Cloudflare Pages -> Settings -> Environment variables. Add them separately for Preview and Production if you test both environments.

The Vite development server in this project includes a local `/api/creem/checkout` handler, so `npm run dev` can create test checkouts using the Creem values in `.env`. Restart Vite after changing `.env`.

For full local Pages Functions/webhook testing, use the Cloudflare Pages dev command configured for your project and make sure the variables are available to the local runtime.

### 4. Configure the Creem webhook

In Creem Dashboard -> Developers -> Webhooks, add:

```text
https://your-domain.com/api/creem/webhook
```

Subscribe to at least:

- `checkout.completed`
- `subscription.trialing`
- `subscription.active`
- `subscription.paid`
- `subscription.scheduled_cancel`
- `subscription.canceled`
- `subscription.expired`
- `subscription.paused`

Store the webhook secret as `CREEM_WEBHOOK_SECRET`. Verify the `creem-signature` HMAC-SHA256 signature against the raw request body before trusting any event.

### 5. Premium access after payment

After Creem redirects the user back, [SubscriptionContext.tsx](./src/context/SubscriptionContext.tsx) sends the checkout ID and Firebase user ID to [status.ts](./functions/api/creem/status.ts). The server retrieves the checkout from Creem, checks that the checkout metadata belongs to the signed-in user, and returns `pro` or `pro_plus`. The existing Premium feature guards then unlock immediately without trusting the browser success URL by itself.

The checkout ID is stored per Firebase user in browser storage, so Premium remains available after a refresh. The server re-verifies it against Creem on each app load.

### 6. Keep access synchronized with webhook events

On `subscription.trialing`, `subscription.active`, and `subscription.paid`:

1. Read `object.metadata.referenceId`.
2. Map the product ID to `pro` or `pro_plus`.
3. Store the user tier, Creem subscription ID, and current period end in your database.

On `subscription.expired` or `subscription.paused`, revoke access. For `subscription.scheduled_cancel`, keep access until the paid period ends.

The current client verifies the checkout with Creem after returning from payment. For production-grade cross-device access and webhook-driven cancellation handling, persist these events in your database and have [SubscriptionContext.tsx](./src/context/SubscriptionContext.tsx) read that server-side subscription record.

Do not unlock Premium based only on the browser success URL; the checkout status endpoint verifies the checkout with Creem before changing the tier.

### 7. Test the complete flow

1. Use a Creem test API key and test products.
2. Sign in with Google.
3. Open `/pricing` and select Pro or Pro Plus.
4. Confirm that the browser is redirected to Creem.
5. Complete a test checkout.
6. Confirm the webhook is received and signature validation passes.
7. Confirm the database tier changes and Premium features appear.
8. Test cancellation, expiration, failed payment, and returning to the cancel URL.

### 8. Switch to live payments

After testing, replace the test API key and product IDs with live values in Cloudflare Pages. Confirm your Creem business verification and payout setup are complete before accepting real payments.

## Development

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Important security notes

- Never put `CREEM_API_KEY` or `CREEM_WEBHOOK_SECRET` in a `VITE_*` variable.
- Never call Creem directly from the browser with the secret key.
- Validate the authenticated Firebase user on the server before creating checkout sessions in production.
- Make webhook processing idempotent using the Creem event ID so retries do not duplicate access changes.

Official references: [Creem API](https://docs.creem.io/api-reference), [Creem webhooks](https://docs.creem.io/code/webhooks), and [Creem integration guide](https://creem.io/SKILL.md).
