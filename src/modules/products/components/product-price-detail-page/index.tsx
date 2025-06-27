"use client"

import { clx } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import { useEffect, useState } from "react"
import { TranslatedText } from "@modules/common/components/translation/translated-text"

interface ExtendedVariant extends HttpTypes.StoreProductVariant {
  prices: {
    currency_code: string
    amount?: number
  }[]
}

export default function ProductPriceDetailPage({
  product,
  variant,
  region,
}: {
  product: any
  variant?: ExtendedVariant | null
  region: HttpTypes.StoreRegion
}) {
  const [salePrice, setSalePrice] = useState()
  const [orignalPrice, setOrignalPrice] = useState()
  const [currencySymbol, setCurrencySymbol] = useState<string>("")
  const currencySymbols: Record<string, string> = {
    eur: "€",
    inr: "₹",
    kwd: "KWD",
    qar: "QAR",
    sar: "SAR",
    aed: "AED",
    gbp: "£",
    usd: "$",
  }
  const original = Number(orignalPrice)
  const sale = Number(salePrice)
  const showOriginal = original > 0
  const showSale = sale > 0
  const discountPercentage = Math.round(((original - sale) / original) * 100)

  useEffect(() => {
    if (!region?.currency_code) return

    const currencyCode = region.currency_code.toLowerCase()
    const symbol = currencySymbols[currencyCode] || ""
    setCurrencySymbol(symbol)

    const prices = variant?.prices || product?.cheapestVariant?.prices
    if (!prices) return

    const matchedPrices = prices.filter((price: any) =>
      variant
        ? price.currency_code?.toLowerCase() === currencyCode
        : price.currencyCode?.toLowerCase() === currencyCode
    )

    if (matchedPrices.length === 1) {
      setSalePrice(variant ? undefined : matchedPrices[0].salePrice)
      setOrignalPrice(
        variant ? matchedPrices[0].amount : matchedPrices[0].price
      )
    } else if (matchedPrices.length >= 2) {
      setSalePrice(
        variant ? matchedPrices[0].amount : matchedPrices[0].salePrice
      )
      setOrignalPrice(
        variant ? matchedPrices[1].amount : matchedPrices[0].price
      )
    } else {
      console.warn(`No price found for currency code: ${currencyCode}`)
    }
  }, [region, variant])

  return (
    <>
      <div className="flex gap-2 items-center">
        <div className="flex flex-row gap-x-2">
          <span
            className={clx("text-2xl", {
              "text-2xl text-[#c52128] font-semibold": salePrice,
            })}
          >
            {!variant}
            <span
              data-testid="product-price"
              data-value={salePrice}
              className="text-2xl text-[#c52128] font-semibold"
            >
              {currencySymbol} {showSale ? sale : showOriginal ? original : ""}
            </span>
          </span>

          {showOriginal && showSale && discountPercentage ? (
            <p className="sm:ml-2 sm:inline-block sm:self-center ">
              <span
                className="text-lg sm:text-xl text-gray-600 line-through font-semibold mt-[-4px]"
                data-testid="original-product-price"
                data-value={orignalPrice}
              >
                {currencySymbol} {original}
              </span>
            </p>
          ) : null}
          {!orignalPrice && !salePrice && (
            <div className="-ml-2 block w-32 h-9 bg-gray-100 rounded-md animate-pulse" />
          )}
        </div>
        {showOriginal && showSale && discountPercentage ? (
          <span className="text-sm text-white w-fit rounded py-0.5 px-1.5 font-bold bg-[#c52128] ">
            {discountPercentage}
            <TranslatedText text="% off" />
          </span>
        ) : null}
      </div>
      {showOriginal && showSale && discountPercentage ? (
        <p className="text-sm font-medium text-green-600">
          <TranslatedText text="You save" /> {currencySymbol}{" "}
          {Math.round(original - sale)}
        </p>
      ) : null}
    </>
  )
}
