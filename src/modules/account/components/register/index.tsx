"use client"

import { useActionState, useState } from "react"
import { Input } from "@modules/common/components/ui/input"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { login, signup } from "@lib/data/customer"
import { Label } from "@modules/common/components/ui/label"
import { Button } from "@modules/common/components/ui/button"
import { sdk } from "@lib/config"
import { toast } from "@medusajs/ui"
import { useSocialLogin } from "@lib/social-login"
import { useParams } from "next/navigation"
import { TranslatedText } from "@modules/common/components/translation/translated-text"
import { TranslatedTextServer } from "@modules/common/components/translation/translatest-text-server"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Register = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(login, null)
  const [email, setEmail] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)

  const { loginWithGoogle, loginWithFacebook } = useSocialLogin()

  const params = useParams() as { countryCode: string }
  const countryCode = params.countryCode

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSendMagicLink = async () => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response: any = await sdk.client.fetch(`/auth/magic-link`, {
        method: "POST",
        body: { email, isSignUp: true },
        headers: {
          "x-publishable-api-key":
            process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
        },
      })

      if (response.message && response.message.includes("successfully")) {
        setSuccess(true)

        toast.success("Success", {
          description: "Magic link sent successfully.",
        })
      } else {
        setError(response.message || "Failed to send magic link.")
      }
    } catch (error) {
      setError("You already have account,login please")
      console.error("Error sending magic link", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="w-full flex flex-col items-center gap-5"
      data-testid="register-page"
    >
      <form className="w-full flex flex-col space-y-4">
        <div className="flex flex-col w-full gap-y-2">
          <Label><TranslatedText text="Email" /></Label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            name="email"
            type="email"
            title="Enter a valid email address."
            autoComplete="email"
            required
            data-testid="email-input"
          />
          {/* <Label>Password</Label>
          <Input
            placeholder=""
            name="password"
            type="password"
            autoComplete="current-password"
            required
            data-testid="password-input"
          /> */}
        </div>

        <ErrorMessage error={error} data-testid="register-error" />
        <div className="flex items-center justify-between">
          <Button
            variant="link"
            onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
            className="text-sm"
          >
            <TranslatedText text="Already have an account?" /> <b><TranslatedText text="Login" /></b>
          </Button>
          <Button
            className="w-1/2"
            disabled={!validateEmail(email)}
            onClick={handleSendMagicLink}
          >
            <TranslatedText text="Email Magic Link" />
          </Button>
        </div>
      </form>

      <div className="w-full flex items-center justify-center">
        <p><TranslatedText text="Or countinue with" /></p>
      </div>

      <div className="flex flex-col gap-4 w-full">
        <Button
          onClick={() => loginWithGoogle(countryCode)}
          variant="outline"
          className="w-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
              fill="currentColor"
            />
          </svg>
         <TranslatedText text="Countinue with Google" />
        </Button>
        <Button
          onClick={() => loginWithFacebook(countryCode)}
          variant="outline"
          className="w-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
              fill="currentColor"
            />
          </svg>
          <TranslatedText text="Countinue with Facebook" />
        </Button>
      </div>
    </div>
  )
}

export default Register
