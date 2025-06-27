"use client"; 

import { useEffect } from "react";
import { analytics } from "@lib/context/segment";

export type UserTrackerProps = {
  customer: {
    id: string
    email: string
    first_name: string | null
    last_name: string | null
  }
}

export default function UserTracker({ customer }: UserTrackerProps) {
  useEffect(() => {
    if (customer) {
      analytics.identify(customer.id, {
        email: customer.email,
        name:
          customer.first_name && customer.last_name
            ? `${customer.first_name} ${customer.last_name}`
            : "",
      })
    }
  }, [customer])

  return null
}
