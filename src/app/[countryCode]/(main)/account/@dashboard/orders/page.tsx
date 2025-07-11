import { Metadata } from "next"

import OrderOverview from "@modules/account/components/order-overview"
import { notFound } from "next/navigation"
import { listOrders } from "@lib/data/orders"
import Divider from "@modules/common/components/divider"
import TransferRequestForm from "@modules/account/components/transfer-request-form"
import { TranslatedTextServer } from "@modules/common/components/translation/translatest-text-server"

export const metadata: Metadata = {
  title: "Orders",
  description: "Overview of your previous orders.",
  robots: {
    index: true,
    follow: true,
  },
}

export default async function Orders() {
  const orders = await listOrders()

  if (!orders) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="orders-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">
          <TranslatedTextServer text="Orders" />
        </h1>
        <p className="text-base-regular">
         <TranslatedTextServer text=" View your previous orders and their status. You can also create
          returns or exchanges for your orders if needed." />
        </p>
      </div>
      <div>
        <OrderOverview orders={orders} />
        <Divider className="my-16" />
        <TransferRequestForm />
      </div>
    </div>
  )
}
