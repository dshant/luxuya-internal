"use client"

import { Heading, Text, useToggleState } from "@medusajs/ui"
import compareAddresses from "@lib/util/compare-addresses"
import BillingAddress from "@modules/checkout/components/billing_address"
import { useActionState } from "react"
import { setAddresses } from "@lib/data/cart"
import ShippingAddress from "@modules/checkout/components/shipping-address"
import { SubmitButton } from "../submit-button"
import { HttpTypes } from "@medusajs/types"
import { useEffect } from "react"
import { initiatePaymentSession } from "@lib/data/cart"
import Payment from "../payment";
import { listCartPaymentMethods } from "@lib/data/payment";

const CheckoutComponent = ({ cart, customer }: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {

  const { state: sameAsBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true
  )

  const [message, formAction] = useActionState(setAddresses, null)

  return (
    <>
      <div>
        <Heading
          level="h2"
          className="flex flex-row text-3xl-regular gap-x-2 items-baseline"
        >
          Shipping Address
        </Heading>
        <form action={formAction}>
          <div className="pb-8">
            <ShippingAddress
              customer={customer}
              checked={sameAsBilling}
              onChange={toggleSameAsBilling}
              cart={cart}
            />
            {!sameAsBilling && (
              <div>
                <Heading
                  level="h2"
                  className="text-3xl-regular gap-x-4 pb-6 pt-8"
                >
                  Billing address
                </Heading>

                <BillingAddress cart={cart} />
              </div>
            )}
            <SubmitButton className="mt-6" variant={"primary"} data-testid="submit-address-button">
              Continue to payment
            </SubmitButton>

          </div>
        </form>
      </div>

    </>
  )
}

export default CheckoutComponent