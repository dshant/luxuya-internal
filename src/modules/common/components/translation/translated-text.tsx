"use client"

import { useTranslation } from "@lib/hooks/use-translate"

export function TranslatedText({ text }: { text: string }) {
  const translated = useTranslation(text)
  return <>{translated}</>
}
