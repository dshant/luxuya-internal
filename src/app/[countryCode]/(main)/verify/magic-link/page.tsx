"use client"

import { useRouter,useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { loginWithMagicLink } from "@lib/data/customer"
import { TranslatedText } from "@modules/common/components/translation/translated-text"

const ValidatePage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = searchParams.get("token")

    if (!token) {
      setError("Token is missing from the URL.")
      setLoading(false)
      return
    }

    const validateToken = async () => {
      try {
        await loginWithMagicLink(token)
        router.replace("/account")
      } catch (err) {
        setError("Failed to validate the token. Please try again.")
        setLoading(false)
      }
    }

    validateToken()
  }, [searchParams])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p><TranslatedText text="Validating your token..." /></p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => (window.location.href = "/")}
          className="mt-4 underline text-blue-500"
        >
         <TranslatedText text="Go back to the homepage" />
        </button>
      </div>
    )
  }

  return null
}

export default ValidatePage
