import { clx } from "@medusajs/ui"

import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import { meiliSearchProduct } from "types/global"

export default function ProductDiscount({
  product,
  variant,
  region,
}: {
  product: meiliSearchProduct
  variant?: HttpTypes.StoreProductVariant | null
  region?: HttpTypes.StoreRegion
}) {
  const regionCurrencyCode = region?.currency_code
  const currencySymbol =
    regionCurrencyCode === "inr"
      ? "₹"
      : regionCurrencyCode === "eur"
      ? "€"
      : regionCurrencyCode === "kwd"
      ? "د.ك"
      : regionCurrencyCode === "sar"
      ? "﷼"
      : regionCurrencyCode === "qar"
      ? "﷼"
      : regionCurrencyCode === "aed"
      ? "د.إ"
      : regionCurrencyCode === "gbp"
      ? "£"
      : regionCurrencyCode === "usd"
      ? "$"
      : "$"

  const selectedPriceObject = product.cheapestVariant?.prices.find(
    (price: { currencyCode: string }) =>
      price.currencyCode.toLowerCase() === regionCurrencyCode?.toLowerCase()
  )
  const selectedPrice = selectedPriceObject?.price || 0

  const salePrice = Number(selectedPriceObject?.salePrice || 0)

  if (!selectedPrice) {
    return <div className="block w-32 h-9 bg-gray-100 animate-pulse" />
  }

  return (
    <div className="flex flex-col">
      {selectedPrice && salePrice !== 0 && (
        <span className="text-sm font-medium text-red-600 mt-2 ml-2 ">
          {Math.round(((selectedPrice - salePrice) / selectedPrice) * 100)}% off
        </span>
      )}
    </div>
  )
}
