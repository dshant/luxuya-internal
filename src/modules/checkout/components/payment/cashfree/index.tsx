// @ts-ignore
import { load } from "@cashfreepayments/cashfree-js"
import { Button } from "@medusajs/ui"
import { useState, useEffect } from "react"
import { placeOrder } from "@lib/data/cart"
import { updateHsCartToPaid } from "@lib/data/hubspot"
import { useRouter } from "next/navigation"

interface CashfreeProps {
  paymentSessionId: string
}

function Cashfree({ paymentSessionId }: CashfreeProps) {
  const router = useRouter()
  const [cashfree, setCashfree] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const initializeSDK = async function () {
      const cashfree = await load({
        mode: "sandbox",
      })
      setCashfree(cashfree)
    }
    initializeSDK()
  }, [])

  const doPayment = async () => {
    setIsLoading(true)
    let checkoutOptions = {
      paymentSessionId: paymentSessionId || "",
      redirectTarget: "_modal",
    }
    cashfree.checkout(checkoutOptions).then(async (result: any) => {
      if (result.error) {
        // This will be true whenever user clicks on close icon inside the modal or any error happens during the payment
        console.log(
          "User has closed the popup or there is some payment error, Check for Payment Status"
        )
        console.log(result.error)
        setIsLoading(false)
      }
      if (result.redirect) {
        // This will be true when the payment redirection page couldnt be opened in the same window
        // This is an exceptional case only when the page is opened inside an inAppBrowser
        // In this case the customer will be redirected to return url once payment is completed
        console.log("Payment will be redirected")
      }
      if (result.paymentDetails) {
        // This will be called whenever the payment is completed irrespective of transaction status
        console.log("Payment has been completed, Check for Payment Status")
        console.log(result.paymentDetails.paymentMessage)
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
            // setIsLoading(false)
          }
          // setError(false)
        } catch (err) {
          // console.error("Error placing order:", err)
          // setError(true)
        } finally {
          // setIsLoading(false)
        }
      }
    })
  }

  return (
    <div className="row">
      <Button onClick={doPayment} size="large" isLoading={isLoading}>
        Pay Now
      </Button>
    </div>
  )
}

export default Cashfree
