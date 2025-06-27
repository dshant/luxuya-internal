import { Suspense, useEffect, useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import MobileMenu from "@modules/layout/components/new-side-menu"
import Logo from "@modules/common/icons/Logo"
import { User, SearchIcon } from "lucide-react"
import Link from "next/link"
import { Separator } from "@modules/common/components/ui/separator"
import SubNavbar from "@modules/common/components/sub-navbar/page"
import { getCategories } from "@lib/data/categories"
import WishlistPopover from "@modules/common/wishlist/wishListPopver"
import { wishListItems } from "@lib/data/wishlist"
import { HttpTypes } from "@medusajs/types"
import CatagoryNav from "@modules/common/components/catagory-nav"
import SearchPopOver from "@modules/layout/components/SearchPopOver/SearchPopOver"
import ProfilePopOver from "@modules/layout/components/ProfilePopOver/ProfilePopOver"
import { retrieveCustomer } from "@lib/data/customer"
import AuthModal from "@modules/account/components/auth-modal/auth-modal"
import { MyAccountNavButton } from "./my-account-button-nav"
import { TranslatedTextServer } from "@modules/common/components/translation/translatest-text-server"
export interface ProductVariant {
  id: string
  title: string
  product: HttpTypes.StoreProduct
}

export interface WishlistItem {
  id: string
  product_variant_id: string
  wishlist_id: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  product_variant: ProductVariant
  stocked_quantity?: number
}

export interface Wishlist {
  id: string
  customer_id: string
  sales_channel_id: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  items: WishlistItem[]
}

export default async function Nav() {
  const categoriesData = await getCategories()

  const wishlist: Wishlist = await wishListItems()

  const customer = await retrieveCustomer().catch(() => null)

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-16 mx-auto duration-200 bg-white border-ui-border-base">
        <nav className="content-container relative txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular">
          <div className="flex lg:hidden items-center justify-between">
            <Suspense fallback={<div></div>}>
              <MobileMenu categoriesData={categoriesData} />
            </Suspense>
          </div>
          <div className="lg:hidden flex justify-center absolute left-1/2 -translate-x-1/2">
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus hover:text-ui-fg-base uppercase"
              data-testid="nav-store-link"
            >
              <Logo />
            </LocalizedClientLink>
          </div>
          <div className="hidden lg:flex items-center h-full gap-2 w-full">
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus hover:text-ui-fg-base uppercase"
              data-testid="nav-store-link"
            >
              <Logo />
            </LocalizedClientLink>
            <div className="flex items-center justify-center flex-1">
              <Suspense fallback={<div></div>}>
                <SubNavbar categoriesData={categoriesData} />
              </Suspense>
            </div>
          </div>
          <div className="flex items-center gap-x-3 h-full justify-end">
            <div className="hidden items-center gap-x-2 lg:flex">
              <Link
                href="/about"
                className="max-w-[4rem] w-full min-w-fit text-sm text-gray-500 hover:text-gray-900 "
              >
                <TranslatedTextServer text="About" />
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <Link
                href="/help"
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                <TranslatedTextServer text="Help" />
              </Link>
              <Separator orientation="vertical" className="h-6" />
            </div>
            <div className="pl-2 flex items-center gap-x-3 h-full justify-end">
              {process.env.NEXT_PUBLIC_FEATURE_SEARCH_ENABLED && (
                <Suspense
                  fallback={
                    <LocalizedClientLink
                      className="hover:text-ui-fg-base"
                      href="/search"
                      scroll={false}
                      data-testid="nav-search-link"
                    >
                      <SearchIcon size={20} />
                    </LocalizedClientLink>
                  }
                >
                  <SearchPopOver />
                </Suspense>
              )}
              <div className="hidden lg:flex gap-x-3">
                {customer ? (
                  <Suspense
                    fallback={
                      <LocalizedClientLink
                        className="hover:text-ui-fg-base -mt-1"
                        href="/account"
                        data-testid="nav-account-link"
                      ></LocalizedClientLink>
                    }
                  >
                    <ProfilePopOver />
                  </Suspense>
                ) : (
                  <MyAccountNavButton />
                )}

                <Suspense
                  fallback={
                    <LocalizedClientLink
                      className="hover:text-ui-fg-base flex gap-2 my-auto"
                      href="/wishlist"
                      data-testid="nav-cart-link"
                    >
                      <TranslatedTextServer text="WishList " />
                      (0)
                    </LocalizedClientLink>
                  }
                >
                  <WishlistPopover wishlist={wishlist} />
                </Suspense>
              </div>

              <Suspense
                fallback={
                  <LocalizedClientLink
                    className="hover:text-ui-fg-base flex gap-2 my-auto"
                    href="/cart"
                    data-testid="nav-cart-link"
                  >
                    <TranslatedTextServer text="Cart" />
                    (0)
                  </LocalizedClientLink>
                }
              >
                <CartButton />
              </Suspense>

              <div className="hidden lg:flex">
                <CatagoryNav />
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}
