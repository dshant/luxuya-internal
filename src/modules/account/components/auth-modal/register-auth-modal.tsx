"use client"

import { useState } from "react"
import { signup } from "@lib/data/customer"
import { Input } from "@modules/common/components/ui/input"
import { Label } from "@modules/common/components/ui/label"
import { Button } from "@modules/common/components/ui/button"
import ErrorMessage from "@modules/checkout/components/error-message"
import { toast } from "@medusajs/ui"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useSocialLogin } from "@lib/social-login"
import { TranslatedText } from "@modules/common/components/translation/translated-text"

interface RegisterAuthModalProps {
  setScreen: (screen: string) => void
}

const RegisterAuthModal = ({ setScreen }: RegisterAuthModalProps) => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { loginWithGoogle, loginWithFacebook } = useSocialLogin()

  const params = useParams() as { countryCode: string }
  const countryCode = params.countryCode

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData()
    formData.set("email", email)
    formData.set("first_name", firstName)
    formData.set("last_name", lastName)
    formData.set("password", password)

    const result = await signup(null, formData)

    if (typeof result === "string") {
      setError(result)
      toast.error("Signup Failed", { description: result })
    } else {
      window.dispatchEvent(new Event("auth-login-success"))
      toast.success("Account created!", {
        description: "You are now logged in",
      })
    }

    setLoading(false)
  }

  return (
    <div
      className="w-full flex flex-col items-center gap-3"
      data-testid="register-page"
    >
      <form
        onSubmit={handleRegister}
        className="w-full flex flex-col space-y-4"
      >
        <div className="flex flex-col w-full gap-y-2">
          <div className="space-y-2">
            <Label className="text-base"><TranslatedText text="First Name" /></Label>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              name="first_name"
              type="text"
              required
              className="border rounded-lg h-12"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base"><TranslatedText text="Last Name" /></Label>
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              name="last_name"
              type="text"
              required
              className="border rounded-lg h-12"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base"><TranslatedText text="Email" /></Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              type="email"
              autoComplete="email"
              required
              className="border rounded-lg h-12"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base"><TranslatedText text="Password" /></Label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="border rounded-lg h-12"
            />
          </div>
        </div>

        <ErrorMessage error={error} data-testid="register-error" />

        <Button
          type="submit"
          disabled={!validateEmail(email) || !password || loading}
          className="w-full"
        >
          {loading ? "Loading..." : "Create Account"}
        </Button>

        <Button onClick={() => setScreen("otp")} className="w-full">
         <TranslatedText text=" Login with OTP" />
        </Button>
      </form>

      <div className="w-full flex items-center justify-center">
        <p className="text-lg font-bold">OR</p>
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
    </div>
  )
}

export default RegisterAuthModal
