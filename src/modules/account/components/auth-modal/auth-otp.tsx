"use client"

import React, { useState } from "react"
import { Button } from "@modules/common/components/ui/button"
import ErrorMessage from "@modules/checkout/components/error-message"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@modules/common/components/ui/input-otp"
import { SelectCountryCode } from "./select-country-code"
import { Label } from "@modules/common/components/ui/label"
import Image from "next/image"
import { Input } from "@modules/common/components/ui/input"
import { Text } from "@medusajs/ui"
import { useParams, useRouter } from "next/navigation"
import { setAuthTokenClient } from "@lib/data/cookies-client"
import { useSocialLogin } from "@lib/social-login"
import { TranslatedText } from "@modules/common/components/translation/translated-text"

interface AuthOTPProps {
  setScreen: (screen: string) => void
}

const AuthOTP = ({ setScreen }: AuthOTPProps) => {
  const [otpScreen, setOTPScreen] = useState<"number" | "otp">("number")
  const [countryCode, setCountryCode] = useState("91")
  const [selectedCountry, setSelectedCountry] = useState("IN")
  const [number, setNumber] = useState("")
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(30)
  const [canResend, setCanResend] = useState(false)

  const { loginWithGoogle, loginWithFacebook } = useSocialLogin()

  const router = useRouter()
  const params = useParams() as { countryCode: string }
  const countryCodeNavigation = params.countryCode

  const startResendTimer = () => {
    setCanResend(false)
    setResendTimer(30)
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev === 1) {
          clearInterval(interval)
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const sendOtp = async () => {
    setLoading(true)
    try {
      const res = await fetch(
        `https://portal.lfyfashion.com/store/twilio/auth`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key":
              process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
          },
          body: JSON.stringify({
            phone: number,
            country_code: Number(countryCode),
          }),
        }
      )

      if (!res.ok) {
        throw new Error()
      }

      setError("")
      setOtp("")
      setOTPScreen("otp")
      startResendTimer()
    } catch {
      setError("Failed to send OTP. Please check your phone number.")
    }
    setLoading(false)
  }

  const verifyOtp = async () => {
    setLoading(true)
    try {
      const res = await fetch(
        "https://portal.lfyfashion.com/auth/customer/mobileauth",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key":
              process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
          },
          body: JSON.stringify({
            phone: number,
            country_code: Number(countryCode),
            otp,
          }),
        }
      )

      const data = await res.json()
      if (!res.ok || !data?.token) {
        throw new Error()
      }

      console.log("Token:", data.token)
      setAuthTokenClient(data.token) // Set JWT token in cookie
      window.dispatchEvent(new Event("auth-login-success"))
      router.push(`/${countryCodeNavigation}/account`)
      setError("")
    } catch {
      setError("The OTP entered is incorrect. Please try again.")
    }
    setLoading(false)
  }

  const resendCode = async () => {
    if (!canResend) return
    setLoading(true)

    try {
      const res = await fetch(
        "https://portal.lfyfashion.com/store/twilio/auth",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key":
              process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
          },
          body: JSON.stringify({
            phone: number,
            country_code: Number(countryCode),
          }),
        }
      )

      if (!res.ok) throw new Error()
      setOtp("")
      setError("")
      startResendTimer()
    } catch {
      setError("Failed to resend OTP. Please try again.")
    }

    setLoading(false)
  }

  return (
    <div className="w-full flex flex-col items-center gap-3">
      <div className="w-full space-y-4">
        {otpScreen === "number" ? (
          <>
            <div className="flex flex-col gap-y-2">
              <Label className="text-base"><TranslatedText text="Country" /></Label>
              <SelectCountryCode
                setCountryCode={setCountryCode}
                selectedCountry={selectedCountry}
                setSelectedCountry={setSelectedCountry}
              />
            </div>

            <div className="flex flex-col gap-y-2">
              <Label className="text-base"><TranslatedText text="Phone Number" /></Label>
              <Input
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                name="number"
                type="number"
                required
                className="border text-base rounded-lg h-12"
              />
            </div>

            <div className="flex items-center justify-start">
              <button
                className="underline text-sm"
                onClick={() => setScreen("login-signup")}
              >
                <TranslatedText text="Sign in with password" />
              </button>
            </div>

            <ErrorMessage error={error} />

            <Button
              onClick={sendOtp}
              disabled={!number || loading}
              className="w-full"
            >
              {loading ? <TranslatedText text="Sending OTP..." /> : <TranslatedText text="Get OTP on Phone" />}
            </Button>

            <div className="w-full flex items-center justify-center">
              <p className="text-lg font-semibold"><TranslatedText text="OR" /></p>
            </div>

            <div className="flex flex-col gap-4">
              <Button
                onClick={() => loginWithGoogle(countryCodeNavigation)}
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
                <TranslatedText text="Sign in with Google" />
                <div />
              </Button>

              <Button
                onClick={() => loginWithFacebook(countryCodeNavigation)}
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
                <TranslatedText text="Sign in with Facebook" />
                <div />
              </Button>
            </div>
          </>
        ) : (
          <>
            <Label className="text-base font-medium">Enter OTP</Label>

            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(val: any) => setOtp(val)}
            >
              <InputOTPGroup className="w-full flex justify-between">
                {[...Array(6)].map((_, i) => (
                  <InputOTPSlot
                    className="border-2 rounded-md md:h-12 md:w-12"
                    key={i}
                    index={i}
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>

            <Text className="text-sm">
              A 6-digit code was sent to your phone number. Please enter it
              below.
            </Text>

            <div className="flex items-center justify-start gap-1 text-sm">
              <button
                className="underline"
                onClick={() => setScreen("login-signup")}
              >
                Sign in with password
              </button>
              or
              <button
                className={`underline ${
                  !canResend ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={resendCode}
                disabled={!canResend}
              >
                {canResend ? "Resend OTP" : `Resend in ${resendTimer}s`}
              </button>
            </div>

            <ErrorMessage error={error} />

            <Button
              onClick={verifyOtp}
              disabled={otp.length !== 6 || loading}
              className="w-full"
            >
              {loading ? "Verifying..." : "Verify & Continue"}
            </Button>

            <Button
              onClick={() => setOTPScreen("number")}
              variant="outline"
              className="w-full"
            >
              Use a different number
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

export default AuthOTP
