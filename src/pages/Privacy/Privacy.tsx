import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import SEO from "../../components/SEO";
import "./../Legal.css";

export function Privacy() {
  const { i18n } = useTranslation();

  return (
    <>
      <SEO
        title="Privacy Policy — WeatherPro"
        description="Learn how WeatherPro may collect, use, and protect your information."
        lang={i18n.resolvedLanguage || i18n.language || "en"}
        canonical="https://weatherpro.site/privacy"
      />

      <main className="legal-page">
        <article className="legal-content">
          <Link to="/" className="legal-back">
            ← Back to WeatherPro
          </Link>

          <header className="legal-header">
            <span className="legal-eyebrow">WEATHERPRO</span>
            <h1>Privacy Policy</h1>
            <p className="legal-updated">Last updated: October 25, 2026</p>
          </header>

          <p className="legal-intro">
            This Privacy Policy explains how WeatherPro may collect, use,
            disclose, and protect information when you use the service. The
            information actually processed depends on the features you use and
            the third-party services enabled in the application.
          </p>

          <section className="legal-section">
            <h2>1. Information we may collect</h2>

            <h3>Account information</h3>
            <p>
              If account functionality is enabled, we may process information
              associated with your account, such as your email address and
              account identifier.
            </p>

            <h3>Weather searches and preferences</h3>
            <p>
              When you search for a city or select a location, the application
              may process the city name, coordinates, language preference, and
              related settings needed to provide the requested weather
              information.
            </p>

            <h3>Subscription information</h3>
            <p>
              If you purchase a paid plan, subscription status and related
              identifiers may be processed to determine access to paid features.
              Payment card details are generally handled by the payment provider
              rather than stored directly by WeatherPro; confirm this against
              your actual payment integration.
            </p>

            <h3>Technical information</h3>
            <p>
              Depending on the services enabled, technical information such as
              browser type, device information, error reports, and service usage
              data may be processed to operate, secure, and improve WeatherPro.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. How information may be used</h2>
            <p>Information may be used to:</p>
            <ul>
              <li>Provide weather data and requested application features.</li>
              <li>Manage accounts and authenticate users.</li>
              <li>Verify subscription status and enable paid features.</li>
              <li>Maintain, troubleshoot, and protect the service.</li>
              <li>Respond to support requests.</li>
              <li>
                Meet legal obligations and prevent fraud or misuse where
                necessary.
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. Location information</h2>
            <p>
              If you choose to allow location access in your browser, WeatherPro
              may use your device's location to request local weather
              information. Browser location access is subject to your device and
              browser permissions.
            </p>
            <p>
              You can manage or revoke location permission in your browser
              settings. You may also be able to search for a city manually
              instead. Review your actual application implementation to confirm
              whether coordinates are stored or only used for the weather
              request.
            </p>
          </section>

          <section className="legal-section">
            <h2>4. Cookies and local storage</h2>
            <p>
              WeatherPro or its integrated services may use browser storage,
              cookies, or similar technologies to maintain preferences, support
              authentication, remember settings, or operate security and payment
              features.
            </p>
            <p>
              The technologies used depend on the application's configuration.
              Before publishing this policy, document the actual cookies and
              storage mechanisms, including any analytics or advertising tools
              that are enabled.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. Third-party providers</h2>
            <p>
              WeatherPro may rely on third-party providers to deliver parts of
              the service. Depending on your configuration, these may include:
            </p>
            <ul>
              <li>
                Weather-data providers, such as Open-Meteo, for forecasts and
                geocoding.
              </li>
              <li>
                Paddle or another payment provider for checkout and subscription
                payments.
              </li>
              <li>
                Authentication, hosting, monitoring, or error-reporting
                providers, if enabled.
              </li>
            </ul>
            <p>
              These providers may process information under their own privacy
              policies and contractual arrangements. List only the providers
              actually used by your deployed application and link to their
              current privacy policies before publication.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. Sharing of information</h2>
            <p>
              We do not sell personal information as part of the intended
              operation described in this policy. Information may be shared with
              service providers when needed to operate WeatherPro, when required
              by law, to protect rights and security, or as part of a business
              transfer where legally permitted.
            </p>
          </section>

          <section className="legal-section">
            <h2>7. Data retention and security</h2>
            <p>
              Information should be retained only for as long as necessary for
              the purposes described in this policy, including legal,
              accounting, security, and dispute-resolution requirements. Actual
              retention periods depend on the type of information and the
              services involved.
            </p>
            <p>
              Reasonable technical and organizational safeguards should be used
              to protect information. However, no online service can guarantee
              absolute security.
            </p>
          </section>

          <section className="legal-section">
            <h2>8. Your privacy rights</h2>
            <p>
              Depending on your location and applicable law, you may have the
              right to request access to, correction of, or deletion of your
              personal information, or to object to or restrict certain
              processing. You may also have the right to withdraw consent where
              processing is based on consent.
            </p>
            <p>
              To submit a privacy request, contact us using the email address
              listed below. We may need to verify your request before acting on
              it.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Children's privacy</h2>
            <p>
              WeatherPro is not intended to collect personal information from
              children in violation of applicable law. If you believe a child
              has provided personal information inappropriately, contact us so
              we can review the situation.
            </p>
          </section>

          <section className="legal-section">
            <h2>10. International data processing</h2>
            <p>
              Some service providers may process information in countries other
              than your own. Where required, appropriate safeguards should be
              applied to international transfers in accordance with applicable
              data-protection law.
            </p>
          </section>

          <section className="legal-section">
            <h2>11. Changes to this policy</h2>
            <p>
              We may update this Privacy Policy as WeatherPro or applicable
              legal requirements change. The current version will be published
              on this page with an updated date. Additional notice will be
              provided where required by law.
            </p>
          </section>

          <section className="legal-section">
            <h2>12. Contact us</h2>
            <p>
              For privacy-related questions or requests, contact us at{" "}
              <a href="mailto:lasercuttingadmin4225@gmail.com">
                lasercuttingadmin4225@gmail.com
              </a>
            </p>
            <p>
              Before publication, add the legal name and contact details of the
              person or organization responsible for operating WeatherPro.
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
