"use client"
import { useEffect, useState } from "react"
import { HttpTypes } from "@medusajs/types"
import WishlistIcon from "./wishlistIcon"
import { toast } from "sonner"
import {
  addItemToWishList,
  removeItemFromWishList,
  wishListItems,
} from "@lib/data/wishlist"
import { Wishlist } from "@modules/layout/templates/nav"
import { ShoppingBag } from "lucide-react"
import { TranslatedText } from "../components/translation/translated-text"

export const AddToWishList = ({
  variant,
  isValid,
  inStock,
}: {
  product: HttpTypes.StoreProduct
  variant: HttpTypes.StoreProductVariant
  isValid: boolean
  inStock: boolean
}) => {
  const [wishListItemsData, setWishListItemsData] = useState<Wishlist | null>(
    null
  )
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [wishListItemId, setWishListItemId] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  // Wishlist fetch hone ka function
  const fetchWishlist = async () => {
    setIsLoading(true)
    try {
      const wishlist = await wishListItems()
      setWishListItemsData(wishlist)
    } catch (err) {
      console.error("Error fetching wishlist", err)
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    fetchWishlist()
  }, [])

  useEffect(() => {
    if (!wishListItemsData) return

    const existingItem = wishListItemsData.items?.find(
      (item) => item?.product_variant_id === variant?.id
    )

    if (existingItem) {
      setWishListItemId(existingItem.id)
      setIsInWishlist(true)
    } else {
      setWishListItemId("")
      setIsInWishlist(false)
    }
  }, [variant?.id, wishListItemsData])

  const handleAddToWishlist = async () => {
    if (isLoading) return
    const variant_id = variant?.id
    if (!variant_id) return

    setIsLoading(true)
    try {
      const response = await addItemToWishList(variant_id)
      if (response == "FALSE") {
        toast.error("Please login to add item to wishlist")
        return
      }
      toast.success("Product added to WishList")
      await fetchWishlist() // Wishlist refresh karne ke liye dobara call
    } catch (err) {
      console.error("Error adding item to wishlist", err)
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  // Wishlist se remove karne ka function
  const handleRemoveFromWishlist = async () => {
    if (isLoading || !wishListItemId) return

    setIsLoading(true) // Request start hone se pehle loading true
    try {
      const success = await removeItemFromWishList(wishListItemId)
      if (success) {
        toast.success("Product removed from WishList")
        await fetchWishlist() // Wishlist refresh karne ke liye dobara call
      }
    } catch (err) {
      console.error("Error removing item from wishlist", err)
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex gap-4 relative">
      {!isInWishlist ? (
        <>
          <button
            className={`flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black ${
              !variant || !isValid || isLoading
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={handleAddToWishlist}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            <WishlistIcon className="text-[#c52128]" />
          </button>
          {isOpen && (!variant || !inStock) && (
            <div className="px-6 absolute top-[-20px] right-9 w-[150px] py-2 flex justify-center items-center gap-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <ShoppingBag size={16} />
              <p> {!inStock ? <TranslatedText text="Out of Stock" /> : <TranslatedText text="Select variant" />} </p>
            </div>
          )}
        </>
      ) : (
        <button
          className={`flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-800 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleRemoveFromWishlist}
          disabled={isLoading}
        >
          <WishlistIcon fill={true} />
        </button>
      )}
    </div>
  )
}
