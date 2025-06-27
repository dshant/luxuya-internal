import { listCartShippingMethods } from "@lib/data/fulfillment"
import { Heading } from "@medusajs/ui"
import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"

const CheckoutTotals = async ({ cart }: { cart: any }) => {
  const shippingMethods = await listCartShippingMethods(cart.id)

  return (
    <div className=" top-0 flex flex-col-reverse small:flex-col gap-y-8 ">
      <div className="lg:hidden">
        <div className="w-full bg-white flex flex-col">
          <CartTotals totals={cart} availableShippingMethods={shippingMethods} />
          <Divider className="mt-0" />
          <div>
            <DiscountCode cart={cart} />
          </div>
          <Divider />
        </div>
      </div>
    </div>
  )
}

export default CheckoutTotals
