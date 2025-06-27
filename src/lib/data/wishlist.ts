"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders, getCacheOptions, getCacheTag } from "./cookies"
import { revalidateTag } from "next/cache"

export const wishListItems = async () => {
  const next = {
    ...(await getCacheOptions("wish_list_items")),
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  if (!headers.authorization) {
    return {}
  }

  return sdk.client
    .fetch<{ wishlist: any }>(`/store/customers/me/wishlists`, {
      method: "GET",
      next,
      cache: "force-cache",
      headers,
    })
    .then(({ wishlist }) => {
      return wishlist
    })

    .catch((err) => {
      console.log("Error fetching wishlist items", err?.message)
      return {}
    })
}

export const addItemToWishList = async (variantId: string) => {
  if (!variantId) {
    throw new Error("Missing variant ID when adding to wishlist")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }
  if (!headers.authorization) {
    return "FALSE"
  }
  try {
    await sdk.client.fetch("/store/customers/me/wishlists/items", {
      method: "POST",
      headers,
      body: {
        variant_id: variantId,
      },
    })
    const wishListCacheTag = await getCacheTag("wish_list_items")
    revalidateTag(wishListCacheTag)
  } catch (error) {
    //@ts-ignore
    console.error("Wishlist add error:", error?.message)
    return {}
  }
}

export const removeItemFromWishList = async (wishListItem_id: string) => {
  if (!wishListItem_id) return

  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    await sdk.client.fetch(
      `/store/customers/me/wishlists/items/${wishListItem_id}`,
      {
        method: "DELETE",
        headers,
      }
    )

    const wishListCacheTag = await getCacheTag("wish_list_items")
    revalidateTag(wishListCacheTag)
    return true
  } catch (err) {
    // @ts-ignore
    console.error("Error in removing item from wishlist",err?.message)
    return false
  }
}
