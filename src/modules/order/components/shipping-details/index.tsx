import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"

import Divider from "@modules/common/components/divider"
import { TranslatedTextServer } from "@modules/common/components/translation/translatest-text-server"

type ShippingDetailsProps = {
  order: HttpTypes.StoreOrder
}

const ShippingDetails = ({ order }: ShippingDetailsProps) => {
  return (
    <div>
      <Heading level="h2" className="flex flex-row text-3xl-regular my-6">
        <TranslatedTextServer text="Delivery" />
      </Heading>
      <div className="flex items-start gap-x-8">
        <div
          className="flex flex-col w-1/3"
          data-testid="shipping-address-summary"
        >
          <Text className="txt-medium-plus text-ui-fg-base mb-1">
          <TranslatedTextServer text="Shipping Address" />       
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">
          {order.shipping_address?.first_name &&  <TranslatedTextServer text={order.shipping_address?.first_name } /> }
          {order.shipping_address?.last_name && <TranslatedTextServer text={order.shipping_address?.last_name} />}
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">
            {order.shipping_address?.address_1 && <TranslatedTextServer text={order.shipping_address?.address_1} />}{" "}
            {order.shipping_address?.address_2 && <TranslatedTextServer text={order.shipping_address?.address_2} />}
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">
          {order.shipping_address?.postal_code},{" "}
            {order.shipping_address?.city && <TranslatedTextServer text={order.shipping_address?.city} />}
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">
            {order.shipping_address?.country_code?.toUpperCase()}
          </Text>
        </div>

        <div
          className="flex flex-col w-1/3 "
          data-testid="shipping-contact-summary"
        >
          <Text className="txt-medium-plus text-ui-fg-base mb-1"><TranslatedTextServer text="Contact" /></Text>
          <Text className="txt-medium text-ui-fg-subtle">
            {order.shipping_address?.phone}
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">{order.email}</Text>
        </div>

        <div
          className="flex flex-col w-1/3"
          data-testid="shipping-method-summary"
        >
          <Text className="txt-medium-plus text-ui-fg-base mb-1"><TranslatedTextServer text="Method" /></Text>
          <Text className="txt-medium text-ui-fg-subtle">
            {(order as any).shipping_methods[0]?.name && <TranslatedTextServer text={(order as any).shipping_methods[0]?.name} />} (
            {convertToLocale({
              amount: order.shipping_methods?.[0].total ?? 0,
              currency_code: order.currency_code,
            })
              .replace(/,/g, "")
              .replace(/\./g, ",")}
            )
          </Text>
        </div>
      </div>
      <Divider className="mt-8" />
    </div>
  )
}

export default ShippingDetails
