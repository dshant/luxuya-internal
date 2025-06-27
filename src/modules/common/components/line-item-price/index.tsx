"use client"
import { getPercentageDiff } from "@lib/util/get-precentage-diff"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import { TranslatedText } from "../translation/translated-text"
import { useEffect, useState } from "react"

type LineItemPriceProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  style?: "default" | "tight"
  currencyCode: string
}

const LineItemPrice = ({
  item,
  style = "default",
  currencyCode,
}: LineItemPriceProps) => {

  const { total, original_total } = item
  const adjustmentsSum = (item.adjustments || []).reduce(
    (acc, adjustment) => adjustment.amount + acc,
    0
  )
  // useEffect(() => {
  //   setlineThroughPrice(item?.raw_compare_at_unit_price.value)
  // }, [item])

  const originalPrice = original_total
  const currentPrice = total - adjustmentsSum
  const hasReducedPrice = currentPrice < originalPrice

  return (
    <div className="flex flex-col gap-x-2 text-ui-fg-subtle items-end">
      <div className="text-left">
        {hasReducedPrice && (
          <>
            <p>
              {style === "default" && (
                <span className="text-ui-fg-subtle"><TranslatedText text="Original: " /></span>
              )}
              <span
                className="line-through text-ui-fg-muted"
                data-testid="product-original-price"
              >
                {convertToLocale({
                  amount: originalPrice,
                  currency_code: currencyCode,
                })}
              </span>
            </p>
            {style === "default" && (
              <span className="text-ui-fg-interactive">
                -{getPercentageDiff(originalPrice, currentPrice || 0)}%
              </span>
            )}
          </>
        )}
        <div
          className={clx("text-base-regular flex flex-col justify-end", {
            "text-ui-fg-interactive": hasReducedPrice,
          })}
          data-testid="product-price"
        >
          {/* <span className="line-through text-end">${lineThroughPrice}</span> */}
          <span>
            {convertToLocale({
              amount: currentPrice,
              currency_code: currencyCode,
            })}
          </span>
        </div>
      </div>
    </div>
  )
}

export default LineItemPrice
