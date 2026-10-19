import { useEffect } from "react";

type SEOProps = {
  title: string;
  description: string;
  noIndex?: boolean;
  lang?: string;
  canonical?: string;
};

const SITE_URL = "https://weatherpro.site";

function setMeta(
  selector: string,
  attribute: "name" | "property",
  key: string,
  content: string,
) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.content = content;
}

export default function SEO({
  title,
  description,
  noIndex = false,
  lang = "en",
  canonical,
}: SEOProps) {
  useEffect(() => {
    document.title = title;
    document.documentElement.lang = lang;

    setMeta('meta[name="description"]', "name", "description", description);

    setMeta(
      'meta[name="robots"]',
      "name",
      "robots",
      noIndex ? "noindex, nofollow" : "index, follow",
    );

    setMeta('meta[property="og:type"]', "property", "og:type", "website");

    setMeta(
      'meta[property="og:site_name"]',
      "property",
      "og:site_name",
      "WeatherPro",
    );

    setMeta('meta[property="og:title"]', "property", "og:title", title);

    setMeta(
      'meta[property="og:description"]',
      "property",
      "og:description",
      description,
    );

    setMeta(
      'meta[property="og:url"]',
      "property",
      "og:url",
      canonical ?? `${SITE_URL}${window.location.pathname}`,
    );

    setMeta(
      'meta[property="og:locale"]',
      "property",
      "og:locale",
      lang.toLowerCase().startsWith("uk") ? "uk_UA" : "en_US",
    );

    setMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary");

    setMeta('meta[name="twitter:title"]', "name", "twitter:title", title);

    setMeta(
      'meta[name="twitter:description"]',
      "name",
      "twitter:description",
      description,
    );

    let canonicalElement = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );

    if (!canonicalElement) {
      canonicalElement = document.createElement("link");
      canonicalElement.rel = "canonical";
      document.head.appendChild(canonicalElement);
    }

    canonicalElement.href =
      canonical ?? `${SITE_URL}${window.location.pathname}`;
  }, [title, description, noIndex, lang, canonical]);

  return null;
}
