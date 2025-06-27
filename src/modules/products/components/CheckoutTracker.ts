"use client"

import { useEffect } from "react";
import { analytics, getDeviceType, getOSInfo } from "@lib/context/segment";
import { StoreCart, StoreCustomer } from "@medusajs/types";

type CheckoutTrackerProps = {
  customer:StoreCustomer | null
    cart: StoreCart;
};

export default function CheckoutTracker({ customer, cart }: CheckoutTrackerProps) {
  useEffect(() => {
    if (customer && cart.items && cart.items.length>0) {
      analytics.track("Checkout Started", {
        userId: customer.id,
        email: customer.email,
        totalValue:cart.total,
        currency:cart.currency_code.toUpperCase(),
        items:cart.items.map((item) => ({
          productId: item.id,
          name: item.title,
          price: item.unit_price,
          quantity: cart.items?.length,
        })),
      },     {
        context: {
          device: {
            type: getDeviceType()
          },
          os: {
            name: getOSInfo().name,
            version:getOSInfo().version
          },
          app: {
            namespace: "com.luxuryforyou",
            name: "Luxury For You",
            version: "1.0.0",
            build: "1001"
          }
        }
      });
    }
    
  }, [customer, cart]);

  return null;
}
