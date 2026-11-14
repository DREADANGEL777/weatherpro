import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import SEO from "../../components/SEO";
import "./../Legal.css";

export function Refund() {
  const { i18n } = useTranslation();

  return (
    <>
      <SEO
        title="Refund Policy — WeatherPro"
        description="Learn about WeatherPro's refund policy, subscription cancellations, and payment refunds."
        lang={i18n.resolvedLanguage || i18n.language || "en"}
        canonical="https://weatherpro.site/refund"
      />

      <main className="legal-page">
        <article className="legal-content">
          <Link to="/" className="legal-back">
            ← Back to WeatherPro
          </Link>

          <header className="legal-header">
            <span className="legal-eyebrow">WEATHERPRO</span>
            <h1>Refund Policy</h1>
            <p className="legal-updated">Last updated: November 14, 2026</p>
          </header>

          <p className="legal-intro">
            This Refund Policy explains the conditions under which refunds may
            be requested for purchases and subscriptions made through
            WeatherPro. Please read this policy carefully before purchasing a
            subscription.
          </p>

          <section className="legal-section">
            <h2>1. Subscription purchases</h2>
            <p>
              WeatherPro offers subscription-based features that provide access
              to additional weather information and functionality. By purchasing
              a subscription, you agree to the price, billing period, and
              applicable terms displayed during checkout.
            </p>
            <p>
              All subscription purchases are subject to this Refund Policy and
              applicable consumer protection laws.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Refund eligibility</h2>
            <p>
              Refund requests are reviewed individually and handled in
              accordance with applicable laws and the payment provider's
              policies.
            </p>
            <p>You may be eligible for a refund in circumstances such as:</p>
            <ul>
              <li>
                You were charged incorrectly or experienced a duplicate payment.
              </li>
              <li>
                An unauthorized transaction was made using your payment method.
              </li>
              <li>
                A technical issue prevented you from accessing the subscription
                features you purchased and we were unable to resolve it.
              </li>
              <li>
                A refund is required under applicable consumer protection laws.
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. Non-refundable situations</h2>
            <p>
              To the extent permitted by applicable law, refunds may not be
              available in the following circumstances:
            </p>
            <ul>
              <li>
                You simply decide that you no longer want to use the
                subscription after purchasing it.
              </li>
              <li>
                You forget to cancel an automatically renewing subscription
                before the renewal date.
              </li>
              <li>
                You do not use the subscription features during the billing
                period.
              </li>
              <li>
                You experience temporary interruptions caused by your internet
                connection or third-party services.
              </li>
            </ul>
            <p>
              These limitations do not affect any mandatory refund rights you
              may have under the laws of your country.
            </p>
          </section>

          <section className="legal-section">
            <h2>4. Subscription cancellations</h2>
            <p>
              You can cancel your subscription at any time using the
              subscription management or cancellation options provided during
              checkout or by the payment provider.
            </p>
            <p>
              Cancelling a subscription stops future automatic renewals. Unless
              otherwise required by law, cancellation does not automatically
              generate a refund for the current billing period.
            </p>
            <p>
              After cancellation, you will generally retain access to paid
              features until the end of your current billing period.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. How to request a refund</h2>
            <p>
              If you believe you are eligible for a refund, please contact us
              using the email address below.
            </p>
            <p>To help us process your request, please include:</p>
            <ul>
              <li>
                The email address associated with your WeatherPro account.
              </li>
              <li>The date of the transaction.</li>
              <li>The amount charged and currency.</li>
              <li>Your payment or transaction reference, if available.</li>
              <li>A brief explanation of why you are requesting a refund.</li>
            </ul>
            <p>
              Please do not send your full payment card number, security code,
              or other sensitive payment information.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. Payment processing</h2>
            <p>
              Payments and refunds may be processed by Paddle or another payment
              provider identified during checkout.
            </p>
            <p>
              Where Paddle acts as the Merchant of Record, it may handle payment
              processing, applicable taxes, billing, and refunds in accordance
              with its applicable terms and policies.
            </p>
            <p>
              Approved refunds are generally returned to the original payment
              method. The time required for the funds to appear depends on your
              payment provider and financial institution.
            </p>
          </section>

          <section className="legal-section">
            <h2>7. Refund processing time</h2>
            <p>
              We aim to review refund inquiries within a reasonable timeframe.
              However, processing times may vary depending on the nature of the
              request and the payment provider.
            </p>
            <p>
              Once a refund has been approved and processed, it may take several
              business days for the amount to appear in your account.
            </p>
          </section>

          <section className="legal-section">
            <h2>8. Changes to this policy</h2>
            <p>
              We reserve the right to update this Refund Policy from time to
              time. Any changes will be published on this page with an updated
              revision date.
            </p>
            <p>
              Changes will not affect mandatory consumer rights or protections
              provided by applicable law.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Contact</h2>
            <p>
              If you have questions about refunds, payments, or cancellations,
              contact us at{" "}
              <a href="mailto:lasercuttingadmin4225@gmail.com">
                lasercuttingadmin4225@gmail.com
              </a>
            </p>
          </section>

          <div className="legal-bottom-link">
            <Link to="/terms">Read our Terms of Service →</Link>
          </div>
        </article>
      </main>
    </>
  );
}
