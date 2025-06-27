"use client"

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react"
import { Fragment, useEffect, useMemo, useState } from "react"
import ReactCountryFlag from "react-country-flag"
import Cookies from "js-cookie"

import { StateType } from "@lib/hooks/use-toggle-state"
import { useParams, usePathname, useRouter } from "next/navigation"
import { updateRegion } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"

type CountryOption = {
  country: string
  region: string
  label: string
  currency: string
}

type CountrySelectProps = {
  toggleState: StateType
  regions: HttpTypes.StoreRegion[]
}

const CountrySelect = ({ toggleState, regions }: CountrySelectProps) => {
  const [isLoading, setLoading] = useState(false)
  const [current, setCurrent] = useState<
    | {
      country: string | undefined
      region: string
      label: string | undefined
      currency: string | undefined
    }
    | undefined
  >(undefined)

  const { countryCode } = useParams()
  const currentPath = usePathname().split(`/${countryCode}`)[1]
  const router = useRouter()

  const { state, close } = toggleState

  const options = useMemo(() => {
    return regions
      ?.map((r) => {
        return r.countries?.map((c) => ({
          country: c.iso_2,
          region: r.id,
          label: c.display_name,
          currency: r.currency_code,
        }))
      })
      .flat()
      .sort((a, b) => (a?.label ?? "").localeCompare(b?.label ?? ""))
  }, [regions])

  useEffect(() => {
    if (countryCode) {
      const option = options?.find((o) => o?.country === countryCode)
      setCurrent(option)
    }
  }, [options, countryCode])

  const handleChange = async (option: CountryOption) => {
    setLoading(true)
    Cookies.set("_selected_country_code", option?.country)

    await updateRegion(option?.country, option?.region)
    setLoading(false)
    close()
    router.push(`/${option?.country}${currentPath}`)
  }

  return (
    <div>
      <Listbox
        as="span"
        onChange={handleChange}
        defaultValue={
          countryCode
            ? options?.find((o) => o?.country === countryCode)
            : undefined
        }
      >
        <ListboxButton>
          <div className="txt-compact-small flex items-start pl-2 lg:pl-3 gap-x-2">
            {current && (
              <span className="txt-compact-small flex items-center gap-x-2">
                <ReactCountryFlag
                  svg
                  style={{
                    width: "16px",
                    height: "16px",
                  }}
                  countryCode={current.country ?? ""}
                  alt="countryFlag"
                  width={"16px"}
                  height={"16px"}
                />
                <span className="lg:inline-block">{current.label}</span>
                <span className="uppercase lg:inline-block">
                  {"(" + current.currency + ")"}
                </span>
              </span>
            )}
          </div>
        </ListboxButton>
        <div className="flex relative text-sm ml- lg:ml-0 w-[150px] lg:w-[220px]">
          <Transition
            show={state}
            as={Fragment}
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions
              className="absolute -top-[calc(100%-10px)] right-[40px] translate-x-1/2 lg:left-1/2 lg:-translate-x-1/2 max-h-[300px] w-[220px] md:w-[220px] min-w-[0px] overflow-y-scroll z-[900] bg-white drop-shadow-md text-small-regular uppercase text-black no-scrollbar rounded-rounded border"
              static
            >
              {isLoading && (
                <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-70">
                  <span className="animate-spin h-6 w-6 border-2 border-gray-300 border-t-gray-600 rounded-full"></span>
                </div>
              )}

              <div
                className={`${isLoading ? "opacity-50 pointer-events-none" : ""
                  }`}
              >
                {options?.map((o, index) => (
                  <ListboxOption
                    key={index}
                    value={o}
                    className="py-2 hover:bg-gray-200 px-3 cursor-pointer flex items-center gap-x-2"
                  >
                    <ReactCountryFlag
                      svg
                      style={{
                        width: "16px",
                        height: "16px",
                      }}
                      countryCode={o?.country ?? ""}
                    />{" "}
                    {o?.label} ({o?.currency})
                  </ListboxOption>
                ))}
              </div>
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}

export default CountrySelect
