"use server"

import { sdk } from "@lib/config"
import { setAuthToken, getCacheTag } from "./cookies"
import { revalidateTag } from "next/cache"
import axios from "axios"

export async function socialAuthHandler(
  _state: unknown,
  formData: FormData
): Promise<{
  success: boolean
  message: string
  registerToken?: string
  creCusResg?: any
  loginToken?: string
  finalToken?: string
}> {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const first_name = formData.get("first_name") as string
  const last_name = formData.get("last_name") as string

  try {
    // Step 1: Try to register
    const registerToken = await sdk.auth.register("customer", "emailpass", {
      email,
      password,
    })

    // Step 2: Create customer
    const creCusResg = await sdk.store.customer.create(
      { email, first_name, last_name },
      {},
      { authorization: `Bearer ${registerToken}` }
    )

    // Step 3: Refresh token and set session
    const refreshResponse = await axios.post(
      `${process.env.MEDUSA_BACKEND_URL}/auth/token/refresh`,
      {},
      { headers: { Authorization: `Bearer ${registerToken}` } }
    )

    const finalToken = refreshResponse.data.token || registerToken
    await setAuthToken(finalToken)

    const customerCacheTag = await getCacheTag("customers")
    revalidateTag(customerCacheTag)

    return {
      success: true,
      message: "Account created successfully. You’re now logged in.",
      registerToken,
      creCusResg,
      finalToken,
    }
  } catch (err: any) {
    const raw = err?.message || ""

    // If account exists, try login instead
    if (raw.includes("exists")) {
      try {
        const loginResponse = await sdk.auth.login("customer", "emailpass", {
          email,
          password,
        })

        const loginToken =
          typeof loginResponse === "string" ? loginResponse : undefined
        if (!loginToken) {
          throw new Error("Invalid login response")
        }

        const refreshResponse = await axios.post(
          `${process.env.MEDUSA_BACKEND_URL}/auth/token/refresh`,
          {},
          { headers: { Authorization: `Bearer ${loginToken}` } }
        )

        const finalToken = refreshResponse.data.token || loginToken
        await setAuthToken(finalToken)

        const customerCacheTag = await getCacheTag("customers")
        revalidateTag(customerCacheTag)

        return {
          success: true,
          message: "Welcome back! You’ve been logged in successfully.",
          loginToken,
          finalToken,
        }
      } catch (loginErr: any) {
        return {
          success: false,
          message:
            "Account exists but login failed. Please check your password or reset it.",
        }
      }
    }

    return {
      success: false,
      message: "Something went wrong. Please try again.",
    }
  }
}
