"use client"

import { useState } from "react"
import { Input } from "@modules/common/components/ui/input"
import { Label } from "@modules/common/components/ui/label"
import { Button } from "@modules/common/components/ui/button"
import ErrorMessage from "@modules/checkout/components/error-message"
import Image from "next/image"
import { Text, toast } from "@medusajs/ui"
import { login } from "@lib/data/customer"
import { useParams, useRouter } from "next/navigation"
import { useSocialLogin } from "@lib/social-login"
import { TranslatedText } from "@modules/common/components/translation/translated-text"

interface LoginAuthModalProps {
  setScreen: (screen: string) => void
}

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const LoginAuthModal = ({ setScreen }: LoginAuthModalProps) => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const { loginWithGoogle, loginWithFacebook } = useSocialLogin()

  const router = useRouter()
  const params = useParams() as { countryCode: string }
  const countryCode = params.countryCode

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData()
    formData.set("email", email)
    formData.set("password", password)

    const result = await login(null, formData)

    if (result) {
      toast.error("Login failed", { description: result })
      setError(result)
    } else {
      window.dispatchEvent(new Event("auth-login-success"))

      // router.replace("/account")
      toast.success("Logged in successfully")
    }

    setLoading(false)
  }

  return (
    <form
      className="w-full flex flex-col items-center gap-3"
      onSubmit={handleSubmit}
      data-testid="login-page"
    >
      <div className="w-full space-y-4">
        <div className="flex flex-col w-full gap-y-2">
          <div className="w-full space-y-2">
            <Label className="text-base">
              <TranslatedText text="Email" />
            </Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              type="email"
              autoComplete="email"
              required
              className="border text-base rounded-lg h-12"
            />
          </div>

          <div className="w-full space-y-2">
            <Label className="text-base">
              <TranslatedText text="Password" />
            </Label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="border text-base rounded-lg h-12"
            />
          </div>
        </div>

        <Text
          onClick={() => setScreen("reset")}
          className="text-base underline cursor-pointer"
        >
          <TranslatedText text="Forgot Password?" />
        </Text>

        <ErrorMessage error={error} data-testid="login-error-message" />

        <Button
          disabled={!validateEmail(email) || !password || loading}
          type="submit"
          className="w-full"
        >
          {loading ? (
            <TranslatedText text="Loading..." />
          ) : (
            <TranslatedText text="Login" />
          )}
        </Button>

        <Button onClick={() => setScreen("otp")} className="w-full">
          <TranslatedText text="Login with OTP" />
        </Button>
      </div>

      <div className="w-full flex items-center justify-center">
        <p className="text-lg font-bold">
          <TranslatedText text="OR" />
        </p>
      </div>

      <div className="flex flex-col gap-4 w-full">
        <Button
          onClick={() => loginWithGoogle(countryCode)}
          type="button"
          variant="outline"
          className="w-full border-black border-2 flex items-center justify-between font-bold"
        >
          <Image
            src={"/icon/google.png"}
            alt="Google Icon"
            width={48}
            height={48}
            className="w-6 h-6"
          />
          <TranslatedText text="Continue with Google" />
          <div></div>
        </Button>

        <Button
          onClick={() => loginWithFacebook(countryCode)}
          type="button"
          variant="outline"
          className="w-full border-black border-2 flex items-center justify-between font-bold"
        >
          <Image
            src={"/icon/facebook.png"}
            alt="Facebook Icon"
            width={48}
            height={48}
            className="w-6 h-6"
          />
          <TranslatedText text="Continue with Facebook" />
          <div></div>
        </Button>
      </div>
    </form>
  )
}

export default LoginAuthModal
