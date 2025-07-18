import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { TranslatedTextServer } from "@modules/common/components/translation/translatest-text-server"

type OrderSummaryProps = {
  order: HttpTypes.StoreOrder
}

const OrderSummary = ({ order }: OrderSummaryProps) => {
  const getAmount = (amount?: number | null) => {
    if (!amount) {
      return
    }

    return convertToLocale({
      amount,
      currency_code: order.currency_code,
    })
  }

  return (
    <div>
      <h2 className="text-base-semi">
        <TranslatedTextServer text="Order Summary" />
      </h2>
      <div className="text-small-regular text-ui-fg-base my-2">
        <div className="flex items-center justify-between text-base-regular text-ui-fg-base mb-2">
          <span><TranslatedTextServer text="Subtotal" /></span>
          <span>{getAmount(order.subtotal)}</span>
        </div>
        <div className="flex flex-col gap-y-1">
          {order.discount_total > 0 && (
            <div className="flex items-center justify-between">
              <span><TranslatedTextServer text="Discount" /></span>
              <span>- {getAmount(order.discount_total)}</span>
            </div>
          )}
          {order.gift_card_total > 0 && (
            <div className="flex items-center justify-between">
              <span><TranslatedTextServer text="Discount" /></span>
              <span>- {getAmount(order.gift_card_total)}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span><TranslatedTextServer text="Shipping" /></span>
            <span>{getAmount(order.shipping_total)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span><TranslatedTextServer text="Taxes" /></span>
            <span>{getAmount(order.tax_total)}</span>
          </div>
        </div>
        <div className="h-px w-full border-b border-gray-200 border-dashed my-4" />
        <div className="flex items-center justify-between text-base-regular text-ui-fg-base mb-2">
          <span><TranslatedTextServer text="Total" /></span>
          <span>{getAmount(order.total)}</span>
        </div>
      </div>
    </div>
  )
}

export default OrderSummary
