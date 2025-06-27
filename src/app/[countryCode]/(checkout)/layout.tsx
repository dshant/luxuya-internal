import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"
import Logo from "@modules/common/icons/Logo"
import SecureIcon from "../../../../public/icon/svg-icons/SecureIcon"


export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full bg-white relative small:min-h-screen">
      <div className="h-16 bg-white border-b ">
        <nav className="flex h-full items-center content-container !max-w-[1480px] w-full">
          <LocalizedClientLink
            href="/cart"
            className="basis:1/3 flex-1 text-small-semi text-ui-fg-base flex items-center gap-x-2 uppercase basis-0"
            data-testid="back-to-cart-link"
          >
            <ChevronDown className="rotate-90" size={16} />
            <span className="mt-px hidden small:block txt-compact-plus text-ui-fg-subtle hover:text-ui-fg-base ">
              Back to cart
            </span>
            <span className="mt-px lg:hidden txt-compact-plus text-ui-fg-subtle hover:text-ui-fg-base">
              Back
            </span>
          </LocalizedClientLink>
          {/* <LocalizedClientLink
            href="/"
            className="pl-2 md:pl-0 basis:1/3 md:flex-1 txt-compact-xlarge-plus text-ui-fg-subtle hover:text-ui-fg-base uppercase"
            data-testid="store-link"
          > */}
          <div className="pl-2 md:pl-0 basis:1/3 flex-1 txt-compact-xlarge-plus text-ui-fg-subtle hover:text-ui-fg-base uppercase hidden md:block">
            <Logo />
          </div>
          {/* <div className="basis:1/3 flex-1 lg:hidden"></div> */}
          {/* </LocalizedClientLink> */}
          <div className="basis:1/3 flex-1">
            <div className="flex justify-end items-center gap-1 txt-compact-plus text-ui-fg-subtle hover:text-ui-fg-base">
              <SecureIcon />
              <span className="text-xs md:text-lg">Secure Payment</span>
            </div>
          </div>
        </nav>
      </div>
      <div className="relative" data-testid="checkout-container">
        {children}
      </div>
    </div>
  )
}
