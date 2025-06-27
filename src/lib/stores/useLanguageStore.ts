import { create } from "zustand"
import Cookies from "js-cookie"

type LanguageState = {
  locale: string
  setLocale: (locale: string) => void
}

const defaultLang = Cookies.get("lang") || "en"

export const useLanguageStore = create<LanguageState>((set) => ({
  locale: defaultLang,
  setLocale: (locale: string) => {
    Cookies.set("lang", locale, { expires: 365 })
    set({ locale })
  },
}))
