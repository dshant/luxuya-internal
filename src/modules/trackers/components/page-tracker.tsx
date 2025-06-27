"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { analytics } from "@lib/context/segment"
import { StoreCustomer } from "@medusajs/types"
import { useSearchParams } from "next/navigation"
import {
  getAnonId,
  getHsCustomerEmail,
  setAnonId,
  setHsCustomerEmailClient,
} from "@lib/data/cookies-client"
import { createHsCustomer, updateHsCustomer } from "@lib/data/hubspot"

type Props = {
  customer: StoreCustomer | null
}

const PageTracker = ({ customer }: Props) => {
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const documentTitle = pathname.split("/").pop()

  const anonUserId = async () => {
    const localAnonId = getAnonId()
    console.log("Creating anon user in HS", localAnonId)
    if (localAnonId) {
      const email = `anon_${localAnonId}@lfu.com`
      analytics.identify(`anon_${localAnonId}`, {
        email: email,
        // name: `Anon ${localAnonId.slice(-4)}`,
        is_anonymous: false,
      })
      console.log("Local anon email from client cookies", email)
      setHsCustomerEmailClient(email)
    } else {
      const anonymousId = (await analytics.user()).anonymousId()
      const anonId = String(anonymousId)
      setAnonId(anonId)
      const email = `anon_${anonId}@lfu.com`
      console.log("Local anon email from Segment analytics", email)
      setHsCustomerEmailClient(email)
      analytics.identify(`anon_${anonId}`, {
        email: email,
        // name: `Anon ${anonId.slice(-4)}`,
        is_anonymous: false,
      })
      createHsCustomer(email)
    }
  }

  const utmTracker = () => {
    const traits: Record<string, string> = {}
    const utmParams = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "fbclid",
    ]
    utmParams.forEach((param) => {
      const paramValue = localStorage.getItem(param)
      if (paramValue) {
        traits[param] = paramValue
      } else {
        const value = searchParams.get(param)
        if (value) {
          localStorage.setItem(param, value)
          traits[param] = value
        }
      }
    })
    return traits
  }

  useEffect(() => {
    if (customer) {
      setHsCustomerEmailClient(customer.email)
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
    const traits = utmTracker()
    if (pathname) {
      analytics.page(documentTitle, {
        pageName: document.title,
        page_url: pathname,
        context: {
          campaign: Object.keys(traits).length > 0 ? traits : null,
        },
      })
    }
    getHsCustomerEmail()
  }, [pathname])

  return null
}

export default PageTracker
