"use client"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import Script from "next/script"

const Wallets = ({ cart }: { cart: any }) => {
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
              // setMyfatoorahRedirectUrl(executeResponse.Data?.PaymentURL)
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
    }
  }

  return (
    <div>
      <Script
        src="https://demo.myfatoorah.com/payment/v1/session.js"
        onLoad={() => {
          if (cart?.payment_collection.payment_sessions?.[0]) {
            const sessionId =
              cart?.payment_collection.payment_sessions?.[0]?.data?.session
                ?.Data?.SessionId
            const countryCode =
              cart?.payment_collection.payment_sessions?.[0]?.data?.session
                ?.Data?.CountryCode
            const currencyCode =
              cart?.payment_collection.payment_sessions?.[0]?.data?.payment
                ?.Data?.PaymentMethods?.[0]?.CurrencyIso
            const amount = cart?.payment_collection.amount
            if (sessionId && countryCode && currencyCode) {
              const config = {
                sessionId,
                countryCode,
                currencyCode,
                amount,
                callback: paymentCallback,
                // containerId: "embedded-payment",
                paymentOptions: ["ApplePay", "GooglePay", "Card"],
                settings: {
                  card: {
                    containerId: "myfatoorah-card-container",
                  },
                  googlePay: {
                    containerId: "google-pay-container",
                  },
                  applePay: {
                    containerId: "apple-pay-container",
                  },
                },
              }
              // @ts-ignore
              myfatoorah.init(config)
            }
          }
        }}
      />
      <div id="apple-pay-container"></div>
      <div id="google-pay-container"></div>
    </div>
  )
}

export default Wallets
