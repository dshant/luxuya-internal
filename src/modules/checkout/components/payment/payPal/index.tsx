"use client"
import React, { useCallback, useState } from "react"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import { initiatePaymentSession, placeOrder } from "@lib/data/cart"
import { updateHsCartToPaid } from "@lib/data/hubspot"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button, Container, Heading, Text, clx } from "@medusajs/ui"
import { CheckCircleSolid } from "@medusajs/icons"
import ErrorMessage from "../../error-message"

const PaypalMedusaProvider = "pp_paypal_paypal"

const PaypalPayment = ({
  cart,
  availablePaymentMethods,
}: {
  cart: any
  availablePaymentMethods: any[]
}) => {
  const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
    // "enable-funding": "venmo",
    currency: cart?.region?.currency_code.toUpperCase(),
  }

  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession: any) => paymentSession.status === "pending"
  )

  const paymentReady = activeSession && cart?.shipping_methods.length !== 0

  const searchParams = useSearchParams()
  const pathname = usePathname()
  const isOpen = searchParams.get("step") === "payment"
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [isCardLoading, setIsCardLoading] = useState(true)
  const [isRedirecting, setIsRedirecting] = useState(false)

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const handleEdit = () => {
    router.push(pathname + "?" + createQueryString("step", "payment"), {
      scroll: false,
    })
  }

  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-2xl md:text-3xl-regular gap-x-2 items-baseline mb-3 lg:my-5",
            {
              "opacity-50 pointer-events-none select-none":
                !isOpen && !paymentReady,
            }
          )}
        >
          Payment
          {!isOpen && paymentReady && <CheckCircleSolid />}
        </Heading>
        {!isOpen && paymentReady && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              data-testid="edit-payment-button"
            >
              Edit
            </button>
          </Text>
        )}
      </div>

      {isOpen && (
        <div>
          <PayPalScriptProvider options={initialOptions}>
            {isCardLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-10 bg-white bg-opacity-70">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-current border-t-transparent text-black"></div>
              </div>
            )}
            <div className="relative w-full z-0">
              <PayPalButtons
                style={{
                  shape: "rect",
                  layout: "vertical",
                  color: "gold",
                  label: "paypal",
                }}
                onInit={() => {
                  setIsCardLoading(false)
                }}
                createOrder={async () => {
                  const data: {
                    provider_id: string
                    context?: { extra: any }
                  } = {
                    provider_id: PaypalMedusaProvider,
                    context: { extra: { cart_id: cart?.id } },
                  }
                  try {
                    const response = await initiatePaymentSession(cart, data)
                    console.log("Paypal CreateOrder Response", response)

                    const paymentSession =
                      response?.payment_collection?.payment_sessions?.[0]

                    // @ts-ignore
                    const orderId = paymentSession?.data?.paypal?.id

                    console.log("Paypal CreateOrder Response", orderId)

                    return orderId
                  } catch (error) {
                    console.error("Paypal Create Order Error", error)
                    setMessage(`Something went wrong! Please try again later`)
                    throw new Error("Failed to create PayPal order")
                  }
                }}
                onApprove={async (data, actions) => {
                  try {
                    setIsRedirecting(true)

                    const response = await fetch(
                      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/paypal/capture-order`,
                      {
                        body: JSON.stringify({
                          order_id: data.orderID,
                        }),
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          "x-publishable-api-key":
                            process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
                        },
                      }
                    )
                    const orderData = await response.json()
                    console.log("Order Data", orderData)
                    const errorDetail = orderData?.details?.[0]

                    if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
                      return actions.restart()
                    } else if (errorDetail) {
                      throw new Error(
                        `${errorDetail.description} (${orderData.debug_id})`
                      )
                    } else {
                      const transaction =
                        orderData.purchase_units[0].payments.captures[0]
                      console.log(
                        "Capture result",
                        orderData,
                        JSON.stringify(orderData, null, 2)
                      )

                      const placedOrder = await placeOrder()
                      console.log("Placed Order Response:", placedOrder)

                      if (placedOrder?.type === "order") {
                        updateHsCartToPaid()

                        const countryCode =
                          placedOrder.order.shipping_address?.country_code?.toLowerCase()
                        console.log(
                          "Redirecting to:",
                          `/${countryCode}/order/${placedOrder?.order.id}/confirmed`
                        )
                        // setIsRedirecting(true);

                        router.replace(
                          `/${countryCode}/order/${placedOrder?.order.id}/confirmed`
                        )
                      } else {
                        throw new Error("Order placement failed")
                      }
                    }
                  } catch (error) {
                    console.error(error)
                    setMessage(
                      `Sorry, your transaction could not be processed..`
                    )
                    setIsRedirecting(false)
                  }
                }}
              />
            </div>
          </PayPalScriptProvider>
          <ErrorMessage
            error={message}
            data-testid="payment-method-error-message"
          />
        </div>
      )}
      {isRedirecting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/60">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-black border-t-transparent"></div>
          </div>
        </div>
      )}
    </>
  )
}

export default PaypalPayment
