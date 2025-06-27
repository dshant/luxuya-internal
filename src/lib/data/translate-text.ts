// translate.ts
"use server"

import { translationCache } from "./translation-cache"

export async function translateText(
  text: string,
  targetLang: string
): Promise<string> {
  if (targetLang === "en") return text

  const cacheKey = `${text}-${targetLang}`

  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!
  }

  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY

  if (!apiKey) {
    throw new Error("Google Translate API key is missing.")
  }

  const apiUrl = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      q: text,
      target: targetLang,
      format: "text",
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Translation API error: ${response.status} ${errorText}`)
  }

  const { data } = await response.json()
  const translatedText = data.translations[0]?.translatedText

  if (!translatedText) {
    throw new Error("No translation found in API response.")
  }

  translationCache.set(cacheKey, translatedText)

  return translatedText
}
