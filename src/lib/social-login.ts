"use client"

import { signInWithPopup, AuthProvider } from "firebase/auth"
import { auth, googleProvider, facebookProvider } from "./firebase"
import { toast } from "@medusajs/ui"
import { socialAuthHandler } from "./data/social-auth"
import { useRouter } from "next/navigation"

export const useSocialLogin = () => {
  const router = useRouter()

  const handleSocialLogin = async (
    provider: AuthProvider,
    countryCode: string
  ) => {
    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      const formData = new FormData()
      formData.set("email", user.email || "")
      formData.set("password", user.uid)
      formData.set("first_name", user.displayName?.split(" ")[0] || "")
      formData.set("last_name", user.displayName?.split(" ")[1] || "")

      const res = await socialAuthHandler(null, formData)

      if (res.success) {
        // router.push(`/${countryCode}/account`)

        window.dispatchEvent(new Event("auth-login-success"))
        toast.success("Welcome!", {
          description: res.message || "You're now logged in.",
        })
      } else {
        toast.error("Social login failed", {
          description: res.message || "Something went wrong. Please try again.",
        })
      }
    } catch (err) {
      console.error("Social login error", err)
      toast.error("Login error", {
        description: "Unable to login via social provider.",
      })
    }
  }

  return {
    loginWithGoogle: (countryCode: string) =>
      handleSocialLogin(googleProvider, countryCode),
    loginWithFacebook: (countryCode: string) =>
      handleSocialLogin(facebookProvider, countryCode),
  }
}
