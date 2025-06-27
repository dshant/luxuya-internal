import { useState, useRef, useEffect } from "react"
import { countryCodeData } from "constant/country-code-data"
import { TranslatedTextServer } from "@modules/common/components/translation/translatest-text-server"

interface SelectCountryCodeProps {
  setCountryCode: (code: string) => void
  selectedCountry: string
  setSelectedCountry: (country: string) => void
}

export function SelectCountryCode({
  setCountryCode,
  selectedCountry,
  setSelectedCountry,
}: SelectCountryCodeProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedDialCode = countryCodeData.find(
    (c) => c.code === selectedCountry
  )?.dial_code

  const handleSelect = (value: string) => {
    setSelectedCountry(value)
    const dial = countryCodeData.find((c) => c.code === value)?.dial_code || ""
    setCountryCode(dial.replace("+", ""))
    setIsOpen(false)
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Trigger */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full rounded-lg h-12 border border-gray-300 dark:border-gray-700 px-4 flex items-center justify-between cursor-pointer"
      >
        {selectedDialCode || <TranslatedTextServer text="Select a country code" />}
        <span className="ml-2">&#9662;</span>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-[10000] mt-2 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-2">
          <div className="h-60 overflow-y-auto">
            {countryCodeData.map((country) => (
              <div
                key={country.code}
                onClick={() => handleSelect(country.code)}
                className={`cursor-pointer px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  selectedCountry === country.code
                    ? "bg-gray-100 dark:bg-gray-800"
                    : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl"><TranslatedTextServer text={country.emoji} /></span>
                  <span className="text-base font-medium">
                    <TranslatedTextServer text={country.name} />
                  </span>
                  <span>{country.dial_code}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
