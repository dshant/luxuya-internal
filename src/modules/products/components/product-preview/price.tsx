import { clx } from "@medusajs/ui"
import { VariantPrice } from "types/global"

export default async function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) {
    return null
  }

  return (
    <div className="flex flex-col gap-y-1">
      <div className="flex items-center gap-2 font-semibold">
        {price.price_type === "sale" && (
          <p
            className="line-through text-lg text-gray-600 font-semibold"
            data-testid="original-price"
          >
            {price.original_price}
          </p>
        )}
        <p
          className={clx("text-lg  font-semibold", {
            "text-red-500 font-semibold": price.price_type === "sale",
          })}
          data-testid="price"
        >
          {price.calculated_price}
        </p>
      </div>

      {price.price_type === "sale" &&
          <p className="text-sm font-medium text-red-600">
            {price.calculated_price &&
              price.original_price &&
              `${Math.round(
                ((parseFloat(price.original_price.replace(/[^0-9.]/g, "")) -
                  parseFloat(price.calculated_price.replace(/[^0-9.]/g, ""))) /
                  parseFloat(price.original_price.replace(/[^0-9.]/g, ""))) *
                  100
              )}% off`}
          </p>
        }
    </div>
  )
}
