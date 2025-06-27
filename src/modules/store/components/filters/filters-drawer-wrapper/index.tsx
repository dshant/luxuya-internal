"use client"
import ProductFiltersDrawer from "@modules/store/components/filters/filters-drawer"
import ProductFilters from ".."
import { useState } from "react"
import { FacetDistribution } from "@meilisearch/instant-meilisearch/dist/types/types"

const FiltersDrawerWrapper = ({
  facets,
  selectedFilters,
  updateFilters,
  applyFilters,
}: {
  facets: FacetDistribution | undefined
  selectedFilters: { [key: string]: string[] }
  updateFilters: (param: string, values: string[]) => void
  applyFilters: () => void
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <ProductFiltersDrawer setIsOpen={setIsOpen} isOpen={isOpen}>
        <ProductFilters
          isLg={false}
          facets={facets}
          setIsOpen={setIsOpen}
          selectedFilters={selectedFilters}
          updateFilters={updateFilters}
          applyFilters={applyFilters}
        />
      </ProductFiltersDrawer>
    </>
  )
}

export default FiltersDrawerWrapper
