"use client"

import { Container, Heading } from "@medusajs/ui"

import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@modules/common/components/ui/button"
import { analytics, getDeviceType, getOSInfo } from "@lib/context/segment"
import { TranslatedText } from "@modules/common/components/translation/translated-text"

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

const Summary = ({ cart }: SummaryProps) => {
  const handleCheckoutClick = async () => {
    let contentIds = ""
    cart.items?.forEach((item, index) => {
      contentIds += item.variant_id

      if (index !== cart.items!.length - 1) {
        contentIds += ","
      }
    })

    await analytics.track(
      "Checkout Started",
      {
        cart_id: cart.id,
        revenue: cart.total || 0,
        customer_id: cart.customer_id,
        contentIds: contentIds,
        coupon: cart.promotions.map((item) => item.code).join(","),
        noOfItems: cart.items?.length,
        items: cart?.items?.map((item) => ({
          product_id: item.variant_id || item.id,
          name: item.product_title || item.title,
          item_group_id: item.product_id,
          variant: item.variant_title,
          price: item.unit_price,
          quantity: item.quantity,
        })),
        currency: cart.region?.currency_code.toUpperCase(),
        //@ts-ignore
        products: cart.items.map((item) => ({
          product_id: item.variant_id || item.id,
          name: item.product_title || item.title,
          variant: item.variant_title,
          price: item.unit_price,
          quantity: item.quantity,
          item_group_id: item.product_id,
        })),
      },
      {
        context: {
          device: {
            type: getDeviceType(),
          },
          os: {
            name: getOSInfo().name,
            version: getOSInfo().version,
          },
          app: {
            namespace: "com.luxuryforyou",
            name: "Luxury For You",
            version: "1.0.0",
            build: "1001",
          },
        },
      }
    )
  }

  const step = getCheckoutStep(cart)

  return (
    <div className="w-full rounded-lg px-6 py-4">
      <div className="flex flex-col gap-y-4">
        <Heading level="h2" className="text-[1.5rem] leading-[2.75rem]">
          <TranslatedText text="Summary" />
        </Heading>
        <DiscountCode cart={cart} />
        <Divider />
        <CartTotals totals={cart} />
        <LocalizedClientLink
          href={"/checkout?step=" + step}
          data-testid="checkout-button"
          className="sticky bottom-0"
        >
          <Button
            className="w-full h-10 bg-red-700 hover:bg-red-800 text-white"
            onClick={handleCheckoutClick}
          >
            <TranslatedText text="Go to checkout" />
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default Summary
