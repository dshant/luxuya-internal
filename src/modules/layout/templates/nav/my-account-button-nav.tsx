// MobileMenu.tsx or MyAccountNavButton.tsx

"use client"

import { useAuthModal } from "@modules/layout/components/new-side-menu/shared-auth-modal"
import { User } from "lucide-react"

export const MyAccountNavButton = () => {
  const { openAuthModal } = useAuthModal()

  return (
    <button onClick={openAuthModal} className="hover:text-ui-fg-base -mt-1">
      <User size={20} />
    </button>
  )
}
