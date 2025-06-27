import { StorePrice } from "@medusajs/types"

export type FeaturedProduct = {
  id: string
  title: string
  handle: string
  thumbnail?: string
}

export type VariantPrice = {
  calculated_price_number: number
  calculated_price: string
  original_price_number: number
  original_price: string
  currency_code: string
  price_type: string
  percentage_diff: string
}

export type StoreFreeShippingPrice = StorePrice & {
  target_reached: boolean
  target_remaining: number
  remaining_percentage: number
}

export type ProductFilters = {
  collection: {
    id: string
    value: string
  }[]
  type: {
    id: string
    value: string
  }[]
  gender: {
    id: string
    value: string
  }[]
  material: {
    id: string
    value: string
  }[]
}

export type SearchedProduct = {
  id: string
  title: string
  handle: string
  thumbnail: string
  calculated_price: string
  sale_price: string
  regular_price: string
  created_at: string
  updated_at: string
}

export type SearchedProducts = {
  results: SearchedProduct[]
  count: number
}

export type ProductImage = {
  id: string
  url: string
  metadata: any
  created_at: string
  updated_at: string
  product_id: string
  rank: number
}

export type meiliSearchProduct = {
  images: ProductImage[]
  id: string
  title: string
  description: string
  brand: string
  categories: string[]
  colors?: string[]
  gender?: string
  handle: string
  thumbnail?: string
  secondaryImage?: string
  sizes?: string[]
  cheapestVariant?: any
  variants: any
  options: any
}
