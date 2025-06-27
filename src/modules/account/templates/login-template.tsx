"use client"

import { useState } from "react"

import Register from "@modules/account/components/register"
import Login from "@modules/account/components/login"
import Image from "next/image"
import { TranslatedText } from "@modules/common/components/translation/translated-text"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

const LoginTemplate = () => {
  const [currentView, setCurrentView] = useState("sign-in")

  return (
    <div className="mx-auto grid grid-cols-1 gap-6 py-12 lg:grid-cols-2 lg:gap-12">
      <div className="relative h-[450px] w-full overflow-hidden rounded-e-lg lg:h-[750px]">
        <Image
          layout="fill"
          src="/auth/login.png"
          alt="auth-bg"
          className="rounded-xl object-cover"
        />
      </div>
      {currentView !== "sign-in" ? (
        <div className="flex h-full w-full flex-col items-start justify-center gap-y-2 p-4">
          <h1 className="font-bebas text-4xl font-bold uppercase"><TranslatedText text="REGISTER" /></h1>
          <p className="max-w-xl text-lg uppercase">
           <TranslatedText text="This is our dedication in serving customers, so that we can find out
            which customers are really interested in" />
          </p>
          <Register setCurrentView={setCurrentView} />
        </div>
      ) : (
        <div className="flex h-full w-full flex-col items-start justify-center gap-y-2 p-4">
          <h1 className="font-bebas text-4xl font-bold"><TranslatedText text="WELCOME BACK" /></h1>
          <p className="max-w-xl text-lg">
           <TranslatedText text="This is our dedication in serving customers, so that we can find out
            which customers are really interested in" />
          </p>
          <Login setCurrentView={setCurrentView} />
        </div>
      )}
    </div>
  )
}

export default LoginTemplate
