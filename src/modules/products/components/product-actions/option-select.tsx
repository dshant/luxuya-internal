import { cn } from "@lib/util/common"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import { Button } from "@modules/common/components/ui/button"
import React from "react"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  outOfStockSizes: Record<string, string>[]
  "data-testid"?: string
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  outOfStockSizes,
  disabled,
}) => {
  const filteredOptions = (option.values ?? []).map((v) => v.value)

  return (
    <div className="flex flex-col gap-y-3">
      <span className="text-sm">{title}</span>
      <div
        className="flex flex-wrap justify-start gap-2"
        data-testid={dataTestId}
      >
        {filteredOptions?.map((v) => {
          const isOutOfStock = outOfStockSizes?.some(
            (size) => size[option.id] === v
          )
          return (
            <>
              <Button
                variant={v === current ? "default" : "outline"}
                onClick={() =>
                  ((option?.title?.includes("Size") && !isOutOfStock) ||
                    option?.title === "Color") &&
                  updateOption(option.id, v)
                }
                key={v}
                className={cn(
                  "transition-all min-w-[42px] duration-300 ease-in-out hover:scale-[1.05]",
                  {
                    "ring-1 ring-black": v === current,
                    "line-through opacity-50":
                      option?.title !== "Color" && isOutOfStock,
                  }
                )}
                disabled={disabled && isOutOfStock && option?.title !== "Color"}
                data-testid="option-button"
              >
                {v}
              </Button>
            </>
          )
        })}
      </div>
    </div>
  )
}

export default OptionSelect
