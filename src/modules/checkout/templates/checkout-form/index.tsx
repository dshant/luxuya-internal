import { getHsCustomerEmail } from "@lib/data/cookies"
import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import { HttpTypes } from "@medusajs/types"
import Addresses from "@modules/checkout/components/addresses"
import MyFatoorahPayment from "@modules/checkout/components/payment/myFatoorah"
import PayPalPayment from "@modules/checkout/components/payment/payPal"
import Review from "@modules/checkout/components/review"
import Shipping from "@modules/checkout/components/shipping"
import { SubmitButton } from "../../components/submit-button"
import { useActionState } from "react"
import { setAddresses } from "@lib/data/cart"
import { Heading, Text, useToggleState } from "@medusajs/ui"
import compareAddresses from "@lib/util/compare-addresses"
import BillingAddress from "@modules/checkout/components/billing_address"
import CheckoutComponent from "@modules/checkout/components/checkout-component"
import Wallets from "@modules/checkout/components/wallets"
import CheckoutTotals from "@modules/checkout/components/checkout-totals"


export default async function CheckoutForm({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) {
  if (!cart) {
    return null
  }

  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? "")

  // console.log("Payment Methods", cart?.region)

  if (!paymentMethods) {
    return null
  }

  return (
    <div className="w-full grid grid-cols-1 gap-y-3 lg:gap-y-0">
      <CheckoutTotals cart={cart} />
      {/* <Wallets cart={cart} /> */}
      <Addresses cart={cart} customer={customer} />
      {paymentMethods?.some((pm) => pm.id === "pp_paypal_paypal") ? (
        <PayPalPayment cart={cart} availablePaymentMethods={paymentMethods} />
      ) : (
        <MyFatoorahPayment
          cart={cart}
          availablePaymentMethods={paymentMethods}
        />
      )}
    </div>
  )
}
