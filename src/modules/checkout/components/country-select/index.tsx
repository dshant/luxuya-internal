import { forwardRef, useImperativeHandle, useMemo, useRef } from "react"

import NativeSelect, {
  NativeSelectProps,
} from "@modules/common/components/native-select"
import { HttpTypes } from "@medusajs/types"
import { countryCodeData } from "constant/country-code-data"

const CountrySelect = forwardRef<
  HTMLSelectElement,
  NativeSelectProps & {
    region?: HttpTypes.StoreRegion
  }
>(({ placeholder = "Country", region, defaultValue, ...props }, ref) => {
  const innerRef = useRef<HTMLSelectElement>(null)

  useImperativeHandle<HTMLSelectElement | null, HTMLSelectElement | null>(
    ref,
    () => innerRef.current
  )

  const countryOptions = useMemo(() => {
    // const allCountries = countryCodeData.map((country) => ({
    //   value: country.code,
    //   label: `${country.emoji} ${country.name}`,
    // }))
    // //  Always sort alphabetically
    // const sorted = [...allCountries].sort((a, b) =>
    //   a.label.localeCompare(b.label)
    // )

    // // If region is passed, prioritize first country from region
    // if (region?.countries?.length) {
    //   const defaultCountryCode = region.countries[0].iso_2?.toUpperCase()
    //   const index = sorted.findIndex((c) => c.value === defaultCountryCode)

    //   if (index > -1) {
    //     const [defaultCountry] = sorted.splice(index, 1)
    //     return [defaultCountry, ...sorted]
    //   }
    // }

    if (!region) {
      return []
    }

    return region.countries?.map((country) => ({
      value: country.iso_2,
      label: country.display_name,
    }))

    // return sorted
  }, [region])

  return (
    <NativeSelect
      ref={innerRef}
      placeholder={placeholder}
      defaultValue={defaultValue}
      {...props}
    >
      {countryOptions?.map(({ value, label }, index) => (
        <option key={index} value={value}>
          {label}
        </option>
      ))}
    </NativeSelect>
  )
})

CountrySelect.displayName = "CountrySelect"

export default CountrySelect