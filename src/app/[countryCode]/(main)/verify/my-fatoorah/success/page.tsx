"use client"

import { placeOrder } from "@lib/data/cart"
import { Button } from "@modules/common/components/ui/button"
import { InfoIcon, Loader } from "lucide-react"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { TranslatedText } from "@modules/common/components/translation/translated-text"
import { updateHsCartToPaid } from "@lib/data/hubspot"

export default function PaymentSuccess() {
  const router = useRouter()
  const [error, setError] = useState(false)
  // const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrderStatus = async () => {
      setLoading(true)
      try {
        const response = await placeOrder()
        console.log("Order placed successfully", response)
        if (response?.type === "order") {
          updateHsCartToPaid()
          const countryCode =
            response.order.shipping_address?.country_code?.toLowerCase()
          router.replace(
            `/${countryCode}/order/${response?.order.id}/confirmed`
          )
        }
        setError(false)
      } catch (err) {
        console.error("Error placing order:", err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchOrderStatus()
  }, [])

  return (
    <div className="flex flex-col justify-center items-center gap-y-4 h-[50vh]">
      {loading ? (
        <>
          <Loader className="animate-spin" />
          <div>
            <TranslatedText text="Verifying payment..." />
          </div>
        </>
      ) : error ? (
        <>
          <div
            className="flex items-center p-4 mb-4 text-sm text-[#991b1b] border border-[#fca5a5] bg-[#fef2f2] rounded-lg gap-1"
            role="alert"
          >
            <InfoIcon />
            <div>
              <TranslatedText text="Payment Failed" />
            </div>
          </div>
          <Link href="/">
            <Button className="text-white bg-black font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center m-2">
              <TranslatedText text="Go to Home" />
            </Button>
          </Link>
        </>
      ) : (
        <>
          <div className="text-green-600">
            <TranslatedText text="Payment Verified Successfully!" />
          </div>
          <div className="flex flex-row space-x-3 items-center">
            <Loader className="animate-spin" />
            <p>
              <TranslatedText text="Redirecting to order completion page" />
            </p>
          </div>
        </>
      )}
    </div>
  )
}
