"use client"

import React, { useState, useEffect } from "react"
import CountrySelect from "@modules/layout/components/country-select"
import { useToggleState } from "@medusajs/ui"
import { listRegions } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import dynamic from "next/dynamic"
const LanguageSelect = dynamic(() => import("./language-select"), {
  ssr: false,
})

const CatagoryNav = () => {
  const [region, setRegion] = useState<HttpTypes.StoreRegion[]>([])
  const toggleState = useToggleState()

  useEffect(() => {
    const fetchRegions = async () => {
      const regionsData = await listRegions()
      setRegion(regionsData)
    }
    fetchRegions()
  }, [])

  return (
    <div className=" w-[100px] lg:w-[300px]">
      <div className="hidden md:flex w-[100px] lg:w-[300px] items-center justify-end py-4">
        <div className="hidden md:flex gap-x-2 px-2">
          <div
            className="border w-[150px] lg:w-[220px] border-gray-200 pt-2 rounded-xl"
            onMouseEnter={() => toggleState.toggle()}
            onMouseLeave={() => toggleState.toggle()}
          >
            {region && (
              <CountrySelect toggleState={toggleState} regions={region} />
            )}
          </div>
          <LanguageSelect />
        </div>
      </div>
    </div>
  )
}

export default CatagoryNav
