import { Button, Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const EmptyCart = () => {
  return (
    <div className="min-h-[70vh] flex justify-center items-center">
      <div
        className=" px-2 flex flex-col justify-center items-center"
        data-testid="empty-cart-message"
      >
        <Heading
          level="h1"
          className="flex flex-row text-3xl-regular gap-x-2 items-baseline"
        >
          Cart
        </Heading>
        <div className="bg-gray-900 mt-10 text-small-regular flex items-center justify-center w-6 h-6 rounded-full text-white">
          <span>0</span>
        </div>
        <Text className="text-base-regular text-center mt-4 mb-6 max-w-[32rem]">
          You don&apos;t have anything in your cart. Let&apos;s change that, use
          the link below to start browsing our products.
        </Text>
        <div>
          <LocalizedClientLink href="/">
            <>
              <span className="sr-only">Go to all products page</span>
              <Button>Explore products</Button>
            </>
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}

export default EmptyCart
