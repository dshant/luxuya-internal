"use client"

import { sdk } from "@lib/config"
import { Text, toast } from "@medusajs/ui"
import { TranslatedText } from "@modules/common/components/translation/translated-text"
import { Button } from "@modules/common/components/ui/button"
import { Input } from "@modules/common/components/ui/input"
import { Label } from "@modules/common/components/ui/label"
import { useState } from "react"

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

interface AuthForgotPasswordProps {
  setScreen: (screen: string) => void
}

export default function AuthForgotPassword({
  setScreen,
}: AuthForgotPasswordProps) {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email) {
      toast.warning("Email is required!")
      return
    }
    setLoading(true)

    sdk.auth
      .resetPassword("customer", "emailpass", {
        identifier: email,
      })
      .then(() => {
        toast.success(
          "If an account exists with the specified email, it'll receive instructions to reset the password."
        )
        window.dispatchEvent(new Event("auth-login-success"))
      })
      .catch((error) => {
        toast.error(error.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col items-start gap-5"
    >
      <Text className="text-base font-medium">
       <TranslatedText text="Enter your email address and we'll send you a link to reset your
        password" />
      </Text>

      <div className="w-full space-y-2">
        <Label className="text-base font-medium"><TranslatedText text="Email" /></Label>
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border text-base rounded-lg h-12"
          required
        />
      </div>

      <Button
        disabled={!validateEmail(email) || !email || loading}
        type="submit"
        className="w-full mt-3"
      >
        {loading ? <TranslatedText text="Loading..." /> : <TranslatedText text="Request Password Reset" />}
      </Button>

      <Button
        onClick={() => setScreen("login-signup")}
        className="w-full font-bold bg-transparent text-black hover:bg-gray-100 border border-gray-300"
      >
        <TranslatedText text="Back to sign in" />
      </Button>
    </form>
  )
}
