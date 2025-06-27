"use client"

import { clx } from "@medusajs/ui"
import { ArrowRightOnRectangle } from "@medusajs/icons"
import { useParams, usePathname } from "next/navigation"

import ChevronDown from "@modules/common/icons/chevron-down"
import User from "@modules/common/icons/user"
import MapPin from "@modules/common/icons/map-pin"
import Package from "@modules/common/icons/package"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { signout } from "@lib/data/customer"
import { Tabs, TabsList, TabsTrigger } from "@modules/common/components/ui/tabs"
import { TranslatedText } from "@modules/common/components/translation/translated-text"

const AccountNav = ({
  customer,
}: {
  customer: HttpTypes.StoreCustomer | null
}) => {
  const route = usePathname()
  const { countryCode } = useParams() as { countryCode: string }

  const handleLogout = async () => {
    await signout(countryCode)
  }

  return (
    <div>
      <div className="small:hidden" data-testid="mobile-account-nav">
        {route !== `/${countryCode}/account` ? (
          <LocalizedClientLink
            href="/account"
            className="flex items-center gap-x-2 text-small-regular py-2"
            data-testid="account-main-link"
          >
            <>
              <ChevronDown className="transform rotate-90" />
              <span>
                <TranslatedText text="Account" />
              </span>
            </>
          </LocalizedClientLink>
        ) : (
          <>
            <div className="text-xl-semi mb-4 px-8">
              Hello {customer?.first_name && <TranslatedText text={customer.first_name} />} 
            </div>
            <div className="text-base-regular">
              <ul>
                <li>
                  <LocalizedClientLink
                    href="/account/profile"
                    className="flex items-center justify-between py-4 border-b border-gray-200 px-8"
                    data-testid="profile-link"
                  >
                    <>
                      <div className="flex items-center gap-x-2">
                        <User size={20} />
                        <span>Profile</span>
                      </div>
                      <ChevronDown className="transform -rotate-90" />
                    </>
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/account/addresses"
                    className="flex items-center justify-between py-4 border-b border-gray-200 px-8"
                    data-testid="addresses-link"
                  >
                    <>
                      <div className="flex items-center gap-x-2">
                        <MapPin size={20} />
                        <span>Addresses</span>
                      </div>
                      <ChevronDown className="transform -rotate-90" />
                    </>
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/account/orders"
                    className="flex items-center justify-between py-4 border-b border-gray-200 px-8"
                    data-testid="orders-link"
                  >
                    <div className="flex items-center gap-x-2">
                      <Package size={20} />
                      <span>Orders</span>
                    </div>
                    <ChevronDown className="transform -rotate-90" />
                  </LocalizedClientLink>
                </li>
                <li>
                  <button
                    type="button"
                    className="flex items-center justify-between py-4 border-b border-gray-200 px-8 w-full"
                    onClick={handleLogout}
                    data-testid="logout-button"
                  >
                    <div className="flex items-center gap-x-2">
                      <ArrowRightOnRectangle />
                      <span>Log out</span>
                    </div>
                    <ChevronDown className="transform -rotate-90" />
                  </button>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
      <div className="hidden small:block" data-testid="account-nav">
        <div>
          <div className="m-8">
            <h1 className="text-3xl font-bold">
              <TranslatedText text="My Account" />
            </h1>
          </div>
          <Tabs defaultValue={"overview"}>
            <TabsList>
              <AccountNavLink
                href="/account"
                route={route!}
                data-testid="overview-link"
              >
                <TabsTrigger
                  value="overview"
                  className={clx(
                    "text-ui-fg-subtle hover:text-ui-fg-base",
                    "data-[state=active]:text-ui-fg-base data-[state=active]:font-semibold data-[state=active]:bg-[rgb(221,242,71)]"
                  )}
                >
                  <TranslatedText text="Overview" />
                </TabsTrigger>
              </AccountNavLink>
              <AccountNavLink
                href="/account/profile"
                route={route!}
                data-testid="profile-link"
              >
                <TabsTrigger
                  value="profile"
                  className={clx(
                    "text-ui-fg-subtle hover:text-ui-fg-base",
                    "data-[state=active]:text-ui-fg-base data-[state=active]:font-semibold data-[state=active]:bg-[rgb(221,242,71)]"
                  )}
                >
                   <TranslatedText text="Profile" />                 
                </TabsTrigger>
              </AccountNavLink>
              <AccountNavLink
                href="/account/addresses"
                route={route!}
                data-testid="addresses-link"
              >
                <TabsTrigger
                  value="addresses"
                  className={clx(
                    "text-ui-fg-subtle hover:text-ui-fg-base",
                    "data-[state=active]:text-ui-fg-base data-[state=active]:font-semibold data-[state=active]:bg-[rgb(221,242,71)]"
                  )}
                >
                   <TranslatedText text="Addresses" />
                </TabsTrigger>
              </AccountNavLink>
              <AccountNavLink
                href="/account/orders"
                route={route!}
                data-testid="orders-link"
              >
                <TabsTrigger
                  value="orders"
                  className={clx(
                    "text-ui-fg-subtle hover:text-ui-fg-base",
                    "data-[state=active]:text-ui-fg-base data-[state=active]:font-semibold data-[state=active]:bg-[rgb(221,242,71)]"
                  )}
                >
                  <TranslatedText text="Orders" />
                </TabsTrigger>
              </AccountNavLink>

              <TabsTrigger
                value="wishlist"
                className={clx(
                  "text-ui-fg-subtle hover:text-ui-fg-base",
                  "data-[state=active]:text-ui-fg-base data-[state=active]:font-semibold data-[state=active]:bg-[rgb(221,242,71)]"
                )}
              >
                <TranslatedText text="Wishlist" />
              </TabsTrigger>
              <div onClick={handleLogout} data-testid="logout-button">
                <TabsTrigger value="orders">
                  <TranslatedText text="Log out" />
                </TabsTrigger>
              </div>
            </TabsList>
          </Tabs>
          <div className="text-base-regular">
            <ul className="flex mb-0 justify-start items-start flex-col gap-y-4"></ul>
          </div>
        </div>
      </div>
    </div>
  )
}

type AccountNavLinkProps = {
  href: string
  route: string
  children: React.ReactNode
  "data-testid"?: string
}

const AccountNavLink = ({
  href,
  route,
  children,
  "data-testid": dataTestId,
}: AccountNavLinkProps) => {
  const { countryCode }: { countryCode: string } = useParams()

  const active = route.split(countryCode)[1] === href
  return (
    <LocalizedClientLink href={href} data-testid={dataTestId}>
      {children}
    </LocalizedClientLink>
  )
}

export default AccountNav
