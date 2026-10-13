import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

import i18n from "../../i18n"

import "./LanguageSwitcher.css"

const languageOptions = [
  {
    code: "uk",
    label: "Українська",
    flag: "🇺🇦",
  },
  {
    code: "en",
    label: "English",
    flag: "🇬🇧",
  },
  {
    code: "pl",
    label: "Polski",
    flag: "🇵🇱",
  },
  {
    code: "de",
    label: "Deutsch",
    flag: "🇩🇪",
  },
  {
    code: "es",
    label: "Español",
    flag: "🇪🇸",
  },
] as const

export function LanguageSwitcher() {
  const { i18n: currentI18n } = useTranslation()

  const switcherRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("pointerdown", handlePointerDown)

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
    }
  }, [isOpen])

  const currentLanguage =
    languageOptions.find((item) => item.code === currentI18n.language) ?? languageOptions[0]

  const handleSelect = (language: (typeof languageOptions)[number]["code"]) => {
    void i18n.changeLanguage(language)

    setIsOpen(false)
  }

  return (
    <div className="language-switcher" ref={switcherRef}>
      <button
        type="button"
        className="language-switcher__button"
        onClick={() => setIsOpen((value) => !value)}
        aria-expanded={isOpen}
        aria-label="Change language"
      >
        <span className="language-switcher__flag">{currentLanguage.flag}</span>

        <span>{currentLanguage.code.toUpperCase()}</span>

        <span
          className={`language-switcher__arrow ${isOpen ? "language-switcher__arrow--open" : ""}`}
        >
          ▾
        </span>
      </button>

      {isOpen && (
        <div className="language-switcher__menu">
          {languageOptions.map((item) => (
            <button
              type="button"
              key={item.code}
              className={`language-switcher__option ${
                item.code === currentLanguage.code ? "language-switcher__option--active" : ""
              }`}
              onClick={() => handleSelect(item.code)}
            >
              <span>{item.flag}</span>

              <span>{item.label}</span>

              {item.code === currentLanguage.code && (
                <span className="language-switcher__check">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
