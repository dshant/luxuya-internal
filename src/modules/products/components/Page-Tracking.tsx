"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { analytics } from "@lib/context/segment"
import { StoreCustomer } from "@medusajs/types"

type Props = {
  customer: StoreCustomer | null
}

const PageTracking = ({ customer }: Props) => {
  const pathname = usePathname()

  const documentTitle = pathname.split("/").pop()

  const anonUserId = async () => {
    const anonymousId = (await analytics.user()).anonymousId()
    analytics.identify(anonymousId, {
      email: `anon_${anonymousId}@lfu.com`,
      is_anonymous: true,
    })
  }

  useEffect(() => {
    if (customer) {
      console.log("Customer email", customer.email)
      analytics.identify(customer.id, {
        email: customer.email,
        name:
          customer.first_name && customer.last_name
            ? `${customer.first_name} ${customer.last_name}`
            : "",
        is_anonymous: false,
      })
    } else {
      anonUserId()
    }
    if (pathname) {
      analytics.page(documentTitle, {
        pageName: document.title,
        page_url: pathname,
      })
    }
  }, [pathname])

  return null
}

export default PageTracking
