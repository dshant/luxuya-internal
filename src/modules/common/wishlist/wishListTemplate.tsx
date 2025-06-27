"use client"
import { HttpTypes } from "@medusajs/types"
import { toast } from "sonner"
import SignInPrompt from "@modules/cart/components/sign-in-prompt"
import { Wishlist, WishlistItem } from "@modules/layout/templates/nav"
import { removeItemFromWishList } from "@lib/data/wishlist"
import { addToCart } from "@lib/data/cart"
import Link from "next/link"
import { useState } from "react"
import { TranslatedText } from "../components/translation/translated-text"
import { createOrUpdateHsCart } from "@lib/data/hubspot"

interface Props {
  wishListData: Wishlist
  customer: HttpTypes.StoreCustomer | null
  region: HttpTypes.StoreRegion
  countryCode: string
}

const WishlistTemplate = ({ wishListData, customer, countryCode }: Props) => {
  const { items } = wishListData
  const [loadingItem, setLoadingItem] = useState<string | null>(null)

  const handleRemove = async (id: string) => {
    try {
      await removeItemFromWishList(id)
      toast.success("Item removed from wishlist!")
    } catch (error) {
      console.error("Error removing item from wishlist:", error)
      toast.error("Failed to remove item from wishlist.")
    }
  }

  const handleAddToCart = async (item: WishlistItem) => {
    setLoadingItem(item.id)

    try {
      const cartResponse = await addToCart({
        variantId: item.product_variant_id,
        quantity: 1,
        countryCode: countryCode,
        inventory_quantity: item.stocked_quantity,
      })

      toast.success("Product successfully added to your cart!")
      setLoadingItem(null)
      await removeItemFromWishList(item.id)
      createOrUpdateHsCart(cartResponse.cart)
    } catch (error) {
      console.error("Error adding item to cart:", error)
      toast.error("Failed to add product to cart.")
    } finally {
      setLoadingItem(null)
    }
  }

  return (
    <>
      <div className="w-full p-4 bg-white rounded-lg mt-3 hidden md:block">
        {!customer ? (
          <>
            <SignInPrompt />
            <p className="text-center text-gray-500 mt-7">
              <TranslatedText text="No Wishlist available. Please sign in to view your wishlist." />
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">
              <TranslatedText text="My Wishlist" /> ✨
            </h2>
            {!wishListData || !wishListData?.items || items?.length === 0 ? (
              <p className="text-center text-gray-500">
                <TranslatedText text="Your wishlist is empty." />
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-gray-100">
                      <th className="p-2 text-left">
                        <TranslatedText text="Product Image" />
                      </th>
                      <th className="p-2 text-left">
                        <TranslatedText text="Product Name" />
                      </th>
                      <th className="p-2 text-left">
                        <TranslatedText text="Variant" />
                      </th>
                      <th className="p-2 text-left">
                        <TranslatedText text="Add to Cart" />
                      </th>
                      <th className="p-2 text-left">
                        <TranslatedText text="Remove" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items?.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <Link
                          href={`/products/${item?.product_variant?.product?.handle}`}
                        >
                          <td className="p-3 pl-3">
                            <img
                              src={
                                item?.product_variant?.product?.thumbnail || ""
                              }
                              alt={item?.product_variant?.product.title}
                              className="rounded-md object-contain w-32 h-32"
                            />
                          </td>
                        </Link>
                        <td className="p-1">
                          <TranslatedText
                            text={item?.product_variant?.product.title}
                          />
                        </td>
                        <td className="p-3">
                          <TranslatedText text={item?.product_variant?.title} />
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => handleAddToCart(item)}
                            disabled={
                              item.stocked_quantity === 0 ||
                              loadingItem === item.id
                            }
                            className={`bg-black text-white px-4 py-2 rounded hover:bg-gray-800 w-full sm:w-auto ${
                              item.stocked_quantity === 0
                                ? "cursor-not-allowed"
                                : ""
                            }`}
                          >
                            {loadingItem === item.id ? (
                              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 inline-block"></span>
                            ) : (
                              <TranslatedText text="ADD TO CART" />
                            )}
                          </button>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => handleRemove(item.id)}
                            className="text-red-500 hover:text-red-700 text-2xl"
                          >
                            ✖
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* Mobile View  */}
      <div className="block md:hidden w-full  bg-white rounded-lg mt-3">
        {!customer ? (
          <>
            <SignInPrompt />
            <p className="text-center text-gray-500 mt-7">
              <TranslatedText text="No Wishlist available. Please sign in to view your wishlist." />
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">
              <TranslatedText text="My Wishlist " />✨
            </h2>

            {items?.length === 0 ? (
              <p className="text-center text-gray-500">
                <TranslatedText text="Your wishlist is empty." />
              </p>
            ) : (
              <div className="grid gap-4">
                {items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center p-3 bg-gray-50 rounded-md shadow-sm relative"
                  >
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-2xl"
                    >
                      ✖
                    </button>

                    <Link
                      href={`/products/${item?.product_variant?.product?.handle}`}
                      className="flex-shrink-0"
                    >
                      <img
                        src={item?.product_variant?.product?.thumbnail || ""}
                        alt={item?.product_variant?.product.title}
                        className="w-20 h-20 rounded-md object-contain"
                      />
                    </Link>

                    <div className="ml-3 flex-1">
                      <h2 className="text-sm font-medium ">
                        <TranslatedText
                          text={item?.product_variant?.product.title}
                        />
                      </h2>
                      <p className="text-gray-600 text-xs mt-1">
                        <TranslatedText
                          text={`Variant: ${item?.product_variant?.title}`}
                        />
                      </p>
                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={
                          item.stocked_quantity === 0 || loadingItem === item.id
                        }
                        className={`mt-3 w-32 bg-black text-white px-3 py-1 rounded hover:bg-gray-800 ${
                          item.stocked_quantity === 0
                            ? "cursor-not-allowed opacity-50"
                            : ""
                        }`}
                      >
                        {loadingItem === item.id ? (
                          <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 inline-block"></span>
                        ) : (
                          <TranslatedText text="Add to Cart" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default WishlistTemplate
