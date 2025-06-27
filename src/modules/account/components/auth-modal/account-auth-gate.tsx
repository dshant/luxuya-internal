"use client"

import { useAuthModal } from "@modules/layout/components/new-side-menu/shared-auth-modal"
import { useEffect } from "react"

const AccountAuthGate = () => {
  const { openAuthModal } = useAuthModal()

  useEffect(() => {
    openAuthModal()
  }, [])

  return null
}

export default AccountAuthGate
