"use client"

import Cookies from "js-cookie"

export const setAuthTokenClient = (token: string) => {
  Cookies.set("_medusa_jwt", token, {
    expires: 7, // 7 days
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  })
}

export const getAuthHeadersClient = (): { authorization: string } | {} => {
  const token = Cookies.get("_medusa_jwt")
  if (!token) return {}
  return { authorization: `Bearer ${token}` }
}

export const removeAuthTokenClient = () => {
  Cookies.remove("_medusa_jwt")
}

export const getCacheTagClient = (tag: string): string => {
  const cacheId = Cookies.get("_medusa_cache_id")
  if (!cacheId) return ""
  return `${tag}-${cacheId}`
}

export const getCacheOptionsClient = (tag: string): { tags: string[] } | {} => {
  const cacheTag = getCacheTagClient(tag)
  if (!cacheTag) return {}
  return { tags: [cacheTag] }
}

export const getCartIdClient = (): string | undefined => {
  return Cookies.get("_medusa_cart_id")
}

export const setCartIdClient = (cartId: string) => {
  Cookies.set("_medusa_cart_id", cartId, {
    expires: 7,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  })
}

export const removeCartIdClient = () => {
  Cookies.remove("_medusa_cart_id")
}

export const getHsCartIdClient = (): string | undefined => {
  return Cookies.get("_hs_cart_id")
}

export const setHsCartIdClient = (hsCartId: string) => {
  Cookies.set("_hs_cart_id", hsCartId, {
    expires: 7,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  })
}

export const getHsCustomerId = (): string | undefined => {
  return Cookies.get("_hs_customer_id")
}

export const setHsCustomerId = (hsCartId: string) => {
  Cookies.set("_hs_customer_id", hsCartId, {
    expires: 7,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  })
}

export const getHsCustomerEmail = (): string | undefined => {
  // console.log("Cookie", Cookies.get("_hs_customer_email"))
  // console.log("All Cookies", Cookies.get())
  return Cookies.get("_hs_customer_email")
}

export const setHsCustomerEmailClient = (hsCustomerEmail: string) => {
  Cookies.set("_hs_customer_email", hsCustomerEmail, {
    expires: 7,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  })
}

export const getAnonId = (): string | undefined => {
  return Cookies.get("_anon_id")
}

export const setAnonId = (hsCartId: string) => {
  Cookies.set("_anon_id", hsCartId, {
    expires: 7,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  })
}

export const getModalCookie = (name: string): string | undefined => {
  return Cookies.get(name)
}

export const setModalCookie = (
  name: string,
  value: string,
  maxAgeInSeconds: number
) => {
  Cookies.set(name, value, {
    path: "/",
    expires: maxAgeInSeconds / 86400, // 86400 seconds in a day
    sameSite: "Strict",
  })
}
