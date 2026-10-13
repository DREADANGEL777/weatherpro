# WeatherPro: run and test

## 1. Install and run

```bash
npm install
npm run dev
```

Open http://localhost:5173/. Without any keys the weather page works, but sign-in and checkout do not, and the forecast and hourly chart stay locked (Free plan).

## 2. Firebase (authentication)

1. Create a project in the Firebase console.
2. Authentication > Sign-in method > enable **Google**.
3. Authentication > Settings > Authorized domains: make sure `localhost` is listed.
4. Project settings > Your apps > add a **Web app** and copy its config.
5. Put the values in `.env`:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
```

## 3. RevenueCat (billing)

1. Create a RevenueCat project and add a **Web Billing** app (connect Stripe in test mode).
2. In the RevenueCat Billing product catalog, create two monthly subscription products with identifiers `premium` and `premium_plus`. Set their customer-facing names to **WeatherPro Premium** and **WeatherPro Premium+**.
3. Create entitlements `pro` and `pro_plus`; attach product `premium` to `pro`, and product `premium_plus` to `pro_plus`.
4. Create an offering and mark it **current**. Add two custom packages with identifiers `premium` and `premium_plus`, attaching the matching product to each package. The app looks up packages by these identifiers.
5. Copy the app's **public API key** (the Web Billing sandbox key while testing) into `.env`:

```
VITE_REVENUECAT_PUBLIC_API_KEY=
```

Restart `npm run dev` after editing `.env`.

## 4. Test flow

1. Open `/`. The forecast and chart are locked (Free plan).
2. Click **Sign in** in the header and log in with Google. The button changes to **Sign out**.
3. Open `/pricing`. Free, Premium and Premium+ cards show; prices come from RevenueCat.
4. Click **Get Premium** or **Get Premium+**. If not signed in, it asks you to sign in first.
5. Complete checkout with a Stripe test card, for example `4242 4242 4242 4242`, any future expiry date and any CVC.
6. Premium unlocks the 7-day forecast; Premium+ also unlocks the hourly chart. The purchased card shows **Current plan**.
7. Reload the page: your plan persists, because it is tied to your Firebase user id.
8. Sign out: Premium and Premium+ content locks again. Sign back in: it unlocks again.
9. As a Premium subscriber, `/` shows an upgrade card in place of the hourly chart. Buying Premium+ from `/pricing` removes it.

## 5. Troubleshooting

- **White screen:** check the browser console. Restart the dev server after changing `.env`.
- **Button disabled on the pricing page:** the current offering has no `premium` / `premium_plus` package, or the RevenueCat key is wrong.
- **Google popup blocked or `auth/unauthorized-domain`:** add the domain to Firebase authorized domains.
- **Purchase succeeds but stays locked:** entitlement identifiers must be exactly `pro` and `pro_plus`.

## 6. Checks

```bash
npm run build
npm run lint
```

`useWeather.ts` has existing type and lint errors unrelated to billing.
