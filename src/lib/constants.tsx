import React from "react"
import { CreditCard } from "@medusajs/icons"

import Ideal from "@modules/common/icons/ideal"
import Bancontact from "@modules/common/icons/bancontact"
import PayPal from "@modules/common/icons/paypal"
import MyFatoorah from "@modules/common/icons/my-fatoorah"

/* Map of payment provider_id to their title and icon. Add in any payment providers you want to use. */
export const paymentInfoMap: Record<
  string,
  { title: string; icon: React.JSX.Element }
> = {
  pp_stripe_stripe: {
    title: "Credit card",
    icon: <CreditCard />,
  },
  "pp_stripe-ideal_stripe": {
    title: "iDeal",
    icon: <Ideal />,
  },
  "pp_stripe-bancontact_stripe": {
    title: "Bancontact",
    icon: <Bancontact />,
  },
  pp_paypal_paypal: {
    title: "PayPal",
    icon: <PayPal />,
  },
  pp_system_default: {
    title: "Manual Payment",
    icon: <CreditCard />,
  },
  "pp_MyFatoorah_my-fatoorah": {
    title: "MyFatoorah",
    icon: <MyFatoorah />,
  },
  pp_cashfree_cashfree: {
    title: "Cashfree",
    icon: <CreditCard />,
  },
  // Add more payment providers here
}

// This only checks if it is native stripe for card payments, it ignores the other stripe-based providers
export const isStripe = (providerId?: string) => {
  return providerId?.startsWith("pp_stripe_")
}
export const isPaypal = (providerId?: string) => {
  return providerId?.startsWith("pp_paypal")
}
export const isManual = (providerId?: string) => {
  return providerId?.startsWith("pp_system_default")
}
export const isMyFatoorah = (providerId?: string) => {
  return providerId?.startsWith("pp_MyFatoorah_my-fatoorah")
}

// Add currencies that don't need to be divided by 100
export const noDivisionCurrencies = [
  "krw",
  "jpy",
  "vnd",
  "clp",
  "pyg",
  "xaf",
  "xof",
  "bif",
  "djf",
  "gnf",
  "kmf",
  "mga",
  "rwf",
  "xpf",
  "htg",
  "vuv",
  "xag",
  "xdr",
  "xau",
]

export const KidsCategoryHandle = [
  {
    productName: "Dolce & Gabbana",
    link: "/categories/kids?brand=Dolce+%26+Gabbana",
  },
  {
    productName: "Fendi Kids",
    link: "/categories/kids?brand=FENDI+KIDS",
  },
  {
    productName: "Kenzo Kids",
    link: "/categories/kids?brand=KENZO+KIDS",
  },
  {
    productName: "Moncler Enfant",
    link: "/categories/kids?brand=MONCLER+ENFANT",
  },
]
