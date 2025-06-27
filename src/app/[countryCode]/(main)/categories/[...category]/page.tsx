import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCategoryByHandle, listCategories } from "@lib/data/categories"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import CategoryTemplate from "@modules/categories"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import MainOfferModel from "@modules/products/templates/MainOfferModel"

type Props = {
  params: Promise<{ category: string[]; countryCode: string }>
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
}

export async function generateStaticParams() {
  const product_categories = await listCategories()

  if (!product_categories) {
    return []
  }

  const countryCodes = await listRegions().then((regions: StoreRegion[]) =>
    regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
  )

  const categoryHandles = product_categories.map(
    (category: any) => category.handle
  )

  const staticParams = countryCodes
    ?.map((countryCode: string | undefined) =>
      categoryHandles.map((handle: any) => ({
        countryCode,
        category: [handle],
      }))
    )
    .flat()

  return staticParams
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  try {
    let cat = params.category

    if (params.category.includes("men")) {
      cat = ["Men"]
    }
    const productCategory = await getCategoryByHandle(cat)

    const title = productCategory.name + " | Luxury For You"

    const description = productCategory.description ?? `${title} category.`

    return {
      title: `${title} | Luxury For You`,
      description: description || "Luxury For You",
      alternates: {
        canonical: `${params.category.join("/")}`,
      },
      robots: {
        index: true,
        follow: true,
      },
    }
  } catch (error) {
    notFound()
  }
}

export default async function CategoryPage(props: Props) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { sortBy, page } = searchParams
  let cat = params.category

  if (params.category.includes("men")) {
    cat = ["Men"]
  }

  const productCategory = await getCategoryByHandle(cat)

  if (!productCategory) {
    notFound()
  }

  return (
    <>
      <MainOfferModel
        messageTitle=""
        messageBody="Don't miss out on our latest offers!"
        inactivityTime={10000}
        countryCode={params.countryCode}
      />
      <CategoryTemplate
        category={productCategory}
        sortBy={sortBy}
        page={page}
        countryCode={params.countryCode}
        params={params}
        searchParams={searchParams}
      />
    </>
  )
}
