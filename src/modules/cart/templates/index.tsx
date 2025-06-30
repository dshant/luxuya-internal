import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import Divider from "@modules/common/components/divider"
import { HttpTypes } from "@medusajs/types"
import { Heading } from "@medusajs/ui"
import { TranslatedTextServer } from "@modules/common/components/translation/translatest-text-server"
import Link from "next/link"

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  return (
    <div className="py-12">
      <div className="content-container" data-testid="cart-container">
        <div className="flex justify-between items-center mb-20">
          <Heading className="text-[1.75rem] leading-[2.75rem]">
            <TranslatedTextServer text=" Shopping Bag" />
          </Heading>

          <Link href="/" className="underline">
            Continue Shopping
          </Link>
        </div>
        {cart?.items?.length ? (
          <div className="flex items-start max-small:flex-col-reverse max-small:items-stretch justify-between gap-x-20">
            <div className="flex flex-col flex-grow bg-white py-6 gap-y-6">
              {!customer && (
                <>
                  <SignInPrompt />
                  <Divider />
                </>
              )}
              <ItemsTemplate cart={cart} />
            </div>
            <div className="small:w-[460px] sticky top-14">
              <div className="flex flex-col gap-y-8 sticky top-12">
                {cart && cart.region && (
                  <>
                    <div className="bg-white py-6">
                      <Summary cart={cart as any} />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <EmptyCartMessage />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartTemplate
