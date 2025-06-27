import { retrieveCustomer } from "@lib/data/customer"
import { Toaster } from "@medusajs/ui"
import AccountAuthGate from "@modules/account/components/auth-modal/account-auth-gate"
import AccountLayout from "@modules/account/templates/account-layout"
import UserTracker from "@modules/products/components/User_login tracker"

export default async function AccountPageLayout({
  dashboard,
  login,
}: {
  dashboard?: React.ReactNode
  login?: React.ReactNode
}) {
  const customer = await retrieveCustomer().catch(() => null)

  return (
    <AccountLayout customer={customer}>
      {customer ? dashboard : <AccountAuthGate />}
      <Toaster />
    </AccountLayout>
  )
}
