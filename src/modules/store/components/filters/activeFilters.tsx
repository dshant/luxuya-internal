"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useClearFiltersUrl } from "@lib/hooks/use-clear-filters-url"
import Link from "next/link"

const ActiveFilters = ({
  applyFilters,
}: {
  applyFilters: (selectedFilters: { [key: string]: string[] }) => void
}) => {
  const searchParams = useSearchParams()
  const clearAllUrl = useClearFiltersUrl()

  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {}
  )

  useEffect(() => {
    const queryString = window.location.search // includes the "?" prefix
    const params = new URLSearchParams(queryString)

    const filters: Record<string, string[]> = {}

    // Example: log all query params as key-value pairs
    params.forEach((value, key) => {
      if (key === "sortBy" || key === "page") return
      if (filters[key]) {
        filters[key].push(...value.split(","))
      } else {
        filters[key] = value.split(",")
      }
    })

    setActiveFilters(filters)
  }, [searchParams])

  return (
    <div className="px-4 flex items-center overflow-auto gap-4 ">
      {Object.entries(activeFilters).map(([key, values]) => (
        <div
          key={key}
          className="flex items-center gap-2 flex-nowrap flex-shrink-0"
        >
          {values.map((value, index) => (
            <div
              key={key + value}
              className="bg-gray-100 rounded-full px-3 py-1 flex items-center gap-2 flex-nowrap flex-shrink-0"
            >
              <p className=" text-gray-600 font-medium">{value}</p>

              <X
                size={16}
                className="!text-gray-600 cursor-pointer"
                onClick={() => {
                  const updatedFilters = structuredClone(activeFilters)
                  updatedFilters[key] = updatedFilters[key].filter(
                    (v) => v !== value
                  )

                  applyFilters(updatedFilters)
                }}
              />
            </div>
          ))}
        </div>
      ))}

      {Object.keys(activeFilters).length > 0 && (
        <Link
          href={clearAllUrl}
          className="bg-gray-100 rounded-full px-3 py-1 flex items-center gap-2"
        >
          <p className=" text-gray-600 font-medium">Clear All</p>

          <X size={16} className="!text-gray-600 cursor-pointer" />
        </Link>
      )}
    </div>
  )
}

export default ActiveFilters
