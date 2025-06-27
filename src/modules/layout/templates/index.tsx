import React from "react"

import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import { Toaster } from "@modules/common/components/ui/sonner"

const Layout: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <div className="mx-auto w-full">
      <Toaster />
      <Nav />
      <main className="relative">{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
