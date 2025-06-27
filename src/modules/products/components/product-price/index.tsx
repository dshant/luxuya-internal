import { clx } from "@medusajs/ui"

import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import { meiliSearchProduct } from "types/global"

export default function ProductPrice({
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
      <div className="flex flex-col sm:flex-row gap-y-0 sm:gap-y-2">
        <span
          className={clx("text-2xl", {
            "text-2xl text-red-500 font-semibold": salePrice,
          })}
        >
          {!variant}
          <span
            data-testid="product-price"
            data-value={salePrice}
            className={clx("text-2xl", {
              "text-2xl text-red-500 font-semibold": salePrice,
            })}
          >
            {currencySymbol}
            {salePrice !== 0 ? salePrice : selectedPrice}
          </span>
        </span>

        {selectedPrice && salePrice !== 0 && (
          <p className="sm:ml-2 sm:inline-block sm:self-center ">
            <span
              className="text-lg sm:text-xl text-gray-600 line-through font-semibold mt-[-4px]"
              data-testid="original-product-price"
              data-value={selectedPrice}
            >
              {currencySymbol}
              {salePrice !== 0 ? selectedPrice : null}
            </span>
          </p>
        )}
      </div>

      {/* {selectedPrice && salePrice !== 0 && (
        <span className="text-sm font-medium text-red-600">
          {Math.round(((selectedPrice - salePrice) / selectedPrice) * 100)}% off
        </span>
      )} */}
    </div>
  )
}
