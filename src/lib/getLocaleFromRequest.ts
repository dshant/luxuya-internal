"use server"

import { cookies, headers } from "next/headers"

export async function getLocaleFromRequest(): Promise<string> {
  const cookieStore = await cookies()
  const langCookie = cookieStore.get("lang")?.value

  if (langCookie) {
    return langCookie
  }

  const headerList = await headers()
  const acceptLanguage = headerList.get("accept-language")

  if (acceptLanguage) {
    const languages = acceptLanguage
      .split(",")
      .map((lang: string) => lang.split(";")[0].trim())
    const supportedLanguages = ["en", "ar", "es", "it"]

    for (const lang of languages) {
      if (supportedLanguages.includes(lang)) {
        return lang
      }
    }
  }

  return "en"
}
