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
    <div className="py-6 sm:py-12">
      <div
        className="content-container max-sm:px-0"
        data-testid="cart-container"
      >
        <div className="flex justify-between items-center mb-4 sm:mb-12">
          <Heading className="text-[26px] !text-[#222] font-[400] leading-[2.75rem]">
            <TranslatedTextServer text=" Shopping Bag" />
          </Heading>

          <Link href="/" className="underline !text-[#222]">
            Continue Shopping
          </Link>
        </div>

        {!customer && (
          <div className="py-4">
            <SignInPrompt />
            <Divider />
          </div>
        )}

        {cart?.items?.length ? (
          <>
            {/* <div className='flex items-start max-small:flex-col max-small:items-stretch justify-between gap-x-20'>
              <div className='flex flex-col flex-grow bg-white py-6 sm:gap-y-6'>
                <ItemsTemplate cart={cart} />
              </div>
              <div className='small:w-[400px]'>
                <div className='flex flex-col gap-y-8'>
                  {cart && cart.region && (
                    <>
                      <div className='bg-white sm:py-6'>
                        <Summary cart={cart as any} />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div> */}
            <div className="flex items-start gap-4 sm:gap-8 max-small:flex-col max-small:items-stretch">
              <ItemsTemplate cart={cart} />
              <div className="w-[400px] max-medium:w-[360px] max-small:w-full">
                <Summary cart={cart as any} />
              </div>
            </div>
          </>
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
