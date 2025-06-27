"use client"

import * as React from "react"
import { useLanguageStore } from "@lib/stores/useLanguageStore"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

type LanguageOption = {
  code: string
  label: string
}

const languages: LanguageOption[] = [
  { code: "en", label: "English" },
  { code: "ar", label: "العربية" },
  { code: "es", label: "Español" },
  { code: "it", label: "Italiano" },
]

const LanguageSelect = () => {
  const { locale, setLocale } = useLanguageStore()

  function handleLanguageChange(value: string) {
    setLocale(value)
    if (window && window !== undefined) {
      window.location.reload()
    }
  }

  return (
    <Select value={locale} onValueChange={handleLanguageChange}>
      <SelectTrigger className="h-10 text-xs border border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900 rounded-lg p-3 flex items-center justify-center">
        <SelectValue placeholder="Lang">{locale.toUpperCase()}</SelectValue>
      </SelectTrigger>
      <SelectContent className="z-[10000] border rounded-rounded mr-[90px] md:mr-0">
        <SelectGroup>
          <SelectLabel>Languages</SelectLabel>
          {languages.map(({ code, label }) => (
            <SelectItem key={code} value={code}>
              {label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default LanguageSelect
