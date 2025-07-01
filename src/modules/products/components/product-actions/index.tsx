"use client"

import { addToCart, retrieveCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@modules/common/components/ui/button"
import OptionSelect from "@modules/products/components/list-product-preview-actions/option-select"
import { isEqual } from "lodash"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState, Fragment } from "react"
import MobileActions from "./mobile-actions"
import { ChevronDown, ShoppingBag, Truck } from "lucide-react"
import { toast } from "sonner"
import TypographyMuted from "@modules/common/Typography/Muted"
import ProductPriceDetailPage from "../product-price-detail-page"
import { AddToWishList } from "@modules/common/wishlist/add_to_wishList"
import { Dialog, Transition } from "@headlessui/react"
import useToggleState from "@lib/hooks/use-toggle-state"
import X from "@modules/common/icons/x"
import { Button as ButtonsUI } from "@medusajs/ui"
import { SizeChartModal } from "../sizeChartModal"
import { TranslatedText } from "@modules/common/components/translation/translated-text"
import { analytics, getDeviceType, getOSInfo } from "@lib/context/segment"
import { meilisearchProductType } from "types/meilisearch"

type ProductActionsProps = {
  product: any
  region: HttpTypes.StoreRegion
  disabled?: boolean
  onVariantSelect?: (variant: HttpTypes.StoreProductVariant | null) => void
  cheapestVariantId?: string
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductActions({
  product,
  disabled,
  onVariantSelect,
  region,
  cheapestVariantId,
}: ProductActionsProps) {
  const countryCode = useParams().countryCode as string
  const { state, open, close } = useToggleState()
  const router = useRouter()
  const [cart, setCart] = useState<any[]>([])
  const query =
    typeof window !== "undefined" && new URLSearchParams(window.location.search)
  const deletedId = (query && query.get("deleted")) || null

  useEffect(() => {
    const fetchCart = async () => {
      const retrievedCart = await retrieveCart()
      setCart(retrievedCart?.items || [])
    }
    fetchCart()
    if (deletedId) {
      const url = new URL(window.location.href)
      url.searchParams.delete("deleted")
      window.history.replaceState({}, "", url.toString())
    }
  }, [deletedId])

  // Check if size, color or defaultTitle is present or not

  const hasColor = product?.options?.some(
    (option: HttpTypes.StoreProductOption) =>
      option.title.toLowerCase().includes("color")
  )

  const hasSize = product?.options?.some(
    (option: HttpTypes.StoreProductOption) =>
      option.title.toLowerCase().includes("size")
  )

  const hasDefaultTitle = product?.options?.some(
    (option: HttpTypes.StoreProductOption) =>
      option.title.toLowerCase().includes("title")
  )

  // Helper to get real-time inventory for a variant
  const getRealInventory = (variant: any) => {
    const cartQty = cart?.find((item: any) => item?.variant_id === variant?.id)?.quantity || 0
    return (variant?.inventory_quantity || 0) - cartQty
  }

  // Pick the cheapest or first variant with real-time inventory greater than 0
  const cheapestVariant = product?.variants?.find(
    (variant: any) =>
      variant.id === cheapestVariantId && getRealInventory(variant) > 0
  )
  const fallbackVariant = product?.variants?.find(
    (variant: any) => getRealInventory(variant) > 0
  )
  const defaultVariant = cheapestVariant || fallbackVariant;

  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [hasSelectedOption, setHasSelectedOption] = useState(false) // New state to track user selection

  const selectedVariant = useMemo(() => {
    if (
      !hasSelectedOption ||
      !product.variants ||
      product.variants.length === 0
    ) {
      return null
    }
    return product?.variants?.find(
      (v: { options: HttpTypes.StoreProductOptionValue[] | null }) => {
        if (!v?.options) return false
        const variantOptions = optionsAsKeymap(v?.options)
        const result = isEqual(variantOptions, options)
        return hasDefaultTitle ? true : result
      }
    )
  }, [product?.variants, options, defaultVariant])

  // Dynamically compute outOfStockSizes for all variants based on real-time inventory
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

  // Update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
    setHasSelectedOption(true) // Mark that the user has selected an option
  }

  // Check if the selected options produce a valid variant
  const isValidVariant = useMemo(() => {
    return product?.variants?.some(
      (v: { options: HttpTypes.StoreProductOptionValue[] | null }) => {
        if (!v?.options) return false
        const variantOptions = optionsAsKeymap(v?.options)
        return isEqual(variantOptions, options)
      }
    )
  }, [product?.variants, options])

  // Calculate current cart item quantity for inventory display
  const currentCartItemQuantity = useMemo(() => {
    return product?.variants
      ?.map((variant: any) => {
        const findItem = cart?.find(
          (item: any) =>
            item?.title === variant?.title &&
            variant?.id === item?.variant_id &&
            item?.title === selectedVariant?.title
        )
        return findItem ? findItem?.quantity : 0
      })
      .filter((item: any) => item > 0)
      ?.at(0) || 0
  }, [product?.variants, cart, selectedVariant])

  // Calculate inventory quantity for stock status display
  const inventoryQty = useMemo(() => {
    const matchedVariantWithStock = product?.variants?.find(
      (variant: any) =>
        variant?.id === selectedVariant?.id && variant?.inventory_quantity > 0
    )

    const fallbackVariant = product?.variants?.find(
      (variant: any) => variant?.id === selectedVariant?.id
    )

    return (
      (matchedVariantWithStock?.inventory_quantity ??
        fallbackVariant?.inventory_quantity ??
        0) - currentCartItemQuantity
    )
  }, [product?.variants, selectedVariant, currentCartItemQuantity])

  // Get stock status message
  const getStockStatus = (qty: number) => {
    if (qty > 2) return null
    if (qty === 2) return "Only 2 Left in stock!"
    if (qty === 1) return "Only 1 left  in stock!"
    return null
  }

  const stockStatus = getStockStatus(inventoryQty)

  const actionsRef = useRef<HTMLDivElement>(null)

  const inView = useIntersection(actionsRef, "0px")

  // Add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null

    setIsAdding(true)
    try {
      const response = await addToCart({
        variantId: selectedVariant?.id,
        quantity: 1,
        countryCode,
        inventory_quantity: selectedVariant?.inventory_quantity,
      })

      toast.success("Product successfully added to your cart!", {
        action: {
          label: "View Cart",
          onClick: () => router.push("/cart"),
        },
      })
      setIsAdding(false)

      setCart(response.cart.items || [])

      await analytics.track(
        "Product Added",
        {
          product_name: product?.title,
          value: selectedVariant?.calculated_price?.calculated_amount,
          product_id: selectedVariant.id,
          name: product?.title,
          category: product?.brand,
          item_group_id: product?.id,
          variant: selectedVariant?.title,
          content_type: "product",
          currency: region.currency_code.toUpperCase(),
          price: selectedVariant?.prices?.filter(
            (price: HttpTypes.StorePrice) =>
              price.currency_code == region.currency_code
          )[0].amount,
        },
        {
          context: {
            device: {
              type: getDeviceType(),
            },
            os: {
              name: getOSInfo().name,
              version: getOSInfo().version,
            },
            app: {
              namespace: "com.luxuryforyou",
              name: "Luxury For You",
              version: "1.0.0",
              build: "1001",
            },
          },
        }
      )
    } catch (error) {
      console.log(error)
      toast.error(
        error ? `${error}` : "Failed to add product to cart. Please try again."
      )
      setIsAdding(false)
    }
  }

  useEffect(() => {
    if (onVariantSelect) {
      onVariantSelect(selectedVariant || null)
    }
  }, [selectedVariant])

  useEffect(() => {
    if (
      !selectedVariant &&
      product?.variants &&
      product?.variants.length > 0 &&
      product?.options
    ) {
      defaultVariant?.options?.map((opt: any) =>
        setOptionValue(opt?.option_id, opt?.value)
      )
      setHasSelectedOption(true)
    }
  }, [])

  // Check if the selected variant is in stock
  const inStock = useMemo(() => {
    if (
      selectedVariant?.manage_inventory &&
      inventoryQty > 0
    ) {
      return true
    }
    return false
  }, [selectedVariant, inventoryQty])


  // Calculate cart item quantity for the selected variant
  const cartItemQuantity = useMemo(() => {
    return product?.variants
      ?.map((variant: any) => {
        const findItem = cart?.find(
          (item: any) =>
            item?.title === variant?.title &&
            variant?.id === item?.variant_id &&
            item.title === selectedVariant?.title
        )
        if (findItem?.quantity !== selectedVariant?.inventory_quantity) {
          return 0
        } else {
          return 1
        }
      })
      .filter((item: any) => item > 0)
      ?.at(0) || 0
  }, [product?.variants, cart, selectedVariant])

  return (
    <>
      <div className="flex flex-col gap-y-2" ref={actionsRef}>
        <div className="flex max-sm:gap-2 flex-col">
          <div className="absolute lg:hidden size-[44px] border border-gray-200/60 flex justify-center items-center right-0 p-0 shadow-2xl bg-white rounded-full -top-14">
            <AddToWishList
              product={product}
              variant={selectedVariant}
              inStock={inStock}
              isValid={isValidVariant}
            />
          </div>

          <ProductPriceDetailPage
            product={product}
            variant={selectedVariant}
            region={region}
          />
        </div>
        <TypographyMuted>
          <TranslatedText text="incl. duties and taxes, excl. shipping costs" />
        </TypographyMuted>
        <div className="hidden lg:flex">
          {(product?.variants?.length ?? 0) > 0 && (
            <div
              className={`flex flex-col gap-y-4 ${
                product?.options?.some(
                  (opt: HttpTypes.StoreProductOption) => opt.title === "Title"
                )
                  ? "hidden"
                  : ""
              }`}
            >
              {(product?.options || []).map(
                (option: HttpTypes.StoreProductOption) => {
                  return (
                    <div key={option.id}>
                      <OptionSelect
                        option={option}
                        fallbackOption={defaultVariant}
                        current={options?.[option.id]}
                        updateOption={setOptionValue}
                        title={option.title ?? ""}
                        data-testid="product-options"
                        disabled={!!disabled || isAdding}
                        outOfStockSizes={computedOutOfStockSizes}
                        product={product}
                        stockStatus={stockStatus}
                      />
                    </div>
                  )
                }
              )}
            </div>
          )}
        </div>
        {(hasColor || hasSize) && (
          <div
            onClick={open}
            className="flex my-3 lg:hidden w-full justify-center items-center py-3 border-y border-gray-400"
          >
            {hasColor && (
              <div className="w-[100%] flex justify-center items-center flex-col">
                <p className="font-bold uppercase ">
                  {" "}
                  <TranslatedText text="color" />
                </p>
                <p className="flex relative left-[6px] text-[14px] justify-center items-center cursor-pointer gap-1">
                  {options[
                    product?.options?.find((opt: any) =>
                      opt.title.toLowerCase().includes("color")
                    )?.id
                  ] || <TranslatedText text="Select" />}
                  <ChevronDown size={18} />
                </p>
              </div>
            )}
            {hasSize && (
              <div className="w-[100%] flex justify-center items-center flex-col border-l border-gray-400 ">
                <p className="font-bold uppercase ">
                  <TranslatedText text="size" />
                </p>
                <p className="flex relative left-2 text-[14px] justify-center items-center cursor-pointer gap-1">
                  {options?.[
                    product?.options?.find((opt: any) =>
                      opt.title.toLowerCase().includes("size")
                    )?.id
                  ] || <TranslatedText text="Select" />}
                  <ChevronDown size={18} />
                </p>
              </div>
            )}
          </div>
        )}

        <div className="my-[12px] flex justify-between items-center border-y border-gray-300 py-[14px]">
          <div>
            <div className="flex items-center gap-1">
              <Truck size={24} strokeWidth={"1px"} />
              <span className="text-xs text-[#2d2d2d] font-bold">
                {" "}
                <TranslatedText text="Shipping" />
              </span>
            </div>
            <p className="text-xs font-normal">
              <TranslatedText text="Reaching your location in 4-7 days." />
            </p>
          </div>
          <div>
            {product?.metadata?.SizeChart && (
              <SizeChartModal product={product} isModal={false} />
            )}
          </div>
        </div>
        <div className="sticky lg:hidden bottom-0 py-4 bg-white border-0 border-t border-gray-300  shadow-none">
          <div className="flex gap-x-4">
            <Button
              onClick={hasColor || hasSize ? open : handleAddToCart}
              disabled={
                !inStock ||
                !selectedVariant ||
                !!disabled ||
                isAdding ||
                // !isValidVariant ||
                cartItemQuantity
              }
              variant="primary"
              className="flex w-full font-bold text-lg items-center rounded-sm gap-x-2 bg-[#c52128] text-white"
              // isLoading={isAdding}
              data-testid="add-product-button"
            >
              <ShoppingBag />
              {
                // !selectedVariant &&
                // Object.keys(options).length !== product?.options?.length ? (
                // "Select variant"
                // ):
                !inStock ? (
                  <TranslatedText text="Out of stock" />
                ) : (
                  <TranslatedText text="Add to Bag" />
                )
              }
            </Button>
          </div>
        </div>

        <div className="hidden lg:flex gap-x-4 pr-5">
          <Button
            onClick={handleAddToCart}
            disabled={
              !inStock ||
              !selectedVariant ||
              !!disabled ||
              isAdding ||
              // !isValidVariant ||
              cartItemQuantity
            }
            variant="primary"
            className="flex w-full font-bold rounded-sm items-center gap-x-2 bg-[#c52128] text-white"
            // isLoading={isAdding}
            data-testid="add-product-button"
          >
            <ShoppingBag />
            {
              // !selectedVariant &&
              // Object.keys(options).length !== product?.options?.length ? (
              // "Select variant"
              // ):
              !inStock ? (
                <TranslatedText text="Out of stock" />
              ) : (
                <TranslatedText text="Add to Bag" />
              )
            }
          </Button>
          <div className="border border-gray-200 flex justify-center items-center px-3">
            <AddToWishList
              product={product}
              variant={selectedVariant}
              inStock={inStock}
              isValid={isValidVariant}
            />
          </div>
        </div>

        <div className="py-2 w-full flex">
          <div className="flex flex-col justify-between items-center gap-2 w-[25%]">
            <img src="/2ZgBmF.png" alt="" width={60} height={60} />
            <p className="text-center text-sm font-bold">
              <TranslatedText text="Authenticity Guaranteed" />
            </p>
          </div>
          <div className="flex flex-col justify-between items-center gap-2 w-[25%]">
            <img src="/Secure.png" alt="" width={60} height={60} />
            <p className="text-center text-sm font-bold">
              <TranslatedText text="Secure Payment" />
            </p>
          </div>
          <div className="flex flex-col justify-between items-center gap-2 w-[25%]">
            <img src="/Return.png" alt="" width={60} height={60} />
            <p className="text-center text-sm font-bold">
              <TranslatedText text="Easy Returns" />
            </p>
          </div>
          <div className="flex flex-col justify-between items-center gap-2 w-[25%]">
            <img src="/World wide.png" alt="" width={60} height={60} />
            <p className="text-center text-sm font-bold">
              <TranslatedText text="Worldwide Shipping" />
            </p>
          </div>
        </div>

        <MobileActions
          product={product}
          //@ts-ignore
          variant={selectedVariant}
          disabled={disabled}
          isValidVariant={isValidVariant}
          cartItemQuantity={cartItemQuantity}
          cart={cart}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={(hasColor || hasSize) && !inView}
          optionsDisabled={!!disabled || isAdding}
        />
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
                  <div className="bg-white px-3 py-5">
                    <div className="flex justify-end">
                      {Object.keys(options)?.length ===
                        product?.options?.length &&
                        (!selectedVariant ||
                          (selectedVariant && !inStock && (
                            <div className="w-32 px-4 py-3 rounded-3xl bg-red-400 text-white text-center font-extrabold">
                              <TranslatedText text="Out of Stock" />
                            </div>
                          )))}
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-[22px]">
                        <TranslatedText text="Select Size/Colour" />
                      </p>
                      <button
                        onClick={close}
                        className="bg-white w-12 h-12 rounded-full text-ui-fg-base flex justify-center items-center"
                        data-testid="close-modal-button"
                      >
                        <X size={30} />
                      </button>
                    </div>
                    <div className="flex justify-end"></div>
                    {(product?.variants?.length ?? 0) > 0 && (
                      <div
                        className={`flex flex-col gap-y-6 ${
                          product?.options?.some(
                            (opt: HttpTypes.StoreProductOption) =>
                              opt.title === "Title"
                          )
                            ? "hidden"
                            : ""
                        }`}
                      >
                        {(product?.options || []).map(
                          (option: HttpTypes.StoreProductOption) => {
                            return (
                              <div key={option.id}>
                                <OptionSelect
                                  option={option}
                                  fallbackOption={defaultVariant}
                                  current={options?.[option.id]}
                                  updateOption={setOptionValue}
                                  title={option.title ?? ""}
                                  disabled={!!disabled || isAdding}
                                  outOfStockSizes={computedOutOfStockSizes}
                                  product={product}
                                  stockStatus={stockStatus}
                                />
                              </div>
                            )
                          }
                        )}
                      </div>
                    )}
                    <div className="flex justify-end mt-4">
                      <ButtonsUI
                        onClick={() => {
                          handleAddToCart()
                          close()
                        }}
                        disabled={
                          !inStock ||
                          !selectedVariant ||
                          !!disabled ||
                          isAdding ||
                          // !isValidVariant ||
                          cartItemQuantity
                        }
                        className="w-full h-[44px] mt-3 bg-[#c52128] text-base font-bold"
                        isLoading={isAdding}
                        data-testid="mobile-cart-button"
                        variant="danger"
                      >
                        <ShoppingBag size={16} />
                        {
                          // !selectedVariant &&
                          // Object.keys(options).length !== product?.options?.length ? (
                          // "Select variant"
                          // ):
                          !inStock ? (
                            <TranslatedText text="Out of stock" />
                          ) : (
                            <TranslatedText text="Add to Bag" />
                          )
                        }
                      </ButtonsUI>
                    </div>

                    <div className="mt-5">
                      <div className="flex items-center gap-1">
                        <Truck size={18} />
                        <span className="text-xs text-[#2d2d2d] font-bold">
                          <TranslatedText text="Shipping" />
                        </span>
                      </div>
                      <p className="text-xs font-bold">
                        <TranslatedText text="Reaching your location in 4-7 days." />
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
