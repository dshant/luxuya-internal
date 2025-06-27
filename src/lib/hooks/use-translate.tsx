"use client"

import { useState, useEffect } from "react"
import { useLanguageStore } from "@lib/stores/useLanguageStore"
import { translateText } from "@lib/data/translate-text"

export function useTranslation(text: string): string {
  const { locale } = useLanguageStore()
  const [translated, setTranslated] = useState(text)

  useEffect(() => {
    if (locale === "en") {
      setTranslated(text)
    } else {
      translateText(text, locale).then(setTranslated)
    }
  }, [text, locale])

  return translated
}
