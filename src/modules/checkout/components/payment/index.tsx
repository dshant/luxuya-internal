"use client"

import { RadioGroup } from "@headlessui/react"
import { analytics } from "@lib/context/segment"
import { initiatePaymentSession, placeOrder } from "@lib/data/cart"
import { CheckCircleSolid, CreditCard } from "@medusajs/icons"
import { Button, Container, Heading, Text, clx } from "@medusajs/ui"
import ErrorMessage from "@modules/checkout/components/error-message"
import PaymentContainer from "@modules/checkout/components/payment-container"
import { StripeContext } from "@modules/checkout/components/payment-wrapper/stripe-wrapper"
import Divider from "@modules/common/components/divider"
import { CardElement } from "@stripe/react-stripe-js"
import { StripeCardElementOptions } from "@stripe/stripe-js"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import Script from "next/script"
import { method, set } from "lodash"
import MyFatoorahModal from "./myfatoorah-payment-modal"
import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { updateHsCartToPaid } from "@lib/data/hubspot"

const Payment = ({
  cart,
  availablePaymentMethods,
}: {
  cart: any
  availablePaymentMethods: any[]
}) => {
  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession: any) => paymentSession.status === "pending"
  )
  const [isLoading, setIsLoading] = useState(false)
  const [isEmbeddedLoading, setIsEmbeddedLoading] = useState(true)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? ""
  )
  const [myFatoorahScriptUrl, setMyFatoorahScriptUrl] = useState<string | null>(
    null
  )
  const [myfatoorahRedirectUrl, setMyfatoorahRedirectUrl] = useState<
    string | null
  >()
  const [myFatoorahError, setMyFatoorahError] = useState<string | null>()
  const [myFatoorahSessionId, setMyFatoorahSessionId] = useState<
    string | null
  >()
  const [myFatoorahCountryCode, setMyFatoorahCountryCode] = useState<
    string | null
  >()
  const [myFatoorahCurrencyCode, setMyFatoorahCurrencyCode] = useState<
    string | null
  >()
  const [myFatoorahAmount, setMyFatoorahAmount] = useState<number | null>()
  const [sessionReady, setSessionReady] = useState(false)

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "payment"
  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const paymentReady =
    (activeSession && cart?.shipping_methods.length !== 0) || paidByGiftcard

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

  useEffect(() => {
    if (cart?.region) {
      const regionCurrency = cart?.region.currency_code?.toLowerCase()
      if (regionCurrency === "sar") {
        setMyFatoorahScriptUrl(
          "https://sa.myfatoorah.com/payment/v1/session.js"
        )
      } else if (regionCurrency === "qar") {
        setMyFatoorahScriptUrl(
          "https://qa.myfatoorah.com/payment/v1/session.js"
        )
      } else if (regionCurrency === "egp") {
        setMyFatoorahScriptUrl(
          "https://eg.myfatoorah.com/payment/v1/session.js"
        )
      } else {
        setMyFatoorahScriptUrl(
          "https://portal.myfatoorah.com/payment/v1/session.js"
        )
      }
    }
  }, [cart?.region])

  useEffect(() => {
    const initiatePayment = async () => {
      setSelectedPaymentMethod("pp_MyFatoorah_my-fatoorah")
      const data: {
        provider_id: string
        context?: { extra: any }
      } = {
        provider_id: "pp_MyFatoorah_my-fatoorah",
        context: {
          extra: {
            cart,
          },
        },
      }
      const response = await initiatePaymentSession(cart, data)
      setMyFatoorahSessionId(
        // @ts-ignore
        response?.payment_collection?.payment_sessions?.[0]?.data?.session?.Data
          ?.SessionId
      )

      setMyFatoorahCountryCode(
        // @ts-ignore
        response?.payment_collection?.payment_sessions?.[0]?.data?.session?.Data
          ?.CountryCode
      )

      setMyFatoorahCurrencyCode(
        // @ts-ignore
        response?.payment_collection?.payment_sessions?.[0]?.data?.payment?.Data
          ?.PaymentMethods?.[0]?.CurrencyIso
      )

      setMyFatoorahAmount(response?.payment_collection?.amount)
      setSessionReady(true)
    }

    if (cart.customer?.id) {
      console.log("Initiating payment")
      initiatePayment()
    }
  }, [cart?.customer?.id])

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (!event.data) return

      try {
        const message = JSON.parse(event.data)

        if (message.data?.IsSuccess === false) {
          if (message.data?.ValidationErrors?.[0]?.Name === "SessionId") {
            console.log("Refreshing session due to error")
            sessionStorage.setItem("reloadForSessionError", "true")
            window.location.reload()
          } else {
            setMyFatoorahError(message.data?.Data || "Payment failed")
            setIsLoading(false)
            return
          }
        }
        setMyfatoorahRedirectUrl(null)

        if (message.sender === "MF-3DSecure") {
          const url: string = message.url

          if (url && url.includes("my-fatoorah/success")) {
            try {
              const response = await placeOrder()
              if (response?.type === "order") {
                updateHsCartToPaid()
                const countryCode =
                  response.order.shipping_address?.country_code?.toLowerCase()
                router.replace(
                  `/${countryCode}/order/${response?.order.id}/confirmed`
                )
              }
              // setError(false)
            } catch (err) {
              console.error("Error placing order:", err)
              // setError(true)
            } finally {
              // setLoading(false)
            }
          } else {
            console.error("Payment failed or cancelled")
            setMyFatoorahError("Payment failed or cancelled. Please try again.")
            setIsLoading(false)
            // setError(true)
          }
        }
      } catch (error) {
        console.error("Error parsing 3DS message", error)
      }
    }

    window.addEventListener("message", handleMessage, false)

    // Clean up
    return () => {
      window.removeEventListener("message", handleMessage, false)
    }
  }, [])

  const paymentCallback = async (response: any) => {
    if (response.isSuccess) {
      switch (response.paymentType) {
        case "ApplePay":
          console.log("ApplePay response:", JSON.stringify(response))
          break
        case "GooglePay":
          console.log("GooglePay response:", JSON.stringify(response))
          break
        case "Card":
          console.log("Card response:", response)
          // const sampleResponse = `{"isSuccess":true,"paymentType":"Card","sessionId":"cf68a2b2-027c-41f5-8c07-bd6f4a5021a3","card":{"brand":"Visa","identifier":"b4eda25d8a64929c02240406fc5cdc5417e4d021e1d055e43edb61e8d4903cfa","token":"Token0106211226435","number":"450875xxxxxx1019","nameOnCard":"Muhammad","expiryYear":"26","expiryMonth":"06","issuer":"The Co-Operative Bank Plc","issuerCountry":"GBR","fundingMethod":"debit","productName":"Visa Classic"}}`
          await sdk.client
            .fetch(`/store/my-fatoorah/execute-payment`, {
              method: "POST",
              body: {
                sessionId: response.sessionId,
                invoiceValue: 100,
                countryCode: cart?.region?.name?.toLowerCase(),
              },
              cache: "no-cache",
            })
            .then((executeResponse: any) => {
              setMyfatoorahRedirectUrl(executeResponse.Data?.PaymentURL)
            })
            .catch((error: any) =>
              console.log("Error executing payment", error)
            )

          break
        default:
          console.log("Unknown payment type")
          break
      }
    } else {
      console.error("Payment failed:", response.errorMessage)
      setIsLoading(false)
    }
  }

  const handleSubmitFatoorahCard = async () => {
    try {
      analytics.track("Payment Info Entered", {
        currency_code: cart.currency_code,
        value: cart.total,
        payment_method: selectedPaymentMethod,
        customer_id: cart.customer_id,
        items: cart.items?.map((item: any) => ({
          item_id: item.product_title || item.id,
          item_group_id: item.product_id,
          item_name: item.variant_id || item.title,
          price: item.unit_price,
          quantity: item.quantity,
        })),
      })
    } catch (err) {
      console.log(err)
    }
    setMyFatoorahError(null)
    setIsLoading(true)
    // @ts-ignore
    myfatoorah.submitCardPayment()
  }

  const myFatoorahInitialization = (
    sessionId: string,
    countryCode: string,
    currencyCode: string,
    amount: number
  ) => {
    console.log("Load My Fatoorah CC Form")
    if (sessionId && countryCode && currencyCode) {
      const config = {
        sessionId,
        countryCode,
        currencyCode,
        amount,
        callback: paymentCallback,
        paymentOptions: ["Card"],
        settings: {
          card: {
            containerId: "myfatoorah-card-container",
            error: {
              borderColor: "red",
              borderRadius: "8px",
            },
            style: {
              cardHeight: "140px",
              tokenHeight: "240px",
              separator: {
                useCustomSeparator: false,
                textContent: "Please enter card details",
                lineStyle: "none",
              },
              padding: "0",
              margin: "0",
              input: {
                margin: "0",
                padding: "0",
                inputMargin: "4px",
                placeHolder: {
                  holderName: "Name On Card",
                  cardNumber: "Number",
                  expiryDate: "MM/YY",
                  securityCode: "CVV",
                },
              },
              button: {
                useCustomButton: true,
              },
            },
          },
        },
      }
      {
        isOpen && setIsEmbeddedLoading(false)
      }

      // @ts-ignore
      myfatoorah.init(config)
    }
  }

  useEffect(() => {
    console.log(
      "My Fatoorah",
      isOpen,
      sessionReady,
      myFatoorahScriptUrl,
      myFatoorahSessionId,
      myFatoorahCountryCode,
      myFatoorahCurrencyCode,
      myFatoorahAmount
    )
  }, [
    isOpen,
    sessionReady,
    myFatoorahScriptUrl,
    myFatoorahSessionId,
    myFatoorahCountryCode,
    myFatoorahCurrencyCode,
    myFatoorahAmount,
  ])

  useEffect(() => {
    const allReady =
      isOpen &&
      sessionReady &&
      myFatoorahScriptUrl &&
      myFatoorahSessionId &&
      myFatoorahCountryCode &&
      myFatoorahCurrencyCode &&
      myFatoorahAmount

    console.log("All Ready:", allReady)

    if (!allReady) return

    const myFatoorahScript = document.getElementById("myfatoorah-script")
    const myFatoorahWrapper = document.getElementById("myfatoorah-card-wrapper")
    const myFatoorahContainer = document.getElementById(
      "myfatoorah-card-container"
    )
    console.log("Already Loaded:", myFatoorahScript)

    if (myFatoorahScript) {
      myFatoorahScript.remove()
      myFatoorahContainer?.remove()
      if (myFatoorahWrapper) {
        const myFatoorahDiv = document.createElement("div")
        myFatoorahDiv.id = "myfatoorah-card-container"
        myFatoorahWrapper.appendChild(myFatoorahDiv)
        myFatoorahDiv.style.width = "100%"
        myFatoorahDiv.style.height = "100%"
      }
    }

    const script = document.createElement("script")
    // script.src = "https://demo.myfatoorah.com/payment/v1/session.js"
    script.src = myFatoorahScriptUrl
    script.id = "myfatoorah-script"
    script.onload = () => {
      myFatoorahInitialization(
        myFatoorahSessionId,
        myFatoorahCountryCode,
        myFatoorahCurrencyCode,
        myFatoorahAmount
      )
    }
    document.body.appendChild(script)
  }, [
    isOpen,
    sessionReady,
    myFatoorahSessionId,
    myFatoorahCountryCode,
    myFatoorahCurrencyCode,
    myFatoorahAmount,
  ])

  return (
    <div className="bg-white">
      {/* {isOpen &&
        sessionReady &&
        myFatoorahScriptUrl &&
        myFatoorahSessionId &&
        myFatoorahCountryCode &&
        myFatoorahCurrencyCode &&
        myFatoorahAmount ? (
        <Script
          id="my-fatoorah-script"
          // src={myFatoorahScriptUrl}
          src="https://demo.myfatoorah.com/payment/v1/session.js"
          onLoad={() => {
            myFatoorahInitialization(
              myFatoorahSessionId,
              myFatoorahCountryCode,
              myFatoorahCurrencyCode,
              myFatoorahAmount
            )
          }}
        />
      ) : null} */}

      {myfatoorahRedirectUrl && (
        <MyFatoorahModal
          onClose={() => {
            setMyfatoorahRedirectUrl(null)
            setIsLoading(false)
          }}
          url={myfatoorahRedirectUrl}
        />
      )}

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
        <div className="relative w-full min-h-[200px]">
          {isEmbeddedLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-white bg-opacity-70">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent text-black"></div>
            </div>
          )}
          <div className="flex flex-col mb-5">
            <div
              id="myfatoorah-card-wrapper"
              className="flex flex-col items-center justify-center"
            >
              <div
                id="myfatoorah-card-container"
                className="w-full h-full"
              ></div>
            </div>
            <ErrorMessage
              error={myFatoorahError}
              data-testid="payment-method-error-message"
            />
            <Button
              size="large"
              className="mt-"
              onClick={handleSubmitFatoorahCard}
              isLoading={isLoading}
              data-testid="submit-payment-button"
            >
              Pay Now
            </Button>
          </div>
        </div>
      )}

      <div>
        {/* <div className={isOpen ? "block" : "hidden"}>
          <div className="mt-8" id="embedded-payment"></div>



          <Button
            size="large"
            className="mt-6"
            onClick={handleSubmit}
            isLoading={isLoading}
            data-testid="submit-payment-button"
          >
            Pay Now
          </Button>
        </div> */}

        <div className={isOpen ? "hidden" : "block"}>
          {cart && paymentReady && activeSession ? (
            <div className="flex items-start gap-x-1 w-full mb-3">
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Payment method
                </Text>
                <Text
                  className="txt-medium text-ui-fg-subtle"
                  data-testid="payment-method-summary"
                >
                  MyFatoorah
                </Text>
              </div>
            </div>
          ) : paidByGiftcard ? (
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                Payment method
              </Text>
              <Text
                className="txt-medium text-ui-fg-subtle"
                data-testid="payment-method-summary"
              >
                Gift card
              </Text>
            </div>
          ) : null}
        </div>
      </div>

      {/* <Divider className="mt-8" /> */}
    </div>
  )
}

export default Payment
