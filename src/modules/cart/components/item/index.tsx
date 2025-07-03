"use client"

import { clx } from "@medusajs/ui"
import { deleteLineItem, retrieveCart, updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import ErrorMessage from "@modules/checkout/components/error-message"

import LineItemOptions from "@modules/common/components/line-item-options"
import Spinner from "@modules/common/icons/spinner"
import { useEffect, useState } from "react"
import { Minus, Plus, Heart, X, CircleAlert } from "lucide-react"
import { Button } from "@modules/common/components/ui/button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { TranslatedText } from "@modules/common/components/translation/translated-text"
import { createOrUpdateHsCart } from "@lib/data/hubspot"
import { getCartIdClient } from "@lib/data/cookies-client"
import { convertToLocale } from "@lib/util/money"
import { addItemToWishList } from "@lib/data/wishlist"
type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
  currencyCode: string
}

const Item = ({ item, type = "full", currencyCode }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [localQuantity, setLocalQuantity] = useState(item.quantity)

  const changeQuantity = async (quantity: number) => {
    setError(null)
    setUpdating(true)

    try {
      if (quantity <= 0) {
        await deleteLineItem(item.id)

        setLocalQuantity(0)
        const cartId = await getCartIdClient()
        if (cartId) {
          const cart = await retrieveCart(cartId)
          if (cart) {
            createOrUpdateHsCart(cart)
          }
        }
      } else {
        const cartResponse = await updateLineItem({
          lineId: item.id,
          quantity,
        })
        setLocalQuantity(quantity)
        createOrUpdateHsCart(cartResponse.cart)
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong!")
    } finally {
      setUpdating(false)
    }
  }

  useEffect(() => {
    setLocalQuantity(item.quantity)
  }, [item.quantity])

  const maxQtyFromInventory = 10

  const ItemMaxQuantity = item.variant?.manage_inventory
    ? (item.metadata?.inventory_quantity as number) ?? maxQtyFromInventory
    : maxQtyFromInventory

  const moveToWishList = async () => {
    try {
      setUpdating(true)
      if (item?.variant?.id) {
        await addItemToWishList(item.variant.id!)
        await changeQuantity(0)
      } else {
        throw new Error("Invalid variant ID")
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong!")
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="grid w-full grid-cols-1 gap-10 py-2 md:grid cols-3 lg:p-0 sm:mb-20">
      <div className="col-span-2">
        <div className="flex items-start justify-end py-2 gap-8">
          <p>Import duties included</p>

          <CircleAlert size={20} />
        </div>
        <hr className=" border-gray-200" />
        <div className="flex items-start pt-8 gap-8 justify-between">
          <div className="flex items-start gap-x-8">
            <LocalizedClientLink
              href={`/products/${item.product_handle}`}
              // className={clx("flex", {
              //   "w-16": type === "preview",
              //   "small:w-24 w-12": type === "full",
              // })}
            >
              <img
                alt={item.product_title}
                className="h-40 sm:h-48 w-48 object-contain"
                src={item.thumbnail}
              />
            </LocalizedClientLink>

            <div className="flex flex-col gap-y-2">
              {item.product_collection && (
                <h4
                  style={{
                    fontFamily: "Manrope, Arial, sans-serif",
                    fontSize: "15px",
                  }}
                  className="mb-0 font-semibold leading-5 md:leading-6"
                >
                  {item.product_title && (
                    <TranslatedText text={item.product_collection} />
                  )}
                </h4>
              )}

              <LocalizedClientLink
                href={`/products/${item.product_handle}`}
                className={clx("block", {})}
              >
                <p className="mb-0 text-gray-700 leading-5 md:leading-6 text-[13px] sm:text-[15px]">
                  {item.product_title && (
                    <TranslatedText text={item.product_title} />
                  )}
                </p>
              </LocalizedClientLink>

              {item.variant?.title?.toLocaleLowerCase() !== "default title" &&
                item.variant?.title?.toLocaleLowerCase() !== "default" && (
                  <LineItemOptions
                    variant={item.variant}
                    data-testid="product-variant"
                  />
                )}
              {type === "full" && (
                <div className="flex w-fit items-center gap-x-3 rounded-full bg-gray-200 p-1">
                  <Button
                    onClick={() => changeQuantity(localQuantity - 1)}
                    variant="outline"
                    size="iconSmall"
                  >
                    <Minus />
                  </Button>
                  {updating ? (
                    <div className="flex items-center justify-center">
                      <Spinner />
                    </div>
                  ) : (
                    <span>{localQuantity}</span>
                  )}

                  <Button
                    onClick={() => changeQuantity(localQuantity + 1)}
                    className="bg-red-700 text-black hover:bg-red-800"
                    disabled={updating || localQuantity === ItemMaxQuantity}
                    size="iconSmall"
                  >
                    <Plus />
                  </Button>
                </div>
              )}
              {error && <ErrorMessage error={error} />}
            </div>
          </div>

          <div className="flex flex-col gap-3 max-sm:hidden">
            {/* <p className=' text-gray-500 font-medium line-through'>
              {convertToLocale({
                amount: item.original_total,
                currency_code: currencyCode,
              })}
            </p> */}

            <div className="flex items-center gap-x-2">
              {/* <p className='font-medium'>
                -
                {convertToLocale({
                  amount: 20,
                  currency_code: currencyCode,
                })}
              </p>

              <div className='rounded-md bg-red-600 flex items-center justify-center'>
                <p className='text-white font-semibold px-2 py-1'>Sale</p>
              </div> */}
            </div>

            <p
              className=" text-red-600 font-medium"
              style={{ fontSize: "14px" }}
            >
              {convertToLocale({
                amount: item.original_total,
                currency_code: currencyCode,
              })}
            </p>

            <p>Import duties included</p>
          </div>

          <div className="max-sm:hidden">
            <div
              className="
          flex flex-col gap-6 [&>div>p:last-child]:font-medium [&>div>p:last-child]:text-[16px] [&>div>p:first-child]:text-[14px]
          [&>div>p:first-child]:mb-1
          "
            >
              {/* <div>
                <p>Size</p>
                <p>L</p>
              </div>

              <div>
                <p>Color</p>
                <p>Black</p>
              </div> */}
            </div>

            <button
              className="flex items-center gap-4 mt-12 cursor-pointer hover:opacity-50"
              onClick={moveToWishList}
              disabled={updating}
            >
              <Heart size={18} />

              <p className="underline">Move to wishlist</p>
            </button>
          </div>

          <div>
            <X
              className="cursor-pointer"
              size={20}
              onClick={() => changeQuantity(0)}
            />
          </div>
        </div>

        <div className="flex items-end sm:items-start max-sm:justify-between max-sm:flex-row-reverse sm:pt-8 gap-8 sm:hidden px-2">
          <div className="flex flex-col gap-3 max-sm:items-end">
            {/* <p className=' text-gray-500 font-medium line-through'>
              {convertToLocale({
                amount: item.original_total,
                currency_code: currencyCode,
              })}
            </p> */}

            {/* <div className="flex items-center gap-x-2">
              <p className='font-medium'>
                -
                {convertToLocale({
                  amount: 20,
                  currency_code: currencyCode,
                })}
              </p>

              <div className='rounded-md bg-red-600 flex items-center justify-center'>
                <p className='text-white font-semibold px-2 py-1'>Sale</p>
              </div>
            </div> */}

            <p
              className=" text-red-600 font-medium"
              style={{ fontSize: "14px" }}
            >
              {convertToLocale({
                amount: item.original_total,
                currency_code: currencyCode,
              })}
            </p>

            <p>Import duties included</p>
          </div>

          <div className="">
            <div
              className="
          flex flex-col gap-6 [&>div>p:last-child]:font-medium [&>div>p:last-child]:text-[16px] [&>div>p:first-child]:text-[14px]
          [&>div>p:first-child]:mb-1
          "
            >
              {/* <div>
                <p>Size</p>
                <p>L</p>
              </div>

              <div>
                <p>Color</p>
                <p>Black</p>
              </div> */}
            </div>

            <button
              className="flex items-center gap-4 mt-12 cursor-pointer hover:opacity-50"
              onClick={moveToWishList}
              disabled={updating}
            >
              <Heart size={18} />

              <p className="underline">Move to wishlist</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Item
