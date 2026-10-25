import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import SEO from "../../components/SEO";
import "./../Legal.css";

export function Terms() {
  const { i18n } = useTranslation();

  return (
    <>
      <SEO
        title="Terms of Service — WeatherPro"
        description="Read the terms and conditions for using WeatherPro."
        lang={i18n.resolvedLanguage || i18n.language || "en"}
        canonical="https://weatherpro.site/terms"
      />

      <main className="legal-page">
        <article className="legal-content">
          <Link to="/" className="legal-back">
            ← Back to WeatherPro
          </Link>

          <header className="legal-header">
            <span className="legal-eyebrow">WEATHERPRO</span>
            <h1>Terms of Service</h1>
            <p className="legal-updated">Last updated: October 25, 2026</p>
          </header>

          <p className="legal-intro">
            These Terms of Service govern your access to and use of WeatherPro.
            By using the service, you agree to these terms. If you do not agree,
            please do not use WeatherPro.
          </p>

          <section className="legal-section">
            <h2>1. About WeatherPro</h2>
            <p>
              WeatherPro provides weather information and related features,
              which may include current conditions, forecasts, weather charts,
              and subscription-based features. Some features may change or
              become unavailable over time.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Eligibility and accounts</h2>
            <p>
              You must be legally permitted to use the service in your
              jurisdiction. If you create an account, you are responsible for
              providing accurate information and protecting your sign-in
              credentials. You are also responsible for activity carried out
              through your account.
            </p>
            <p>
              Please contact us if you believe your account has been accessed
              without your permission.
            </p>
          </section>

          <section className="legal-section">
            <h2>3. Weather information disclaimer</h2>
            <p>
              Weather information is provided for general informational purposes
              only. Forecasts and observations may be delayed, incomplete,
              inaccurate, or unavailable.
            </p>
            <p>
              Do not rely on WeatherPro as your sole source for emergency
              decisions, severe-weather warnings, travel safety, medical
              decisions, or other situations where inaccurate information could
              cause harm. Always consult official local authorities and
              emergency services when appropriate.
            </p>
          </section>

          <section className="legal-section">
            <h2>4. Subscriptions and payments</h2>
            <p>
              WeatherPro may offer free and paid plans. The features, prices,
              billing periods, and applicable taxes for paid plans are shown on
              the pricing or checkout page before you purchase.
            </p>
            <p>
              Payments and subscription checkout may be processed by Paddle or
              another payment provider identified during checkout. The payment
              provider's applicable terms and policies may also apply to your
              transaction.
            </p>
            <p>
              By purchasing a subscription, you authorize the applicable payment
              provider to charge the amount and on the schedule presented at
              checkout.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. Renewals, cancellation, and refunds</h2>
            <p>
              If your plan renews automatically, the renewal frequency and price
              will be shown during checkout. You can manage or cancel your
              subscription using the cancellation method provided by the service
              or payment provider.
            </p>
            <p>
              Cancellation generally prevents future renewals; access to paid
              features may continue until the end of the current paid period,
              subject to the plan terms shown at purchase.
            </p>
            <p>
              Refund eligibility is governed by applicable law and the terms
              presented at checkout. Nothing in these Terms limits consumer
              rights that cannot legally be excluded.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. Acceptable use</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use WeatherPro for unlawful purposes.</li>
              <li>Attempt to disrupt, damage, or overload the service.</li>
              <li>
                Attempt unauthorized access to accounts, systems, or data.
              </li>
              <li>
                Scrape, copy, redistribute, or commercially exploit service
                content except where permitted by law or with authorization.
              </li>
              <li>
                Circumvent technical restrictions or interfere with the
                operation of subscription features.
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>7. Third-party services</h2>
            <p>
              WeatherPro may depend on third-party services for weather data,
              authentication, hosting, analytics, or payments. We do not control
              all third-party services and cannot guarantee their uninterrupted
              availability or accuracy. Their own terms and privacy policies may
              apply.
            </p>
          </section>

          <section className="legal-section">
            <h2>8. Availability and changes</h2>
            <p>
              We may update, suspend, or discontinue parts of WeatherPro for
              maintenance, security, operational, or business reasons. We will
              make reasonable efforts to avoid unnecessary disruption, but
              uninterrupted access is not guaranteed.
            </p>
            <p>
              We may revise these Terms from time to time. The updated version
              will be published on this page with a revised update date. Where
              required by law, we will provide additional notice or obtain
              consent.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Disclaimer and limitation of liability</h2>
            <p>
              To the extent permitted by law, WeatherPro is provided on an “as
              is” and “as available” basis without warranties that cannot be
              excluded under applicable law.
            </p>
            <p>
              To the extent permitted by law, we are not liable for indirect or
              consequential loss, loss of data, loss of profits, or decisions
              made in reliance on weather information. These Terms do not
              exclude liability where exclusion is prohibited by law.
            </p>
          </section>

          <section className="legal-section">
            <h2>10. Governing law</h2>
            <p>
              These Terms are subject to the laws applicable to the operator of
              WeatherPro, except where mandatory consumer-protection laws in
              your country provide otherwise. The operator's legal name,
              address, and applicable jurisdiction should be specified here
              before publication.
            </p>
          </section>

          <section className="legal-section">
            <h2>11. Contact</h2>
            <p>
              For questions about these Terms, contact us at{" "}
              <a href="mailto:lasercuttingadmin4225@gmail.com">
                lasercuttingadmin4225@gmail.com
              </a>
            </p>
          </section>

          <div className="legal-bottom-link">
            <Link to="/privacy">Read our Privacy Policy →</Link>
          </div>
        </article>
      </main>
    </>
  );
}
