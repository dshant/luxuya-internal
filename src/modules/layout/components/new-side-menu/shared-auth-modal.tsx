"use client"

import { createContext, useContext, useState } from "react"
import AuthModal from "@modules/account/components/auth-modal/auth-modal"

type AuthContextType = {
  openAuthModal: () => void
  close: () => void
}

const AuthModalContext = createContext<AuthContextType | null>(null)

export const useAuthModal = () => {
  const context = useContext(AuthModalContext)
  if (!context) {
    throw new Error("useAuthModal must be used within AuthModalProvider")
  }
  return context
}

export const AuthModalProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [openAuthModal, setOpenAuthModal] = useState(false)

  return (
    <AuthModalContext.Provider
      value={{
        openAuthModal: () => setOpenAuthModal(true),
        close: () => setOpenAuthModal(false),
      }}
    >
      {children}
      <AuthModal open={openAuthModal} setOpen={setOpenAuthModal} />
    </AuthModalContext.Provider>
  )
}
