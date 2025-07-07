import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import EmptyCartMessage from "@modules/cart/components/empty-cart-message"
import CartTemplate from "@modules/cart/templates"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cart",
  description: "View your cart",
  robots: {
    index: true,
    follow: true,
  },
}

export default async function Cart() {
  const cart = await retrieveCart()
  const customer = await retrieveCustomer()

  if (!cart) {
    return <EmptyCartMessage />
  }

  return <CartTemplate cart={cart} customer={customer} />
}
