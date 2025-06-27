import { Heading, Text } from "@medusajs/ui"

import InteractiveLink from "@modules/common/components/interactive-link"
import { TranslatedText } from "@modules/common/components/translation/translated-text"

const EmptyCartMessage = () => {
  return (
    <div
      className="py-48 px-2 flex flex-col justify-center items-start"
      data-testid="empty-cart-message"
    >
      <Heading
        level="h1"
        className="flex flex-row text-3xl-regular gap-x-2 items-baseline"
      >
        <TranslatedText text="Cart" />
      </Heading>
      <Text className="text-base-regular mt-4 mb-6 max-w-[32rem]">
        <TranslatedText
          text="You don't have anything in your cart. Let's change that, use
        the link below to start browsing our products."
        />
      </Text>
      <div>
        <InteractiveLink href="/">
          <TranslatedText text="Explore products" />
        </InteractiveLink>
      </div>
    </div>
  )
}

export default EmptyCartMessage
