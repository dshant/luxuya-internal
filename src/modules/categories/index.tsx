import { notFound } from "next/navigation"
import { Suspense } from "react"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { HttpTypes } from "@medusajs/types"
import { Separator } from "@modules/common/components/ui/separator"
import TypographyMuted from "@modules/common/Typography/Muted"
import VideoBanner from "@modules/common/components/VideoBanner"
import CategoriesSlider from "@modules/common/components/sub-categories-slider"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import {
  getSortableAttributes,
  meilisearchlistProducts,
} from "@lib/data/meiliSearch"
import JsonStructuredData from "@modules/common/components/json-structured-data"
import { getRegion } from "@lib/data/regions"
import { TranslatedTextServer } from "@modules/common/components/translation/translatest-text-server"
import FilterAndSort from "@modules/store/components/filterAndSort"

export default async function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
  params,
  searchParams,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
  searchParams: Record<string, string>
  params: { countryCode: string; category: string[] }
}) {
  const pageNumber = page ? parseInt(page) : 1
  //removing created_at to implememnt rank of categories
  const sort = sortBy || ""

  if (!category || !countryCode) notFound()

  const parents = [] as HttpTypes.StoreProductCategory[]

  const getParents = (category: HttpTypes.StoreProductCategory) => {
    if (category.parent_category) {
      parents.push(category.parent_category)
      getParents(category.parent_category)
    }
  }

  const filters: unknown = []

  const productPerPage = 60

  const pageNum = Number(searchParams?.page)

  const setting = await getSortableAttributes()
  const region = await getRegion(countryCode)

  const sortingBy =
    searchParams?.sortBy === "created_at"
      ? ["createdAt:desc"]
      : searchParams?.sortBy === "price_asc"
        ? ["sortablePrice:asc"]
        : searchParams?.sortBy === "price_desc"
          ? ["sortablePrice:desc"]
          : params?.category && setting.length > 2
            ? [
              `${params?.category[0]?.toLowerCase()}HasRank:desc`,
              `${params?.category[0]?.toLowerCase()}:asc`,
            ]
            : []

  const splitCategories = Array.isArray(params.category)
    ? params.category[0]
    : []

  const splitBrand = searchParams?.brand?.split(",") || []
  const splitColor = searchParams?.color?.split(",") || []
  const splitSize = searchParams?.size?.split(",") || []

  const categoryFilters = `categoryHandles="${splitCategories}"`

  const brandFilters = splitBrand?.map((brand) => `brand="${brand}"`)
  const brandORJoin = brandFilters.length
    ? `(${brandFilters.join(" OR ")})`
    : ""

  const colorFilters = splitColor?.map((color) => `colors="${color}"`)
  const colorORJoin = colorFilters.length
    ? `(${colorFilters.join(" OR ")})`
    : ""

  const sizeFilters = splitSize?.map((size) => `sizes="${size}"`)
  const sizeORJoin = sizeFilters.length ? `(${sizeFilters.join(" OR ")})` : ""

  const filterParts = [
    categoryFilters,
    brandORJoin,
    colorORJoin,
    sizeORJoin,
  ].filter(Boolean)
  const filter = filterParts.join(" AND ")

  // console.log("genrated filter", filter)

  const { meiliSearchProducts, facets, totalPages } =
    await meilisearchlistProducts({
      q: "",
      filter,
      sort: sortingBy,
      hitsPerPage: productPerPage,
      page: pageNum,
    })

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: category.name,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: meiliSearchProducts.length,
    itemListElement: meiliSearchProducts.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.title,
        image: product.thumbnail,
        description: product.description,
        sku: product.id,
        brand: {
          "@type": "Brand",
          name: product.brand || "Luxury For You",
        },
        offers: {
          "@type": "Offer",
          price: (product.cheapestVariant?.prices?.[0]?.amount || 0) / 100,
          priceCurrency:
            product.cheapestVariant?.prices?.[0]?.currency_code?.toUpperCase() ||
            "USD",
          availability: "https://schema.org/InStock",
          url: `https://yourdomain.com/${countryCode}/product/${product.handle}`,
        },
      },
    })),
  }

  return (
    <>
      <JsonStructuredData data={itemListSchema} />
      <div className="mx-auto flex w-full flex-col gap-y-4">
        {!category.metadata?.cover_url ? (
          <div className="flex flex-col gap-y-10">
            <div className="my-10 flex flex-col items-center justify-center gap-y-4 text-center">
              <TypographyMuted>
                <TranslatedTextServer text="Collection /" />
                {category.parent_category?.parent_category_id && "... / "}
                {category.parent_category_id && (
                  <LocalizedClientLink
                    key={category.parent_category?.handle}
                    href={`/categories/${category.parent_category?.handle}`}
                    data-testid="sort-by-link"
                  >
                    {category.parent_category?.name} /
                  </LocalizedClientLink>
                )}{" "}
                <TranslatedTextServer text={category?.name} />
              </TypographyMuted>
              <h1 className="font-bebas font-semibold">
                {category?.name}{" "}
                <span className="text-[0px]">
                  Luxury for you {category?.name}
                </span>{" "}
              </h1>
            </div>
          </div>
        ) : category.metadata.cover_type === "video" ? (
          <VideoBanner video={category.metadata.cover_url as string} />
        ) : (
          <div className="relative h-[200px] sm:h-[300px] w-full overflow-hidden">
            <h1 className="absolute text-transparent">
              {category.name} Luxury for you {category.name}{" "}
            </h1>
            <img
              alt={category.name}
              src={category.metadata.cover_url as string}
              className="object-cover h-full"
              width="100%"
              height="100%"
            />
          </div>
        )}

        {category.category_children.length > 0 && (
          <>
            <div className="overflow-hidden w-full">
              <Separator className="mb-3" />
              <CategoriesSlider category={category} />
              <Separator className="mt-3" />
            </div>
          </>
        )}

        {/* TODO: move this sorting in search option */}
        {/* <RefinementList sortBy={sort} data-testid="sort-by-container" />  */}
        <FilterAndSort
          facets={facets}
          sort={sort}
          category={category}
          countryCode={countryCode}
          filters={filters}
        />

        {meiliSearchProducts.length === 0 && (
          <h4 className="text-center truncate font-semibold">
            <TranslatedTextServer text="No results found. Please try expanding your filters." />
          </h4>
        )}
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            pageNumber={pageNumber}
            region={region}
            meiliSearchProducts={meiliSearchProducts}
            totalPages={totalPages}
            productPerPage={productPerPage}
          />
        </Suspense>
      </div>
    </>
  )
}
