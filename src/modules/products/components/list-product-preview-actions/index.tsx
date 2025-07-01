"use client"

import { addToCart, retrieveCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@modules/common/components/ui/button"
import OptionSelect from "@modules/products/components/list-product-preview-actions/option-select"
import { isEqual } from "lodash"
import { useParams } from "next/navigation"
import { Fragment, useEffect, useMemo, useRef, useState } from "react"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"
import { ShoppingBag } from "lucide-react"
import { toast } from "sonner"
import { meiliSearchProduct } from "types/global"
import { TranslatedText } from "@modules/common/components/translation/translated-text"
import { createOrUpdateHsCart } from "@lib/data/hubspot"
import { analytics, getDeviceType, getOSInfo } from "@lib/context/segment"

type ProductActionsProps = {
  // product: HttpTypes.StoreProduct
  product: meiliSearchProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
  onVariantSelect?: (variant: HttpTypes.StoreProductVariant | null) => void
  onHover?: boolean
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
  region,
  product,
  disabled,
  onVariantSelect,
  onHover,
}: ProductActionsProps) {
  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [hasSelectedOption, setHasSelectedOption] = useState(false) // New state to track user selection
  const countryCode = useParams().countryCode as string
  const hasDefaultTitle = product.options.some(
    (option: HttpTypes.StoreProductOption) =>
      option.title.toLowerCase().includes("title")
  )
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

  const getRealInventory = (variant: any) => {
    const cartQty =
      cart?.find((item: any) => item?.variant_id === variant?.id)?.quantity || 0
    return (variant?.inventory_quantity || 0) - cartQty
  }

  const cheapestVariantId = product?.cheapestVariant.id

  const cheapestVariant = product?.variants?.find(
    (variant: any) =>
      variant.id === cheapestVariantId && getRealInventory(variant) > 0
  )
  const fallbackVariant = product?.variants?.find(
    (variant: any) => getRealInventory(variant) > 0
  )
  const defaultVariant = cheapestVariant || fallbackVariant

  const computedOutOfStockSizes = useMemo(() => {
    if (!product?.variants) return []
    return product.variants.reduce(
      (acc: Record<string, string>[], variant: any) => {
        // Calculate cart quantity for this variant
        const cartQty =
          cart?.find((item: any) => item?.variant_id === variant?.id)
            ?.quantity || 0
        const realInventory = (variant?.inventory_quantity || 0) - cartQty
        if (variant.manage_inventory && realInventory <= 0) {
          const optionsMap = optionsAsKeymap(variant.options)
          if (optionsMap && Object.keys(optionsMap).length > 0) {
            // Avoid duplicates
            if (
              !acc.some(
                (opt: Record<string, string>) =>
                  JSON.stringify(opt) ===
                  JSON.stringify(optionsMap as Record<string, string>)
              )
            ) {
              acc.push(optionsMap as Record<string, string>)
            }
          }
        }
        return acc
      },
      [] as Record<string, string>[]
    )
  }, [product?.variants, cart])

  const availableVariants = product.variants?.filter((variant: any) => {
    return variant.inventory_quantity && variant.inventory_quantity > 0
  })

  const getButtonText = () => {
    if (!availableVariants || availableVariants.length === 0)
      return "Out of Stock"

    if (
      !selectedVariant &&
      Object.keys(options).length !== product.options?.length
    )
      return "Select Variant"

    if (!inStock) return "Out of Stock"

    return "Add to Cart"
  }

  const selectedVariant = useMemo(() => {
    if (
      !hasDefaultTitle &&
      (!hasSelectedOption || !product.variants || product.variants.length === 0)
    ) {
      return null
    }
    return product.variants.find((v: any) => {
      const variantOptions = optionsAsKeymap(v.options)
      return hasDefaultTitle ? true : isEqual(variantOptions, options)
    })
  }, [product.variants, options, hasSelectedOption])

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
    return product.variants?.some((v: any) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // Check if the selected variant is in stock
  const inStock = useMemo(() => {
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true
    }

    if (selectedVariant?.allow_backorder) {
      return true
    }

    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    ) {
      return true
    }

    return false
  }, [selectedVariant])

  const actionsRef = useRef<HTMLDivElement>(null)

  const inView = useIntersection(actionsRef, "0px")

  // Get out-of-stock sizes
  const outOfStockSizes = useMemo(() => {
    return (
      product.variants
        ?.filter(
          (variant: { manage_inventory: any; inventory_quantity: any }) =>
            variant.manage_inventory && (variant.inventory_quantity || 0) <= 0
        )
        .map(
          (variant: { options: HttpTypes.StoreProductOptionValue[] | null }) =>
            optionsAsKeymap(variant.options)
        ) || []
    )
  }, [product.variants])

  // Add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null

    setIsAdding(true)
    try {
      const cartResponse = await addToCart({
        variantId: selectedVariant.id,
        quantity: 1,
        countryCode,
        //inventory_quantity: selectedVariant.inventory_quantity,
        inventory_quantity: 1,
      })

      toast.success("Product successfully added to your cart!")
      setIsAdding(false)
      createOrUpdateHsCart(cartResponse.cart)
      await analytics.track(
        "Product Added",
        {
          product_name: product?.title,
          value: selectedVariant?.calculated_price?.calculated_amount,
          product_id: selectedVariant.id,
          name: product.title,
          category: product?.brand,
          item_group_id: product.id,
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
      toast.error("Failed to add product to cart. Please try again.")
      console.error("Add to cart error:", error)
      setIsAdding(false)
    }
  }

  useEffect(() => {
    if (onVariantSelect) {
      onVariantSelect(selectedVariant || null)
    }
  }, [selectedVariant])

  useEffect(() => {
    if (product.variants && product.variants.length > 0 && product.options) {
      const cheapestVariantId = product?.cheapestVariant?.id
      const cheapestVariant = product?.variants?.find(
        (variant: any) =>
          variant.id === cheapestVariantId && variant.inventory_quantity > 0
      )
      const fallbackVariant = product?.variants?.find(
        (variant: any) => variant.inventory_quantity > 0
      )
      // Pick the cheapest or first variant with inventory_quantity greater than 0;
      const defaultVariant = cheapestVariant || fallbackVariant
      defaultVariant?.options?.map((opt: any) =>
        setOptionValue(opt?.option_id, opt?.value)
      )
      setHasSelectedOption(true)
    }
  }, [product.variants, product.options])

  return (
    <>
      <div className="flex flex-col gap-y-2 w-full" ref={actionsRef}>
        <div>
          {(product.variants?.length ?? 0) > 0 && (
            <div className="flex flex-col gap-y-4">
              {(product.options || []).map((option: any) => {
                return (
                  <Fragment key={option.id}>
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
                      onHover={onHover}
                    />
                  </Fragment>
                )
              })}
            </div>
          )}
        </div>
        {!onHover && (
          <div className="flex gap-x-4">
            <Button
              onClick={handleAddToCart}
              disabled={
                !availableVariants ||
                availableVariants.length === 0 ||
                !inStock ||
                !selectedVariant ||
                !!disabled ||
                isAdding
                // || !isValidVariant
              }
              variant="primary"
              className="flex w-full items-center gap-x-2 bg-black text-white"
              data-testid="add-product-button"
            >
              <ShoppingBag />
              <TranslatedText text={getButtonText()} />
            </Button>
          </div>
        )}
        <MobileActions
          product={product}
          //@ts-ignore
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
        />
      </div>
    </>
  )
}
