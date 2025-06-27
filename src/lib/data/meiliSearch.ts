import { meiliSearchClient } from "@lib/config"
import { Hit } from "meilisearch"

export const meilisearchlistProducts = async (query?: Record<string, any>) => {
  const indexName = process.env.NEXT_PUBLIC_MEILISEARCH_INDEX_NAME || ""
  const searchQuery = query?.q
  const filter = query?.filter
  const sort = query?.sort
  const hitsPerPage = query?.hitsPerPage
  const page = query?.page

  return meiliSearchClient
    .index(indexName)
    .search<Hit<Record<string, any>>>(searchQuery, {
      filter,
      sort,
      hitsPerPage,
      page,
      facets: ["sizes", "colors", "brand"],
    })

    .then((response) => ({
      meiliSearchProducts: response.hits.map((hit) => ({
        id: hit.id,
        title: hit.title,
        description: hit.description,
        brand: hit.brand,
        categories: hit.categories,
        colors: hit.colors || [],
        gender: hit.gender || "",
        handle: hit.handle,
        thumbnail: hit.thumbnail || "",
        images: hit.images || [],
        sizes: hit.sizes || [],
        cheapestVariant: {
          id: hit.cheapestVariant?.id || "",
          prices: (hit.cheapestVariant?.prices || []).map(
            (priceObj: { salePrice: any; price: any; currencyCode: any }) => ({
              salePrice: priceObj.salePrice || 0,
              price: priceObj.price || 0,
              currencyCode: priceObj.currencyCode || "usd",
            })
          ),
        },
        variants: hit.variants,
        options: hit.options,
      })),
      facets: response.facetDistribution,
      estimatedTotalHits: response.estimatedTotalHits,
      totalPages: (response as any).totalPages,
    }))
}

export const getSortableAttributes = async () => {
  const indexName = process.env.NEXT_PUBLIC_MEILISEARCH_INDEX_NAME || ""
  const meiliSearchHost = process.env.NEXT_PUBLIC_MEILISEARCH_HOST || ""
  const apiKey = process.env.NEXT_PUBLIC_MEILISEARCH_API_KEY || ""

  if (!indexName || !meiliSearchHost) {
    throw new Error("MeiliSearch index name or host is missing.")
  }

  const response = await fetch(
    `${meiliSearchHost}/indexes/${indexName}/settings/sortable-attributes`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
    }
  )

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to fetch MeiliSearch settings: ${errorText}`)
  }

  return await response.json()
}

export const meilisearchProduct = async (query?: Record<string, any>) => {
  const indexName = process.env.NEXT_PUBLIC_MEILISEARCH_INDEX_NAME || ""
  const searchQuery = query?.q
  const filter = query?.filter

  return meiliSearchClient
    .index(indexName)
    .search<Hit<Record<string, any>>>(searchQuery, {
      filter,
    })

    .then((response) => ({
      meiliSearchProduct: response.hits.map((hit) => ({
        id: hit.id,
        title: hit.title,
        description: hit.description,
        brand: hit.brand,
        categories: hit.categories,
        colors: hit.colors || [],
        gender: hit.gender || "",
        handle: hit.handle,
        thumbnail: hit.thumbnail || "",
        sizes: hit.sizes || [],
        cheapestVariant: {
          id: hit.cheapestVariant?.id || "",
          prices: (hit.cheapestVariant?.prices || []).map(
            (priceObj: { salePrice: any; price: any; currencyCode: any }) => ({
              salePrice: priceObj.salePrice || 0,
              price: priceObj.price || 0,
              currencyCode: priceObj.currencyCode || "usd",
            })
          ),
        },
        variants: hit.variants,
        options: hit.options,
        images: hit.images || [],
        metadata: hit.metadata,
        discountable: hit.discountable,
        is_giftcard: hit.isGiftcard,
      })),
    }))
}

export const getBrandsForCategory = async (categoryHandle: string) => {
  const indexName = process.env.NEXT_PUBLIC_MEILISEARCH_INDEX_NAME || ""

  const response = await meiliSearchClient.index(indexName).search("", {
    filter: `categoryHandles='${categoryHandle}'`,
    limit: 0,
    facets: ["brand"],
  })

  return {
    brands: response.facetDistribution?.brand || {},
  }
}
