import { Metadata } from "next"
import { notFound } from "next/navigation"

import AddressBook from "@modules/account/components/address-book"

import { getRegion } from "@lib/data/regions"
import { retrieveCustomer } from "@lib/data/customer"
import { TranslatedTextServer } from "@modules/common/components/translation/translatest-text-server"

export const metadata: Metadata = {
  title: "Addresses",
  description: "View your addresses",
  robots: {
    index: true,
    follow: true,
  },
}

export default async function Addresses(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  const customer = await retrieveCustomer()
  const region = await getRegion(countryCode)

  if (!customer || !region) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="addresses-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">
          <TranslatedTextServer text="Shipping Addresses" />
        </h1>
        <p className="text-base-regular">
          <TranslatedTextServer text="View and update your shipping addresses, you can add as many as you
          like. Saving your addresses will make them available during checkout." />
        </p>
      </div>
      <AddressBook customer={customer} region={region} />
    </div>
  )
}
