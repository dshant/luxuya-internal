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
import { cn } from "@lib/util/cn"
type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
  currencyCode: string
}

const Item = ({ item, type = "full", currencyCode }: ItemProps) => {
  const isPreview = type === "preview"

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
    <div className="text-[#222]">
      {!isPreview && (
        <div className="flex items-center max-sm:pt-0 p-3 gap-4 sm:flex-row-reverse sm:justify-items-end">
          <CircleAlert size={22} />
          <p className="text-[13px]">Import duties included</p>
        </div>
      )}

      <div
        className="border-t border-gray-300 py-6 px-[6px] w-full flex flex-col sm:flex-row gap-0 sm:gap-2 relative sm:justify-between"
        style={
          isPreview
            ? {
                border: "none",
                flexDirection: "row",
                justifyContent: "space-between",
              }
            : {}
        }
      >
        {!isPreview && (
          <X
            className="cursor-pointer absolute top-[19px] right-2"
            size={20}
            onClick={() => changeQuantity(0)}
          />
        )}
        <div className="flex items-start gap-2 sm:justify-between sm:flex-1">
          <LocalizedClientLink href={`/products/${item.product_handle}`}>
            <img
              alt={item.product_title}
              className={`object-contain max-sm:h-40  ${
                isPreview ? "w-40 sm:w-32" : "w-40 sm:w-48"
              }`}
              src={item.thumbnail}
            />
          </LocalizedClientLink>

          {!isPreview && (
            <div className="flex-1 flex">
              <div>
                {item.product_collection && (
                  <h4
                    style={{
                      fontFamily: "Manrope, Arial, sans-serif",
                      fontSize: "15px",
                    }}
                    className="mb-0 font-semibold leading-5 md:leading-6"
                  >
                    <TranslatedText text={item.product_collection} />
                  </h4>
                )}

                <LocalizedClientLink
                  href={`/products/${item.product_handle}`}
                  className={clx("block", {})}
                >
                  <p className="leading-5 md:leading-6 text-sm sm:text-[15px] mt-[6px]">
                    {item.product_title && (
                      <TranslatedText text={item.product_title} />
                    )}
                  </p>
                </LocalizedClientLink>

                {item.variant?.title?.toLocaleLowerCase() !== "default title" &&
                  item.variant?.title?.toLocaleLowerCase() !== "default" && (
                    <p className="text-xs sm:text-[13px] my-[6px]">
                      {item.variant?.title && (
                        <TranslatedText text={item.variant.title} />
                      )}
                    </p>
                  )}
                {!isPreview && (
                  <div className="flex sm:hidden w-fit items-center gap-x-3 rounded-[4px] bg-gray-200 p-[4px] mt-[6px]">
                    <Button
                      onClick={() => changeQuantity(localQuantity - 1)}
                      variant="outline"
                      size="iconSmall"
                      className="rounded-[4px]"
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
                      className="bg-red-700 text-white hover:bg-red-800 rounded-[4px]"
                      disabled={updating || localQuantity === ItemMaxQuantity}
                      size="iconSmall"
                    >
                      <Plus />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-end sm:items-start gap-2 sm:gap-8 sm:flex-row-reverse justify-between sm:justify-start sm:flex-1">
          {!isPreview && (
            <div className="sm:min-w-[270px]">
              <div className="hidden sm:flex w-fit items-center gap-x-3 rounded-[4px] bg-gray-200 p-[4px]">
                <Button
                  onClick={() => changeQuantity(localQuantity - 1)}
                  variant="outline"
                  size="iconSmall"
                  className="rounded-[4px]"
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
                  className="bg-red-700 text-white hover:bg-red-800 rounded-[4px]"
                  disabled={updating || localQuantity === ItemMaxQuantity}
                  size="iconSmall"
                >
                  <Plus />
                </Button>
              </div>

              <button
                className="flex items-center gap-4 mt-4 cursor-pointer hover:opacity-50"
                onClick={moveToWishList}
                disabled={updating}
              >
                <Heart size={18} />

                <p className="underline">Move to wishlist</p>
              </button>
            </div>
          )}

          <div
            className={`flex justify-end items-center`}
            style={
              isPreview
                ? {
                    justifyContent: "flex-end !important",
                  }
                : {}
            }
          >
            <div
              className={`flex flex-col gap-2 ${
                isPreview ? "items-end" : "items-end"
              }`}
            >
              {isPreview && item.product_collection && (
                <p className="uppercase">
                  <TranslatedText text={item.product_collection} />
                </p>
              )}

              <p className=" text-[#727272] font-medium line-through">
                {convertToLocale({
                  amount: item.original_total,
                  currency_code: currencyCode,
                })}
              </p>

              <div className="flex items-center gap-x-2">
                <p className="font-medium">
                  -
                  {convertToLocale({
                    amount: item.discount_total,
                    currency_code: currencyCode,
                  })}
                </p>

                <div className="rounded-md bg-red-600 flex items-center justify-center">
                  <p className="text-white font-semibold px-2 py-1">Sale</p>
                </div>
              </div>

              <p
                className=" text-red-600 font-medium"
                style={{ fontSize: "14px" }}
              >
                {convertToLocale({
                  amount: item.total,
                  currency_code: currencyCode,
                })}
              </p>

              {!isPreview && (
                <p className="text-[13px]">Import duties included</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Item
