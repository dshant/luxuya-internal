"use client"
import { HttpTypes } from "@medusajs/types"
import { useEffect, useState } from "react"

type ExtendedLineItem = (HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem) & {
  raw_compare_at_unit_price?: {
    value: number
  }
}

type LineItemPriceProps = {
  item: ExtendedLineItem
  style?: "default" | "tight"
  currencyCode: string
}

const LineItemCart = ({
  item,
  style = "default",
}: LineItemPriceProps) => {

  const [lineThroughPrice, setLineThroughPrice] = useState<number | null>(null)
  useEffect(() => {
    setLineThroughPrice(item.raw_compare_at_unit_price?.value ?? null)
  }, [item])

  return (
    <div className="flex flex-col gap-x-2 text-ui-fg-subtle items-end">
      <div className="text-left">
        {lineThroughPrice &&
          <span className="line-through text-end">${lineThroughPrice}</span>
        }
      </div>
    </div>
  )
}

export default LineItemCart
