"use client"

import { translateText } from "@lib/data/translate-text"
import { getLocaleFromRequest } from "@lib/getLocaleFromRequest"

export function TranslatedTextServer({ text }: { text: string }) {
  // const locale = await getLocaleFromRequest()

  // const translatedText = await translateText(text, locale)

  return <>{text}</>
}
