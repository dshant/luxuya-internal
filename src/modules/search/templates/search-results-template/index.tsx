import { Heading, Text } from "@medusajs/ui"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import {
  meilisearchlistProducts,
  getSortableAttributes,
} from "@lib/data/meiliSearch"
import { getRegion } from "@lib/data/regions"
import { TranslatedTextServer } from "@modules/common/components/translation/translatest-text-server"
import FilterAndSort from "@modules/store/components/filterAndSort"

type SearchResultsTemplateProps = {
  query: string
  sortBy?: SortOptions
  page?: string
  countryCode: string
  searchParams: any
}
export default async function SearchResultsTemplate({
  query,
  page,
  countryCode,
  searchParams,
}: SearchResultsTemplateProps) {
  const pageNumber = page ? parseInt(page) : 1
  const productPerPage = 28
  const pageNum = Number(searchParams?.page)
  const region = await getRegion(countryCode)

  const filters: unknown = []

  const sortingBy =
    searchParams?.sortBy === "created_at"
      ? ["createdAt:desc"]
      : searchParams?.sortBy === "price_asc"
        ? ["sortablePrice:asc"]
        : searchParams?.sortBy === "price_desc"
          ? ["sortablePrice:desc"]
          : []

  const splitCategories: string[] = []

  const splitBrand = searchParams?.brand?.split(",") || []
  const splitColor = searchParams?.color?.split(",") || []
  const splitSize = searchParams?.size?.split(",") || []

  const categoryFilters = `categoryHandles="${splitCategories}"`

  const brandFilters = splitBrand?.map((brand: string) => `brand="${brand}"`)
  const brandORJoin = brandFilters.length
    ? `(${brandFilters.join(" OR ")})`
    : ""

  const colorFilters = splitColor?.map((color: string) => `colors="${color}"`)
  const colorORJoin = colorFilters.length
    ? `(${colorFilters.join(" OR ")})`
    : ""

  const sizeFilters = splitSize?.map((size: string) => `sizes="${size}"`)
  const sizeORJoin = sizeFilters.length ? `(${sizeFilters.join(" OR ")})` : ""

  const filterParts = [categoryFilters, brandORJoin, colorORJoin, sizeORJoin]
    .filter(Boolean)
    .filter((part) => !/="\s*"$/.test(part))

  // const filter = filterParts.join(" AND ")
  const filter = filterParts.length > 0 ? filterParts.join(" AND ") : ""

  console.log("...filter....", filter)

  const cleanQuery = decodeURIComponent(query)
    .trim()
    .replace(/-/g, " ")
    .replace(/[^\w\s]/gi, "")

  const { meiliSearchProducts, facets, totalPages } =
    await meilisearchlistProducts({
      q: cleanQuery,
      filter,
      sort: sortingBy,
      hitsPerPage: productPerPage,
      page: pageNum,
    })

  return (
    <>
      <div className="flex justify-between border-b w-full py-6 px-8 small:px-14 items-center">
        <div className="flex flex-col items-start">
          <Text className="text-ui-fg-muted">
            <TranslatedTextServer text="Search Results for:" />
          </Text>
          <Heading>
            {decodeURI(query)} ({productPerPage * totalPages})
          </Heading>
        </div>
        <LocalizedClientLink
          href="/search"
          className="txt-medium text-ui-fg-subtle hover:text-ui-fg-base"
        >
          <TranslatedTextServer text="Clear" />
        </LocalizedClientLink>
      </div>
      <FilterAndSort
        facets={facets}
        sort={searchParams.sort}
        countryCode={countryCode}
        filters={filters}
      />
      <div className="flex flex-col small:flex-row small:items-start px-0">
        {meiliSearchProducts?.length > 0 ? (
          <div className="">
            <PaginatedProducts
              pageNumber={pageNumber}
              region={region}
              meiliSearchProducts={meiliSearchProducts}
              totalPages={totalPages}
              productPerPage={productPerPage}
            />
          </div>
        ) : (
          <Text className="ml-8 small:ml-14 mt-3">
            <TranslatedTextServer text="No results." />
          </Text>
        )}
      </div>
    </>
  )
}
