import React from "react"
import PreviewPrice from "../product-preview/price"
import { HttpTypes } from "@medusajs/types"
import { getProductPrice } from "@lib/util/get-product-price"
import ClientProductActions from "../ClientProductActions"
import { meiliSearchProduct } from "types/global"

const ProductCard = ({
  meiliSearchProduct,
  region,
}: {
  meiliSearchProduct: meiliSearchProduct
  region: HttpTypes.StoreRegion
}) => {
  return (
    <div>
      <ClientProductActions product={meiliSearchProduct} region={region} />
    </div>
  )
}

export default ProductCard
