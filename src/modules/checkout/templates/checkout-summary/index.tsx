import { listCartShippingMethods } from "@lib/data/fulfillment"
import { Heading } from "@medusajs/ui"

import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"

const CheckoutSummary = async ({ cart }: { cart: any }) => {
  const shippingMethods = await listCartShippingMethods(cart.id)

  return (
    <div className="sticky top-0 flex flex-col-reverse small:flex-col gap-y-8 pb-8 small:py-0 ">
      <div className="w-full bg-white flex flex-col">
        <Divider className=" small:hidden" />
        <Heading
          level="h2"
          className="flex flex-row text-2xl md:text-3xl-regular items-baseline my-4 lg:mb-4"
        >
          In your Cart
        </Heading>
        <Divider className="mb-4" />
        <CartTotals totals={cart} availableShippingMethods={shippingMethods} />
        <ItemsPreviewTemplate cart={cart} />
        <div className="hidden lg:block">
          <DiscountCode cart={cart} />
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary
