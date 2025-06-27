import type { MetadataRoute } from "next"
import axios from "axios"

type Entity = {
  id: string
  handle: string
  updated_at: Date
}

const siteUrl = `${process.env.NEXT_PUBLIC_BASE_URL}`

const staticPaths = [
  "",
  "about",
  "contact",
  "policies/refund-policy",
  "policies/billing-terms-conditions",
  "policies/privacy-policy",
  "policies/terms-and-conditions",
  "policies/shipping-policy",
  "help",
]

async function fetchDynamicData(id: string) {
  try {
    const headers = {
      "Content-Type": "application/json",
      "x-publishable-api-key": `${process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY}`,
    }

    if (id === "categories") {
      const categoryResponse = await axios.get<{
        product_categories: Entity[]
      }>(`${process.env.MEDUSA_BACKEND_URL}/store/product-categories`, {
        headers,
        params: { fields: "handle,updated_at", limit: 50000 },
      })

      const categories = Array.isArray(categoryResponse.data.product_categories)
        ? categoryResponse.data.product_categories
        : []

      // Combine categories and products to evenly split the sitemap
      const combined = [
        ...categories.map((c) => ({
          type: "category",
          slug: c.handle,
          updatedAt: c.updated_at,
        })),
      ]

      return { result: combined }
    } else if (id === "products-one") {
      const productResponse = await axios.get<{ products: Entity[] }>(
        `${process.env.MEDUSA_BACKEND_URL}/store/products`,
        {
          headers,
          params: { fields: "handle,updated_at", limit: 10000, offset: 0 },
        }
      )

      const products = Array.isArray(productResponse.data.products)
        ? productResponse.data.products
        : []

      const combined = [
        ...products.map((p) => ({
          type: "product",
          slug: p.handle,
          updatedAt: p.updated_at,
        })),
      ]

      return { result: combined }
    } else if (id === "products-two") {
      const productResponse = await axios.get<{ products: Entity[] }>(
        `${process.env.MEDUSA_BACKEND_URL}/store/products`,
        {
          headers,
          params: { fields: "handle,updated_at", limit: 10000, offset: 10000 },
        }
      )

      const products = Array.isArray(productResponse.data.products)
        ? productResponse.data.products
        : []

      const combined = [
        ...products.map((p) => ({
          type: "product",
          slug: p.handle,
          updatedAt: p.updated_at,
        })),
      ]

      return { result: combined }
    } else if (id === "products-three") {
      const productResponse = await axios.get<{ products: Entity[] }>(
        `${process.env.MEDUSA_BACKEND_URL}/store/products`,
        {
          headers,
          params: { fields: "handle,updated_at", limit: 10000, offset: 20000 },
        }
      )

      const products = Array.isArray(productResponse.data.products)
        ? productResponse.data.products
        : []

      const combined = [
        ...products.map((p) => ({
          type: "product",
          slug: p.handle,
          updatedAt: p.updated_at,
        })),
      ]

      return { result: combined }
    } else if (id === "products-four") {
      const productResponse = await axios.get<{ products: Entity[] }>(
        `${process.env.MEDUSA_BACKEND_URL}/store/products`,
        {
          headers,
          params: { fields: "handle,updated_at", limit: 10000, offset: 30000 },
        }
      )

      const products = Array.isArray(productResponse.data.products)
        ? productResponse.data.products
        : []

      const combined = [
        ...products.map((p) => ({
          type: "product",
          slug: p.handle,
          updatedAt: p.updated_at,
        })),
      ]

      return { result: combined }
    } else if (id === "products-five") {
      const productResponse = await axios.get<{ products: Entity[] }>(
        `${process.env.MEDUSA_BACKEND_URL}/store/products`,
        {
          headers,
          params: { fields: "handle,updated_at", limit: 10000, offset: 40000 },
        }
      )

      const products = Array.isArray(productResponse.data.products)
        ? productResponse.data.products
        : []

      const combined = [
        ...products.map((p) => ({
          type: "product",
          slug: p.handle,
          updatedAt: p.updated_at,
        })),
      ]

      return { result: combined }
    }
    return { result: [] }
  } catch (err: any) {
    console.error(
      "Error generating sitemap:",
      err?.response?.data || err.message
    )
    return { result: [] }
  }
}

export async function generateSitemaps() {
  return [
    { id: "default" },
    { id: "categories" },
    { id: "products-one" },
    { id: "products-two" },
  ]
}

export default async function sitemap({
  id,
}: any): Promise<MetadataRoute.Sitemap> {
  const { result } = await fetchDynamicData(id)

  const pages = []

  if (id === "default") {
    pages.push(
      ...staticPaths.map((path) => ({
        url: `${siteUrl}/${path}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
      }))
    )
  } else if (id === "categories") {
    pages.push(
      ...result.map((c: any) => {
        const path = `categories/${c.slug}`
        return {
          url: `${siteUrl}/${path}`,
          lastModified: c.updatedAt,
          changeFrequency: "weekly" as const,
        }
      })
    )
  } else if (
    id === "products-one" ||
    id === "products-two" ||
    id === "products-three" ||
    id === "products-four" ||
    id === "products-five"
  ) {
    pages.push(
      ...result.map((p) => {
        const path = `products/${p.slug}`
        return {
          url: `${siteUrl}/${path}`,
          lastModified: p.updatedAt,
          changeFrequency: "weekly" as const,
        }
      })
    )
  }

  return pages
}
