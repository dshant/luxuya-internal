import { Metadata } from "next"

import { listCartOptions, retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { getBaseURL } from "@lib/util/env"
import { StoreCartShippingOption } from "@medusajs/types"
import CartMismatchBanner from "@modules/layout/components/cart-mismatch-banner"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import FreeShippingPriceNudge from "@modules/shipping/components/free-shipping-price-nudge"
import { Toaster } from "@modules/common/components/ui/sonner"
import CatagoryNav from "@modules/common/components/catagory-nav"
import Divider from "@modules/common/components/divider"
import NextTopLoader from "nextjs-toploader"
import { AuthModalProvider } from "@modules/layout/components/new-side-menu/shared-auth-modal"
import PageTracker from "@modules/trackers/components/page-tracker"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  const customer = await retrieveCustomer()
  const cart = await retrieveCart()
  let shippingOptions: StoreCartShippingOption[] = []

  if (cart) {
    const { shipping_options } = await listCartOptions()

    shippingOptions = shipping_options
  }

  return (
    <>
      <NextTopLoader color="#000000" showSpinner={false} height={4} />

      <PageTracker customer={customer} />

      <AuthModalProvider>
        <div className="mx-auto w-full">
          <Toaster />

          <Nav />
          {customer && cart && (
            <CartMismatchBanner customer={customer} cart={cart} />
          )}
          <Divider />
          {cart && (
            <FreeShippingPriceNudge
              variant="popup"
              cart={cart}
              shippingOptions={shippingOptions}
            />
          )}
          <div className="mx-auto max-w-[1440px] px-2 lg:px-0">
            {props.children}
          </div>
          <Footer />
        </div>
      </AuthModalProvider>
    </>
  )
}
