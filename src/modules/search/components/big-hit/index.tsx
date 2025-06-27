import { Container, Text } from "@medusajs/ui"

import Thumbnail from "@modules/products/components/thumbnail"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import ProductImage from "@modules/products/components/ProductImage"

export type ProductHit = {
  id: string
  title: string
  handle: string
  description: string | null
  thumbnail: string | null
  variants: HttpTypes.StoreProductVariant[]
  collection_handle: string | null
  collection_id: string | null
} & Record<string, any>

type HitProps = {
  hit: ProductHit
}

const BigHit = ({ hit }: HitProps) => {

  return (
    <LocalizedClientLink
      href={`/products/${hit.handle}`}
      data-testid="search-result"
    >
      <Container
        key={hit.id}
        className="sm:flex-col gap-2 w-full p-4 shadow-elevation-card-rest hover:shadow-elevation-card-hover items-center sm:justify-center"
      >
        <Thumbnail
          thumbnail={hit.thumbnail}
          size="square"
          className="group h-full w-full sm:h-full sm:w-full"
        />
    

        <div className="flex flex-col mt-4 w-full">

          <div className="flex flex-col">
            <h4 className="w-9/10 mt-2 truncate font-semibold">
              {hit.brand}
            </h4>
            <h6 className="mt-2 w-full text-wrap font-semibold text-gray-500">

              {hit.title}
            </h6>
          </div>
        </div>
      </Container>
    </LocalizedClientLink>
  )
}

export default BigHit
