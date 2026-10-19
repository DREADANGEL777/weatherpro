import { useEffect } from "react";

type SEOProps = {
  title: string;
  description: string;
  noIndex?: boolean;
  lang?: string;
  canonical?: string;
};

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

  element.setAttribute("content", content);
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

    setMeta('meta[property="og:title"]', "property", "og:title", title);

    setMeta(
      'meta[property="og:description"]',
      "property",
      "og:description",
      description,
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

    if (canonical) {
      if (!canonicalElement) {
        canonicalElement = document.createElement("link");
        canonicalElement.rel = "canonical";
        document.head.appendChild(canonicalElement);
      }

      canonicalElement.href = canonical;
    } else if (canonicalElement) {
      canonicalElement.remove();
    }
  }, [title, description, noIndex, lang, canonical]);

  return null;
}
