"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@modules/common/components/ui/dialog"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@modules/common/components/ui/tabs"
import React, { useEffect, useState } from "react"
import LoginAuthModal from "./login-auth-modal"
import RegisterAuthModal from "./register-auth-modal"
import AuthOTP from "./auth-otp"
import AuthForgotPassword from "./auth-forgot-password"
import { TranslatedText } from "@modules/common/components/translation/translated-text"

interface AuthModalProps {
  open: boolean
  setOpen: (open: boolean) => void
}

const AuthModal = ({ open, setOpen }: AuthModalProps) => {
  const [screen, setScreen] = useState("login-signup")

  useEffect(() => {
    const handleLoginSuccess = () => setOpen(false)
    window.addEventListener("auth-login-success", handleLoginSuccess)

    return () => {
      window.removeEventListener("auth-login-success", handleLoginSuccess)
    }
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[90%] sm:max-w-md max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle />
          <p className="text-xl lg:text-2xl font-medium absolute top-[12px]">
            {screen === "login-signup"
              ? <TranslatedText text="Come on in" />
              : screen === "reset"
              ? <TranslatedText text="Forgot your password" />
              : screen === "otp"
              ? <TranslatedText text="Login With OTP" />
              : ""}
          </p>
        </DialogHeader>
        <div className="mt-12 w-full flex-grow">
          {screen === "login-signup" ? (
            <Tabs defaultValue="tab1" variant={"underline"} className="w-full">
              <TabsList className="flex justify-start items-start mb-5 overflow-hidden h-full">
                <TabsTrigger
                  value="tab1"
                  className="text-lg text-gray-700 px-0"
                >
                  <TranslatedText text="SIGN IN" />
                </TabsTrigger>
                <TabsTrigger
                  value="tab2"
                  className="text-lg text-gray-700 px-0"
                >
                <TranslatedText text="I'M NEW HERE" />
                 
                </TabsTrigger>
              </TabsList>
              <TabsContent
                value="tab1"
                className="max-h-[calc(100vh-250px)] overflow-y-auto pr-2 pb-7"
              >
                <LoginAuthModal setScreen={setScreen} />
              </TabsContent>

              <TabsContent
                value="tab2"
                className="max-h-[calc(100vh-250px)] overflow-y-auto pr-2 pb-7"
              >
                <RegisterAuthModal setScreen={setScreen} />
              </TabsContent>
            </Tabs>
          ) : screen === "otp" ? (
            <AuthOTP setScreen={setScreen} />
          ) : screen === "reset" ? (
            <AuthForgotPassword setScreen={setScreen} />
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AuthModal
