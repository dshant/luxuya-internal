"use client"

import { convertToLocale } from "@lib/util/money"
import React, { useState, useEffect } from "react"
import { TranslatedText } from "../translation/translated-text"
import { HttpTypes, StoreCartShippingMethod } from "@medusajs/types"
import { setShippingMethod } from "@lib/data/cart"
import Divider from "@modules/common/components/divider"

type CartTotalsProps = {
  totals: {
    id: string
    total?: number | null
    subtotal?: number | null
    tax_total?: number | null
    shipping_total?: number | null
    discount_total?: number | null
    gift_card_total?: number | null
    currency_code: string
    shipping_subtotal?: number | null
    shipping_methods: StoreCartShippingMethod[]
  },
  availableShippingMethods: HttpTypes.StoreCartShippingOption[] | null
}

const CartTotals: React.FC<CartTotalsProps> = ({ totals, availableShippingMethods }) => {
  const {
    id: cartId,
    currency_code,
    total: initialTotal,
    subtotal,
    tax_total,
    discount_total,
    gift_card_total,
    shipping_subtotal: initialShippingSubtotal,
    shipping_methods
  } = totals

  const [shippingMethodId, setShippingMethodId] = useState<string | null>(
    shipping_methods?.at(-1)?.shipping_option_id || null
  )

  const handleSetShippingMethod = async (id: string) => {
    // setError(null)
    let currentId: string | null = null
    // setIsLoading(true)
    setShippingMethodId((prev) => {
      currentId = prev
      return id
    })

    await setShippingMethod({ cartId: cartId, shippingMethodId: id })
      .catch((err) => {
        setShippingMethodId(currentId)
        // setError(err.message)
      })
      .finally(() => {
        // setIsLoading(false)
      })
  }

  useEffect(() => {
    if (!shippingMethodId && availableShippingMethods?.length) {
      const defaultMethod = availableShippingMethods[0]
      handleSetShippingMethod(defaultMethod.id)
    }
  }, [availableShippingMethods, shippingMethodId])

  const [isLoading, setIsLoading] = useState({
    shipping: true,
    total: true,
  })

  const [shipping_subtotal, setShippingSubtotal] = useState<number | null>(null)
  const [total, setTotal] = useState<number | null>(null)

  const LoadingPlaceholder = () => (
    <span className="flex items-center justify-center w-6 h-6">
      <span className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent text-black"></span>
    </span>
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      setShippingSubtotal(initialShippingSubtotal ?? 0)
      setTotal(initialTotal ?? 0)
      setIsLoading({
        shipping: false,
        total: false,
      })
    })
    return () => clearTimeout(timer)
  }, [initialShippingSubtotal, initialTotal])

  return (
    <div>

      <div className="flex flex-col gap-y-2 txt-medium text-ui-fg-subtle">
        <div className="flex items-center justify-between">
          <span className="flex gap-x-1 items-center">
            <TranslatedText text="Subtotal (excl. shipping costs )" />
          </span>
          <span data-testid="cart-subtotal" data-value={subtotal || 0}>
            {convertToLocale({ amount: subtotal ?? 0, currency_code })}
          </span>
        </div>
        {!!discount_total && (
          <div className="flex items-center justify-between">
            <span><TranslatedText text="Discount" /></span>
            <span
              className="text-ui-fg-interactive"
              data-testid="cart-discount"
              data-value={discount_total || 0}
            >
              -{" "}
              {convertToLocale({ amount: discount_total ?? 0, currency_code })}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span><TranslatedText text="Shipping" /></span>
          <span data-testid="cart-shipping" data-value={shipping_subtotal || 0}>
            {isLoading.shipping ? (
              <LoadingPlaceholder />
            ) : (
              convertToLocale({ amount: shipping_subtotal ?? 0, currency_code })
            )}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="flex gap-x-1 items-center"><TranslatedText text="Taxes" /></span>
          <span data-testid="cart-taxes" data-value={tax_total || 0}>
            {convertToLocale({ amount: tax_total ?? 0, currency_code })}
          </span>
        </div>
        {!!gift_card_total && (
          <div className="flex items-center justify-between">
            <span><TranslatedText text="Gift card" /></span>
            <span
              className="text-ui-fg-interactive"
              data-testid="cart-gift-card-amount"
              data-value={gift_card_total || 0}
            >
              -{" "}
              {convertToLocale({ amount: gift_card_total ?? 0, currency_code })}
            </span>
          </div>
        )}
      </div>
      <div className="h-px w-full border-b border-gray-200 mt-4" />
      {/* <Divider /> */}
      <div className="flex items-center justify-between text-ui-fg-base mt-3 mb-3 txt-medium">
        <span><TranslatedText text="Total" /></span>
        <span
          className="txt-xlarge-plus"
          data-testid="cart-total"
          data-value={total || 0}
        >
          {isLoading.total ? (
            <LoadingPlaceholder />
          ) : (
            convertToLocale({ amount: total ?? 0, currency_code })
          )}
        </span>
      </div>
    </div>
  )
}

export default CartTotals