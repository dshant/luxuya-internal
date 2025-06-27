import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"
import { search } from "@modules/filter-search/actions"
import { getStoreFilters } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { getCategoryByHandle2 } from "@lib/data/categories"
import { Container } from "lucide-react"
import { Box } from "@modules/common/components/box"
import ProductFilters from "../components/filters"
import ProductFiltersDrawer from "../components/filters/filters-drawer"
import ActiveProductFilters from "../components/filters/active-filters"

import { Text } from "@modules/common/components/text"
import { HttpTypes } from "@medusajs/types"

const StoreTemplate = async ({
  sortBy,
  page,
  countryCode,
  searchParams,
  params,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  searchParams: Record<string, string>
  params: { countryCode: string; category: string[] }
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"


  return (
    <>
      <div className="flex flex-col gap-8 !pb-8 !pt-4">
        {/* <Box className="flex flex-col gap-4">
     
          <Box className="grid w-full grid-cols-2 items-center justify-between gap-2 small:flex small:flex-wrap">
            <Box className="hidden small:flex">
              <ProductFilters filters={filters} />
            </Box>
            <ProductFiltersDrawer>
              <ProductFilters filters={filters} />
            </ProductFiltersDrawer>
            <RefinementList sortBy={sort} />
          </Box>
          <ActiveProductFilters
            filters={filters}
            currentCategory={currentCategory}
            countryCode={countryCode}
          />
        </Box> */}
        <Suspense fallback={<SkeletonProductGrid />}>

          <PaginatedProducts
            //@ts-ignore
            page={pageNumber}
            sortBy={sort}
            countryCode={countryCode}
            estimatedTotalHits={undefined}
          />
        </Suspense>
      </div>
    </>
  )
}

export default StoreTemplate


