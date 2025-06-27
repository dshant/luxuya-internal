import { Dialog, Transition } from "@headlessui/react"
import { Button, clx } from "@medusajs/ui"
import React, { Fragment, useMemo } from "react"

import useToggleState from "@lib/hooks/use-toggle-state"
import ChevronDown from "@modules/common/icons/chevron-down"
import X from "@modules/common/icons/x"

import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import { meiliSearchProduct } from "types/global"
import { ShoppingBag, Truck } from "lucide-react"
import { SizeChartModal } from "../sizeChartModal"
import { TranslatedText } from "@modules/common/components/translation/translated-text"
import OptionSelect from "../list-product-preview-actions/option-select"

type MobileActionsProps = {
  // product: HttpTypes.StoreProduct
  product: any
  variant?: HttpTypes.StoreProductVariant
  options: Record<string, string | undefined>
  updateOptions: (title: string, value: string) => void
  inStock?: boolean
  handleAddToCart: () => void
  isAdding?: boolean
  show: boolean
  optionsDisabled: boolean
  disabled?: boolean
  isValidVariant?: boolean
  cartItemQuantity?: number
  cart?: any
}

const MobileActions: React.FC<MobileActionsProps> = ({
  product,
  variant,
  options,
  updateOptions,
  inStock,
  handleAddToCart,
  isAdding,
  show,
  optionsDisabled,
  disabled,
  isValidVariant,
  cartItemQuantity,
  cart,
}) => {
  const { state, open, close } = useToggleState()

  const price = getProductPrice({
    product: product,
    variantId: variant?.id,
  })

  const optionsAsKeymap = (
    variantOptions: HttpTypes.StoreProductVariant["options"]
  ) => {
    return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
      acc[varopt.option_id] = varopt.value
      return acc
    }, {})
  }

  const getRealInventory = (variant: any) => {
    const cartQty = cart?.find((item: any) => item?.variant_id === variant?.id)?.quantity || 0
    return (variant?.inventory_quantity || 0) - cartQty
  }

  const cheapestVariantId = product?.cheapestVariant.id;

  const cheapestVariant = product?.variants?.find(
    (variant: any) =>
      variant.id === cheapestVariantId && getRealInventory(variant) > 0
  )
  const fallbackVariant = product?.variants?.find(
    (variant: any) => getRealInventory(variant) > 0
  )
  const defaultVariant = cheapestVariant || fallbackVariant;


  const computedOutOfStockSizes = useMemo(() => {
    if (!product?.variants) return []
    return product.variants.reduce((acc: Record<string, string>[], variant: any) => {
      // Calculate cart quantity for this variant
      const cartQty = cart?.find((item: any) => item?.variant_id === variant?.id)?.quantity || 0
      const realInventory = (variant?.inventory_quantity || 0) - cartQty
      if (variant.manage_inventory && realInventory <= 0) {
        const optionsMap = optionsAsKeymap(variant.options)
        if (optionsMap && Object.keys(optionsMap).length > 0) {
          // Avoid duplicates
          if (!acc.some((opt: Record<string, string>) => JSON.stringify(opt) === JSON.stringify(optionsMap as Record<string, string>))) {
            acc.push(optionsMap as Record<string, string>)
          }
        }
      }
      return acc
    }, [] as Record<string, string>[])
  }, [product?.variants, cart])

  const selectedPrice = useMemo(() => {
    if (!price) {
      return null
    }
    const { variantPrice, cheapestPrice } = price

    return variantPrice || cheapestPrice || null
  }, [price])

  // Get out-of-stock sizes
  const outOfStockSizes = useMemo(() => {
    return (
      product.variants
        ?.filter(
          (variant: { manage_inventory: any; inventory_quantity: any }) =>
            variant.manage_inventory && (variant.inventory_quantity || 0) <= 0
        )
        .map((variant: { options: any[] }) =>
          variant?.options?.reduce(
            (acc: any, opt: { option_id: any; value: any }) => ({
              ...acc,
              [opt.option_id]: opt.value,
            }),
            {}
          )
        ) || []
    )
  }, [product.variants])
  return (
    <>
      <div
        className={clx("lg:hidden inset-x-0 bottom-0 fixed z-50", {
          "pointer-events-none": !show,
        })}
      >
        <Transition
          as={Fragment}
          show={show}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="bg-white z-50 flex flex-col gap-y-3 justify-center items-center text-large-regular p-4 h-full w-full border-t border-gray-200"
            data-testid="mobile-actions"
          >
            <div className="flex items-center gap-x-2">
              <span data-testid="mobile-title">{product.title}</span>
              <span>—</span>
              {selectedPrice ? (
                <div className="flex items-end gap-x-2 text-ui-fg-base">
                  {selectedPrice.price_type === "sale" && (
                    <p>
                      <span className="line-through text-small-regular">
                        {selectedPrice.original_price}
                      </span>
                    </p>
                  )}
                  <span
                    className={clx({
                      "text-ui-fg-interactive":
                        selectedPrice.price_type === "sale",
                    })}
                  >
                    {selectedPrice.calculated_price}
                  </span>
                </div>
              ) : (
                <div></div>
              )}
            </div>
            <div className="grid grid-cols-2 w-full gap-x-4">
              <Button
                onClick={open}
                variant="secondary"
                className="w-full"
                data-testid="mobile-actions-button"
              >
                <div className="flex items-center justify-between w-full">
                  <span>
                    {variant
                      ? Object.values(options).join(" / ")
                      : "Select Options"}
                  </span>
                  <ChevronDown />
                </div>
              </Button>
              <Button
                onClick={handleAddToCart}
                disabled={
                  !inStock ||
                  !variant ||
                  !!disabled ||
                  isAdding ||
                  !isValidVariant ||
                  !!cartItemQuantity
                }
                className="w-full"
                isLoading={isAdding}
                data-testid="mobile-cart-button"
              >
                {!variant ? (
                  <TranslatedText text="Select variant" />
                ) : !inStock || !isValidVariant ? (
                  <TranslatedText text="Out of stock" />
                ) : (
                  <TranslatedText text="Add to Bag" />
                )}
              </Button>
            </div>
          </div>
        </Transition>
      </div>
      <Transition appear show={state} as={Fragment}>
        <Dialog as="div" className="relative z-[75]" onClose={close}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-700 bg-opacity-75 backdrop-blur-sm" />
          </Transition.Child>
          <Dialog.Title></Dialog.Title>

          <div className="fixed bottom-0 inset-x-0">
            <div className="flex min-h-full h-full items-center justify-center text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Panel
                  className="w-full h-full transform overflow-hidden text-left flex flex-col gap-y-3"
                  data-testid="mobile-actions-modal"
                >
                  <div className="bg-white px-6 py-12">
                    <div className="flex justify-between items-center">
                      <p className="text-[22px]">Select Size/Colour</p>
                      <button
                        onClick={close}
                        className="bg-white w-12 h-12 rounded-full text-ui-fg-base flex justify-center items-center"
                        data-testid="close-modal-button"
                      >
                        <X size={30} />
                      </button>
                    </div>

                    {(product.variants?.length ?? 0) > 0 && (
                      <div
                        className={`flex flex-col gap-y-6 ${
                          product.options?.some(
                            (opt: HttpTypes.StoreProductOption) =>
                              opt.title === "Title"
                          )
                            ? "hidden"
                            : ""
                        }`}
                      >
                        {(product.options || []).map(
                          (option: HttpTypes.StoreProductOption) => {
                            return (
                              <div key={option.id}>
                                <OptionSelect
                        option={option}
                        fallbackOption={defaultVariant}
                        current={options?.[option.id]}
                        updateOption={updateOptions}
                        title={option.title ?? ""}
                        data-testid="product-options"
                        disabled={optionsDisabled}
                        outOfStockSizes={computedOutOfStockSizes}
                        product={product}
                      />
                              </div>
                            )
                          }
                        )}
                      </div>
                    )}
                    <div className="flex justify-end mt-4">
                      <Button
                        onClick={() => {
                          handleAddToCart()
                          close()
                        }}
                        disabled={
                          !inStock ||
                          !variant ||
                          !!disabled ||
                          isAdding ||
                          !isValidVariant ||
                          !!cartItemQuantity
                        }
                        className="w-full h-[44px] mt-3 bg-[#c52128] text-sm font-bold"
                        isLoading={isAdding}
                        data-testid="mobile-cart-button"
                        variant="danger"
                      >
                        <ShoppingBag size={16} />
                        {!variant &&
                        Object.keys(options).length !==
                          product?.options?.length ? (
                          <TranslatedText text="Select variant" />
                        ) : !inStock || !isValidVariant ? (
                          <TranslatedText text="Out of stock" />
                        ) : (
                          <TranslatedText text="Add to Bag" />
                        )}
                      </Button>
                    </div>

                    <div className="mt-5">
                      <div className="flex items-center gap-1">
                        <Truck size={18} />
                        <span className="text-xs text-[#2d2d2d] font-bold">
                          Shipping
                        </span>
                      </div>
                      <p className="text-xs font-bold">
                        Reaching your location in 4-7 days.
                      </p>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default MobileActions
