"use client"

import { TranslatedText } from "@modules/common/components/translation/translated-text"
import { Button } from "@modules/common/components/ui/button"
import { InfoIcon } from "lucide-react"
import Link from "next/link"

export default function PaymentFail() {

  return (
    <div className="flex flex-col justify-center items-center gap-y-4 h-[50vh]">
    <div
      className="flex items-center p-4 mb-4 text-sm text-[#991b1b] border border-[#fca5a5] bg-[#fef2f2] rounded-lg gap-1"
      role="alert"
    >
      <InfoIcon />
      <div><TranslatedText text="Payment Failed" /></div>
    </div>
    <Link href="/">
      <Button className="text-white bg-black font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center m-2">
        <TranslatedText text="Go to Home" />
      </Button>
    </Link>
  </div>
  )
}