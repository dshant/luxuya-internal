"use client"

import { clx } from "@medusajs/ui"
import { deleteLineItem, retrieveCart, updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import ErrorMessage from "@modules/checkout/components/error-message"

import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import Spinner from "@modules/common/icons/spinner"
import { useEffect, useState } from "react"
import { Minus, Plus } from "lucide-react"
import { Button } from "@modules/common/components/ui/button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import { TranslatedText } from "@modules/common/components/translation/translated-text"
import { createOrUpdateHsCart } from "@lib/data/hubspot"
import { getCartIdClient } from "@lib/data/cookies-client"
import LineItemCart from "@modules/common/components/line-item-cart"

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

  return (
    <div className="grid w-full grid-cols-1 gap-10 py-2 md:grid cols-3 lg:p-0 mb-20">
      <div className="col-span-2">
        <hr className=" border-gray-200" />
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-x-8 ">
            <LocalizedClientLink
              href={`/products/${item.product_handle}`}
              // className={clx("flex", {
              //   "w-16": type === "preview",
              //   "small:w-24 w-12": type === "full",
              // })}
            >
              <img
                alt={item.product_title}
                className="h-48 w-48 object-contain"
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
                <p
                  style={{
                    fontFamily: "Manrope, Arial, sans-serif",
                    fontSize: "15px",
                  }}
                  className="mb-0 text-gray-700 leading-5 md:leading-6"
                >
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

          <span
            className={clx("!pr-0", {
              "flex flex-col items-end h-full justify-center":
                type === "preview",
            })}
          >
            <div className="pt-3">
              <span className="">
                <LineItemCart
                  item={item}
                  style="tight"
                  currencyCode={currencyCode}
                />
              </span>
              <span className="flex gap-x-1 ltr">
                <span
                  className="text-ui-fg-interactive"
                  data-testid="product-unit-price"
                >
                  {localQuantity}x
                </span>
                <LineItemUnitPrice
                  item={item}
                  style="tight"
                  currencyCode={currencyCode}
                />
              </span>
              <LineItemPrice
                item={item}
                style="tight"
                currencyCode={currencyCode}
              />
            </div>
          </span>
        </div>
      </div>
    </div>
  )
}

export default Item
