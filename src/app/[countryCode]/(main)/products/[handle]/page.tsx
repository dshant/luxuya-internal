import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getRegion } from "@lib/data/regions"
import ProductTemplate from "@modules/products/templates"
import { meilisearchProduct } from "@lib/data/meiliSearch"
import { getLocaleFromRequest } from "@lib/getLocaleFromRequest"
import MainOfferModel from "@modules/products/templates/MainOfferModel"
import { getBaseURL } from "@lib/util/env"
import { Suspense } from "react"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { handle } = params
  const region = await getRegion(params.countryCode)

  if (!region) notFound()

  const { meiliSearchProduct } = await meilisearchProduct({
    filter: `handle=${handle}`,
  })

  if (!meiliSearchProduct || meiliSearchProduct.length === 0) notFound()

  const product = meiliSearchProduct[0]

  return {
    title: `${product.title} | Luxury For You`,
    description: product.description?.slice(0, 165) || "Luxury For You",
    alternates: {
      canonical: new URL(getBaseURL()),
    },
    openGraph: {
      title: `${product.title} | Luxury For You`,
      description: product.description,
      images: product.thumbnail ? [product.thumbnail] : [],
      type: "website",
      url: `${getBaseURL()}/${params.countryCode}/${handle}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function ProductPage(props: Props) {
  const params = await props.params
  const region = await getRegion(params.countryCode)
  const locale = await getLocaleFromRequest()

  if (!region) notFound()

  const { meiliSearchProduct } = await meilisearchProduct({
    filter: `handle=${params.handle}`,
  })

  if (!meiliSearchProduct || meiliSearchProduct.length === 0) notFound()

  const product = meiliSearchProduct[0]

  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.title,
    image: product.images?.length ? product.images : [product.thumbnail],
    description: product.description,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: product.brand || "Luxury For You",
    },
    offers: {
      "@type": "Offer",
      url: `${getBaseURL()}/${params.countryCode}/${params.handle}`,
      priceCurrency:
        product.cheapestVariant?.prices?.[0]?.currencyCode || "USD",
      price: product.cheapestVariant?.prices?.[0]?.price || 0,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  }

  return (
    <>
      <MainOfferModel
        messageTitle="Still browsing?"
        messageBody="Don't miss out on our latest offers!"
        inactivityTime={10000}
        countryCode={params.countryCode}
      />

      <Suspense fallback={<div></div>}>
        <ProductTemplate product={product} region={region} />
      </Suspense>
      <script type="application/ld+json" suppressHydrationWarning>
        {JSON.stringify(structuredData)}
      </script>
    </>
  )
}
