import { login } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { Input } from "@modules/common/components/ui/input"
import { Label } from "@modules/common/components/ui/label"
import { useActionState, useState } from "react"
import { Button } from "@modules/common/components/ui/button"
import { sdk } from "@lib/config"
import { toast, Toast } from "@medusajs/ui"
import { TranslatedTextServer } from "@modules/common/components/translation/translatest-text-server"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(login, null)
  const [email, setEmail] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)

  const handleSendMagicLink = async () => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response: any = await sdk.client.fetch(`/auth/magic-link`, {
        method: "POST",
        body: { email, isSignUp: false },
        headers: {
          "x-publishable-api-key":
            process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
        },
      })

      if (response.message && response.message.includes("successfully")) {
        setSuccess(true)
        toast.success("Success",{
          description:"magic link sent successfully"
        })
      } else {
        setError(response.message || "Failed to send magic link.")
      }
    } catch (error) {
      setError("You dont have an account, sign up first")
      console.error("Error sending magic link", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full flex flex-col items-center" data-testid="login-page">
      <div className="w-full space-y-4">
        <div className="flex flex-col w-full gap-y-2">
          <Label><TranslatedTextServer text="Email" /></Label>
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
        <ErrorMessage error={error} data-testid="login-error-message" />
        <div className="flex items-center justify-between">
          <Button
            variant="link"
            onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
            className="text-sm"
          >
           <TranslatedTextServer text="Don&apos;t have an account?" /> <b><TranslatedTextServer text="Register" /></b>
          </Button>

          <Button
            disabled={!validateEmail(email)}
            onClick={handleSendMagicLink}
            // data-testid="sign-in-button"
            className="w-1/2"
          >
            <TranslatedTextServer text="Email Magic Link" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Login
