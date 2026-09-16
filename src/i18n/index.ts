import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { uk } from "./locales/uk";
import { en } from "./locales/en";
import { pl } from "./locales/pl";
import { de } from "./locales/de";
import { es } from "./locales/es";

const LANGUAGE_STORAGE_KEY = "weatherpro-language";

const supportedLanguages = ["uk", "en", "pl", "de", "es"] as const;

type SupportedLanguage = (typeof supportedLanguages)[number];

const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);

const initialLanguage: SupportedLanguage = supportedLanguages.includes(
  savedLanguage as SupportedLanguage,
)
  ? (savedLanguage as SupportedLanguage)
  : "uk";

void i18n.use(initReactI18next).init({
  resources: {
    uk: {
      translation: uk,
    },
    en: {
      translation: en,
    },
    pl: {
      translation: pl,
    },
    de: {
      translation: de,
    },
    es: {
      translation: es,
    },
  },

  lng: initialLanguage,

  fallbackLng: "uk",

  interpolation: {
    escapeValue: false,
  },
});

i18n.on("languageChanged", (language) => {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language);

  document.documentElement.lang = language;
});

document.documentElement.lang = initialLanguage;

export default i18n;
