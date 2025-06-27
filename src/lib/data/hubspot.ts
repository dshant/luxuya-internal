import { StoreCart } from "@medusajs/types"
import {
  getHsCartIdClient,
  getHsCustomerEmail,
  getHsCustomerId,
  setHsCartIdClient,
  setHsCustomerId,
} from "./cookies-client"

const fetchHsCustomer = async (hsCustomerEmail: string) => {
  const response = await fetch("/api/hubspot/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: hsCustomerEmail,
    }),
  })

  const hsCustomer = await response.json()

  if (response.ok) {
    return hsCustomer
  }
}

export const createHsCustomer = async (hsCustomerEmail: string) => {
  const response = await fetch("/api/hubspot/contact/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: hsCustomerEmail,
    }),
  })

  const hsCustomer = await response.json()

  if (response.ok) {
    console.log("Created new HS Customer", hsCustomer.id)
    setHsCustomerId(hsCustomer.id)
    return hsCustomer
  }
}

export const updateHsCustomer = async (contactId: string, newEmail: string) => {
  const response = await fetch("/api/hubspot/contact/update", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contactId,
      newEmail,
    }),
  })

  const hsCustomer = await response.json()

  if (response.ok) {
    console.log("Updated HS Customer")
    return hsCustomer
  }
}

const createHsCart = async (cart: StoreCart, customerId: string) => {
  const response = await fetch("/api/hubspot/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cartName: cart.id,
      cartId: cart.id,
      discount: cart.discount_total,
      currency: cart.currency_code?.toUpperCase(),
      totalPrice: cart.total,
      associateToId: customerId,
      cartStatus: "Unpaid",
    }),
  })
  const hsCart = await response.json()

  if (response.ok) {
    return hsCart
  }
}

const updateHsCart = async (hsCartId: string, cart: StoreCart) => {
  const response = await fetch("/api/hubspot/cart", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      hsCartId: hsCartId,
      discount: cart?.discount_total,
      totalPrice: cart?.total,
      cartStatus: "Unpaid",
    }),
  })
  const hsCart = await response.json()

  if (response.ok) {
    return hsCart
  }
}

export const updateHsCartToPaid = async () => {
  const hsCartId = getHsCartIdClient()
  if (hsCartId) {
    const response = await fetch("/api/hubspot/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hsCartId: hsCartId,
        cartStatus: "Paid",
      }),
    })
    const hsCart = await response.json()

    if (response.ok) {
      return hsCart
    }
  }
}

export const createOrUpdateHsCart = async (
  cart: StoreCart,
  cartStatus?: string
) => {
  const hsCustomerId = getHsCustomerId()
  console.log("HS Customer Id", hsCustomerId, cart)
  if (cart) {
    let email
    if (cart.email) {
      email = cart.email
      if (hsCustomerId) updateHsCustomer(hsCustomerId, cart.email)
    } else {
      email = getHsCustomerEmail()
    }

    console.log("HS Email", email)

    if (email) {
      const hsCartId = getHsCartIdClient()
      console.log("HS Cart Id", hsCartId)
      if (hsCartId) {
        console.log("Updating HS Cart")
        await updateHsCart(hsCartId, cart)
      } else {
        const customer = await fetchHsCustomer(email)
        if (customer && customer.id) {
          console.log("Creating HS Cart")
          const hsCart = await createHsCart(cart, customer.id)
          setHsCartIdClient(hsCart.id)
        }
      }
    }
  }
}
