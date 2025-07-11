import "server-only"
import { cookies as nextCookies } from "next/headers"

export const getAuthHeaders = async (): Promise<
  { authorization: string } | {}
> => {
  const cookies = await nextCookies()
  const token = cookies.get("_medusa_jwt")?.value

  if (!token) {
    return {}
  }

  return { authorization: `Bearer ${token}` }
}

export const getCacheTag = async (tag: string): Promise<string> => {
  try {
    const cookies = await nextCookies()
    const cacheId = cookies.get("_medusa_cache_id")?.value

    if (!cacheId) {
      return ""
    }

    return `${tag}-${cacheId}`
  } catch (error) {
    return ""
  }
}

export const getCacheOptions = async (
  tag: string
): Promise<{ tags: string[] } | {}> => {
  if (typeof window !== "undefined") {
    return {}
  }

  const cacheTag = await getCacheTag(tag)

  if (!cacheTag) {
    return {}
  }

  return { tags: [`${cacheTag}`] }
}

export const setAuthToken = async (token: string) => {
  const cookies = await nextCookies()
  cookies.set("_medusa_jwt", token, {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  })
}

export const removeAuthToken = async () => {
  const cookies = await nextCookies()
  cookies.set("_medusa_jwt", "", {
    maxAge: -1,
  })
}

export const getCartId = async () => {
  const cookies = await nextCookies()
  return cookies.get("_medusa_cart_id")?.value
}

export const setCartId = async (cartId: string) => {
  const cookies = await nextCookies()
  cookies.set("_medusa_cart_id", cartId, {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })
}

export const setHsCustomerEmail = async (hsCustomerEmail: string) => {
  const cookies = await nextCookies()
  cookies.set("_hs_customer_email", hsCustomerEmail, {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  })
}

export const getHsCustomerEmail = async () => {
  const cookies = await nextCookies()
  console.log("Server Get Cookie Email: ", cookies.get("_hs_customer_email"))
  return cookies.get("_hs_customer_email")
}

export const setHsCartId = async (hsCartId: string) => {
  const cookies = await nextCookies()
  cookies.set("_hs_cart_id", hsCartId, {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  })
}

export const getHsCartId = async () => {
  const cookies = await nextCookies()
  return cookies.get("_hs_cart_id")?.value
}

export const getHsCustomerId = async () => {
  const cookies = await nextCookies()
  return cookies.get("_hs_customer_id")?.value
}

export const removeCartId = async () => {
  const cookies = await nextCookies()
  cookies.set("_medusa_cart_id", "", {
    maxAge: -1,
  })
}
