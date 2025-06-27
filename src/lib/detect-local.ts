"use server"

import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers" // <-- important import

export async function detectLocale(headers: ReadonlyHeaders): Promise<string> {
  const cookieHeader = headers.get("cookie") || ""
  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((cookie) => {
      const [key, value] = cookie.trim().split("=")
      return [key, value]
    })
  )

  if (cookies.lang) {
    return cookies.lang
  }

  const acceptLanguage = headers.get("accept-language")
  if (acceptLanguage) {
    const languages = acceptLanguage
      .split(",")
      .map((lang) => lang.split(";")[0].trim())
    const supportedLanguages = ["en", "ar", "es", "it"]

    for (const lang of languages) {
      if (supportedLanguages.includes(lang)) {
        return lang
      }
    }
  }

  return "en"
}
