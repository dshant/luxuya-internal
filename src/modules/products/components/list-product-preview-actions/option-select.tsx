import { cn } from "@lib/util/common";
import { HttpTypes } from "@medusajs/types";
import { Button } from "@modules/common/components/ui/button";
import { SizeChartModal } from "../sizeChartModal";
import React, { useEffect, useMemo, useState } from "react";

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption;
  fallbackOption: any;
  current: string | undefined;
  updateOption: (title: string, value: string) => void;
  title: string;
  disabled: boolean;
  outOfStockSizes: Record<string, string>[];
  "data-testid"?: string;
  stockStatus?: string | null;
  product?: any;
  cart?: any;
  selected?: any;
  onHover?: boolean;
};

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  fallbackOption,
  current,
  updateOption,
  title,
  onHover,
  "data-testid": dataTestId,
  outOfStockSizes,
  disabled,
  product,
  stockStatus,
}) => {
  const filteredOptions = (option?.values ?? [])?.map((v) => v?.value);
  const defaultOption = fallbackOption?.options || [];

  const allOptions = useMemo(
    () => product?.options?.filter((o: any) => o?.title !== "Title"),
    [product]
  );

  //The below useEffect is for changing the selected variant.
  useEffect(() => {
    const isCurrentOutOfStock = outOfStockSizes?.some(
      (size) => size[option?.id] === current
    );
    if ((!current || isCurrentOutOfStock) && defaultOption?.length > 0) {
      defaultOption?.map((opt: any) =>
        updateOption(opt?.option_id, opt?.value)
      );
    }
    if (defaultOption?.length === 0) {
      updateOption(option?.id, "");
    }
  }, [current, option?.id, outOfStockSizes]);

  if (onHover) {
    const options = filteredOptions?.filter((e) => {
      const isOutOfStock = outOfStockSizes?.some(
        (size) => size[option.id] === e
      );
      return !isOutOfStock;
    });

    return options?.length === 0 ? (
      <></>
    ) : (
      <div className='flex items-center gap-2 flex-wrap'>
        <p className='font-medium'>
          Available {title === "Color" || title === "Default" ? title : "Sizes"}{" "}
          :
        </p>

        {options?.map((v) => (
          <p key={v} className='text-sm'>
            {v}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-y-3'>
      <div className='flex justify-between items-center'>
        <span className='text-sm'>{title}</span>
        {product?.metadata?.SizeChart && title !== "Color" && (
          <SizeChartModal product={product} isModal={true} />
        )}
      </div>

      <div
        className='flex flex-wrap justify-start gap-2'
        data-testid={dataTestId}
      >
        {filteredOptions?.map((v) => {
          const isOutOfStock = outOfStockSizes?.some(
            (size) => size[option.id] === v
          );
          return (
            <Button
              variant={v === current ? "default" : "outline"}
              onClick={() =>
                ((option?.title?.includes("Size") && !isOutOfStock) ||
                  option?.title) &&
                updateOption(option.id, v)
              }
              key={v}
              className={cn(
                "transition-all duration-300 ease-in-out hover:scale-[1.05]",
                {
                  "ring-1 ring-black": v === current && !isOutOfStock,
                  "line-through opacity-50":
                    option?.title !== "Color" && isOutOfStock,
                }
              )}
              disabled={disabled || (isOutOfStock && option?.title !== "Color")}
              data-testid='option-button'
            >
              {v}
            </Button>
          );
        })}
      </div>
      {allOptions && allOptions.length > 1 && option?.title !== "Color" && (
        <p className='text-red-600 font-semibold'>{stockStatus}</p>
      )}
      {allOptions && allOptions.length === 1 && option?.title === "Color" && (
        <p className='text-red-600 font-semibold'>{stockStatus}</p>
      )}
    </div>
  );
};

export default OptionSelect;
