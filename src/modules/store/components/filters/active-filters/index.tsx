"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import { useActiveFilterHandles } from "@lib/hooks/use-active-filter-handle"
import { useClearFiltersUrl } from "@lib/hooks/use-clear-filters-url"
import { StoreCollection, StoreProductCategory } from "@medusajs/types"
import { Box } from "@modules/common/components/box"
import { Button } from "@modules/common/components/button"
import { PRICING_OPTIONS } from "@modules/filter-search/const"
import { ProductFilters } from "types/global"
import ActiveFilterItem from "./active-filter-item"
import { FILTER_KEYS } from "@lib/constants2"

type ActiveProductFiltersProps = {
  filters: ProductFilters
  currentCategory?: StoreProductCategory
  currentCollection?: StoreCollection
  currentQuery?: string
  countryCode: string
}

export default function ActiveProductFilters({
  filters,
  currentCategory,
  currentCollection,
  currentQuery,
  countryCode,
}: ActiveProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Collections
  const activeCollectionIds = useActiveFilterHandles({
    key: FILTER_KEYS.COLLECTION_KEY,
  })

  const activeCollections = filters.collection?.filter((collection) => {
    return activeCollectionIds?.includes(collection.value)
  })

  //Gender Types
  const activeTypeIds = useActiveFilterHandles({
    key: FILTER_KEYS.GENDER_TYPE_KEY,
  })
  // Gender Active-Types
  const activeTypes = filters.gender?.filter((type) => {
    return activeTypeIds?.includes(type.value)
  })

  const activeMaterialNames = useActiveFilterHandles({
    key: FILTER_KEYS.MATERIAL_KEY,
  })
  const activeMaterials = filters.material?.filter((material) => {
    return activeMaterialNames?.includes(material.id)
  })

  const activePricesHandles = useActiveFilterHandles({
    key: FILTER_KEYS.PRICE_KEY,
  })
  const activePrices = PRICING_OPTIONS?.filter((price) => {
    return activePricesHandles?.includes(price.id)
  })

  const clearAllUrl = useClearFiltersUrl()

  const handleRemoveFilter = async (key: string, id: string) => {
    return new Promise<void>((resolve) => {
      const params = new URLSearchParams(searchParams.toString())
      const values = params.get(key)?.split(",") || []
      const newValues = values.filter((value) => value !== value)

      if (newValues.length > 0) {
        params.set(key, newValues.join(","))
      } else {
        params.delete(key)
      }

      const basePath = currentQuery
        ? `/${countryCode}/results/${currentQuery}`
        : currentCategory
        ? `/${countryCode}/categories/${currentCategory.handle}`
        : currentCollection
        ? `/${countryCode}/collections/${currentCollection.handle}`
        : `/${countryCode}/shop`

      router.push(
        params.toString() ? `${basePath}?${params.toString()}` : `${basePath}`,
        { scroll: false }
      )
    })
  }

  if (
    (activeCollections ?? []).length === 0 &&
    (activeTypes ?? []).length === 0 &&
    (activeMaterials ?? []).length === 0 &&
    (activePrices ?? []).length === 0
  ) {
    return null
  }

  return (
    <Box className="flex flex-wrap gap-4 gap-y-2">
      {activeCollections?.length > 0 && (
        <ActiveFilterItem
          label="Collection"
          filterKey={FILTER_KEYS.COLLECTION_KEY}
          options={activeCollections?.map((collection) => ({
            value: collection.value,
            id: collection.value,
          }))}
          handleRemoveFilter={handleRemoveFilter}
        />
      )}
      {activeTypes?.length > 0 && (
        // filtering on Gender-Type
        <ActiveFilterItem
          label="Gender"
          filterKey={FILTER_KEYS.GENDER_TYPE_KEY}
          options={activeTypes}
          handleRemoveFilter={handleRemoveFilter}
        />
      )}
      {activeMaterials?.length > 0 && (
        <ActiveFilterItem
          label="Material"
          filterKey={FILTER_KEYS.MATERIAL_KEY}
          options={activeMaterials}
          handleRemoveFilter={handleRemoveFilter}
        />
      )}
      {activePrices?.length > 0 && (
        <ActiveFilterItem
          label="Price"
          filterKey={FILTER_KEYS.PRICE_KEY}
          options={activePrices}
          handleRemoveFilter={handleRemoveFilter}
        />
      )}
      <Button asChild variant="text" className="py-2 border border-gray-300">
        <Link href={clearAllUrl} scroll={false}>
          Clear filters
        </Link>
      </Button>
    </Box>
  )
}
