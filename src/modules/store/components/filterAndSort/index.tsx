"use client"
import { useState, useEffect } from "react"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import { createUrl } from "@lib/util/urls"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { HttpTypes } from "@medusajs/types"
import { Box } from "@modules/common/components/box"
import ProductFilters from "@modules/store/components/filters"
import ActiveProductFilters from "@modules/store/components/filters/active-filters"
import FiltersDrawerWrapper from "@modules/store/components/filters/filters-drawer-wrapper"
import ActiveFilters from "@modules/store/components/filters/activeFilters"
import RefinementList from "@modules/store/components/refinement-list"
import { FacetDistribution } from "@meilisearch/instant-meilisearch/dist/types/types"

const FilterAndSort = ({
  facets,
  sort,
  filters,
  category,
  countryCode,
}: {
  facets: FacetDistribution | undefined
  sort: SortOptions
  filters: any
  category?: HttpTypes.StoreProductCategory
  countryCode: string
}) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string[]
  }>({})

  const updateFilters = (param: string, values: string[]) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [param]: values,
    }))
  }

  const applyFilters = () => {
    const newSearchParams = new URLSearchParams(searchParams.toString())

    Object.entries(selectedFilters).forEach(([key, values]) => {
      if (values.length > 0) {
        newSearchParams.set(key, values.join(","))
      } else {
        newSearchParams.delete(key)
      }
    })

    router.push(createUrl(pathname, newSearchParams), { scroll: false })
  }

  const applyFilters2 = (selectedFilters: { [key: string]: string[] }) => {
    const newSearchParams = new URLSearchParams(searchParams.toString())

    Object.entries(selectedFilters).forEach(([key, values]) => {
      if (values.length > 0) {
        newSearchParams.set(key, values.join(","))
      } else {
        newSearchParams.delete(key)
      }
    })

    router.push(createUrl(pathname, newSearchParams), { scroll: false })
  }

  useEffect(() => {
    const initialFilters: { [key: string]: string[] } = {}

    searchParams.forEach((value, key) => {
      if (value) {
        initialFilters[key] = value.split(",")
      }
    })

    setSelectedFilters(initialFilters)
  }, [searchParams])

  return (
    <div className="flex flex-col gap-4 !pb-8 !pt-4 overflow-auto sticky top-[56px] z-40 left-0 right-0 bg-white">
      <Box className="flex flex-col gap-4">
        <Box className="flex justify-center">
          <div className="flex lg:hidden w-full justify-center items-center border-y border-gray-400">
            <FiltersDrawerWrapper
              facets={facets}
              selectedFilters={selectedFilters}
              updateFilters={updateFilters}
              applyFilters={applyFilters}
            />
            <RefinementList sortBy={sort} />
          </div>
          <div className="hidden lg:flex w-full justify-between items-center border-y border-gray-400">
            <ProductFilters
              isLg={true}
              facets={facets}
              selectedFilters={selectedFilters}
              updateFilters={updateFilters}
              applyFilters={applyFilters}
            />
            <div className="flex justify-end pr-10">
              <RefinementList sortBy={sort} />
            </div>
          </div>
        </Box>
        <ActiveProductFilters
          //@ts-ignore
          filters={filters}
          currentCategory={category}
          countryCode={countryCode}
        />
      </Box>

      <ActiveFilters applyFilters={applyFilters2} />
    </div>
  )
}

export default FilterAndSort
