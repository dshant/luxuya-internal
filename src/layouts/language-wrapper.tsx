'use client'

import { useEffect } from "react"
import { useLanguageStore } from "@lib/stores/useLanguageStore"

export function LanguageWrapper({ children }: { children: React.ReactNode }) {
  const { locale } = useLanguageStore()

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale
      document.documentElement.dir = locale === "ar" ? "rtl" : "ltr"
    }
  }, [locale])

  return <>{children}</>
}
