"use client"
import { useEffect } from "react"
import { analytics, getDeviceType, getOSInfo } from "@lib/context/segment"
import { HttpTypes } from "@medusajs/types"

type OrderTrackingProps = {
  order: HttpTypes.StoreOrder
}

export const OrderTracking = ({ order }: OrderTrackingProps) => {
  useEffect(() => {
    if (order) {
      let contentIds = ""

      order.items?.forEach((item, index) => {
        contentIds += item.variant_id

        if (index !== order.items!.length - 1) {
          contentIds += ","
        }
      })
      analytics.track(
        "Order Completed",
        {
          total: order.total,
          noi: order.items?.length,
          currency: order.currency_code.toUpperCase(),
          user_id: order.customer_id,
          contentIds: contentIds,
          shipping_method: order?.shipping_methods?.[0]?.name,
          payment_method:
            order?.payment_collections?.[0]?.payments?.[0]?.provider_id,
          tax: order.shipping_total,
          order_id: order.id,
          products: order.items?.map((item) => ({
            product_id: item.variant_id || item.id,
            item_group_id: item.product_id,
            product_name: item.product?.title,
            variant:item.variant_title,
            price: item.unit_price,
            quantity: item.quantity,
            currency: order.currency_code.toUpperCase(),
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
  }, [order])

  return null
}

export default OrderTracking
