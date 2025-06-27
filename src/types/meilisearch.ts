type ProductVariant = {
  id: string
  prices: Array<{
    currency_code: string
    amount: number
    [key: string]: any
  }>
  [key: string]: any
}

type ProductImage = {
  id: string
  url: string
  alt?: string
  rank: number
}

type ProductOption = {
  id?: string
  title: string
  values: string[]
  [key: string]: any
}

export type meilisearchProductType = {
  id: string
  title: string
  description: string
  brand: string
  colors: string[]
  discountable: boolean
  gender: string
  handle: string
  is_giftcard: boolean
  thumbnail: string
  secondaryImage?: string
  images: ProductImage[]
  options: ProductOption[]
  variants: ProductVariant[]
  cheapestVariant: ProductVariant
  metadata: {
    SizeChart?: string
  }
  sizes: string[]
}
