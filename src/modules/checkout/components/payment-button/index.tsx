"use client"

import { isManual, isMyFatoorah, isStripe } from "@lib/constants"
import { placeOrder } from "@lib/data/cart"
import { HttpTypes, StoreCart } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import { analytics } from "@lib/context/segment"
import React, { useState } from "react"
import ErrorMessage from "../error-message"

type PaymentButtonProps = {
  cart: HttpTypes.StoreCart
  "data-testid": string
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  cart,
  "data-testid": dataTestId,
}) => {
  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    (cart.shipping_methods?.length ?? 0) < 1

  const paymentSession = cart.payment_collection?.payment_sessions?.[0]

  switch (true) {
    case isStripe(paymentSession?.provider_id):
      return (
        <StripePaymentButton
          notReady={notReady}
          cart={cart}
          data-testid={dataTestId}
        />
      )
    case isManual(paymentSession?.provider_id):
      return (
        <ManualTestPaymentButton
          notReady={notReady}
          data-testid={dataTestId}
          cart={cart}
        />
      )
    case isMyFatoorah(paymentSession?.provider_id):
      return (
        <MyFatoorrahPaymentButton
          notReady={notReady}
          payment_session={paymentSession}
          data-testid={dataTestId}
          cart={cart}
        />
      )
    default:
      return <Button disabled>Select a payment method</Button>
  }
}

const StripePaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    setSubmitting(true)
    setErrorMessage(null)

    // await placeOrder()
    //   .then(() => {
    //     // analytics.track("Purchase Completed", {
    //     //   userId: cart.customer_id,
    //     //   email: cart.email,
    //     //   totalValue: cart.total,
    //     //   currency: cart.currency_code,
    //     //   items: cart.items && cart.items.map((item) => ({
    //     //     productId: item.id,
    //     //     name: item.title,
    //     //     price: item.unit_price,
    //     //     quantity: item.quantity,
    //     //   })),
    //     //   paymentMethod: cart.payment_collection?.payment_sessions?.[0]?.provider_id || "Unknown",
    //     // });
    //   })
    //   .catch((err) => {
    //     setErrorMessage(err.message);
    //   })
    //   .finally(() => {
    //     setSubmitting(false);
    //   });
  }

  const stripe = useStripe()
  const elements = useElements()
  const card = elements?.getElement("card")

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

  const disabled = !stripe || !elements ? true : false

  const handlePayment = async () => {
    setSubmitting(true)

    if (!stripe || !elements || !card || !cart) {
      setSubmitting(false)
      return
    }

    await stripe
      .confirmCardPayment(session?.data.client_secret as string, {
        payment_method: {
          card: card,
          billing_details: {
            name:
              cart.billing_address?.first_name +
              " " +
              cart.billing_address?.last_name,
            address: {
              city: cart.billing_address?.city ?? undefined,
              country: cart.billing_address?.country_code ?? undefined,
              line1: cart.billing_address?.address_1 ?? undefined,
              line2: cart.billing_address?.address_2 ?? undefined,
              postal_code: cart.billing_address?.postal_code ?? undefined,
              state: cart.billing_address?.province ?? undefined,
            },
            email: cart.email,
            phone: cart.billing_address?.phone ?? undefined,
          },
        },
      })
      .then(({ error, paymentIntent }) => {
        if (error) {
          const pi = error.payment_intent

          if (
            (pi && pi.status === "requires_capture") ||
            (pi && pi.status === "succeeded")
          ) {
            onPaymentCompleted()
          }

          setErrorMessage(error.message || null)
          return
        }

        if (
          (paymentIntent && paymentIntent.status === "requires_capture") ||
          paymentIntent.status === "succeeded"
        ) {
          return onPaymentCompleted()
        }

        return
      })
  }

  return (
    <>
      <Button
        disabled={disabled || notReady}
        onClick={handlePayment}
        size="large"
        isLoading={submitting}
        data-testid={dataTestId}
      >
        Place order
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="stripe-payment-error-message"
      />
    </>
  )
}

const ManualTestPaymentButton = ({
  notReady,
  cart,
}: {
  notReady: boolean
  cart: StoreCart
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .then(() => {
        // analytics.track("Purchase Completed", {
        //   userId: cart.customer_id,
        //   email: cart.email,
        //   totalValue: cart.total,
        //   currency: cart.currency_code,
        //   paymentStatus:cart.payment_collection?.status,
        //   items: cart.items && cart.items.map((item) => ({
        //     productId: item.id,
        //     name: item.title,
        //     price: item.unit_price,
        //     quantity: item.quantity,
        //   })),
        //   paymentMethod: cart.payment_collection?.payment_sessions?.[0]?.provider_id || "Unknown",
        // });
      })
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const handlePayment = () => {
    setSubmitting(true)

    onPaymentCompleted()
  }

  return (
    <>
      <Button
        disabled={notReady}
        isLoading={submitting}
        onClick={handlePayment}
        size="large"
        data-testid="submit-order-button"
      >
        Place order
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="manual-payment-error-message"
      />
    </>
  )
}

const MyFatoorrahPaymentButton = ({
  payment_session,
  notReady,
  "data-testid": dataTestId,
  cart,
}: {
  payment_session: HttpTypes.StorePaymentSession | undefined
  notReady: boolean
  "data-testid"?: string
  cart: StoreCart
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    // await placeOrder().then(() => {
    //   // analytics.track("Purchase Completed", {
    //   //   userId: cart.customer_id,
    //   //   email: cart.email,
    //   //   totalValue: cart.total,
    //   //   currency: cart.currency_code,
    //   //   items: cart.items && cart.items.map((item) => ({
    //   //     productId: item.id,
    //   //     name: item.title,
    //   //     price: item.unit_price,
    //   //     quantity: item.quantity,
    //   //   })),
    //   //   paymentMethod: cart.payment_collection?.payment_sessions?.[0]?.provider_id || "Unknown",
    //   // });
    // })
    //   .catch((err) => {
    //     setErrorMessage(err.message)
    //   })
    //   .finally(() => {
    //     setSubmitting(false)
    //   })
  }

  const handlePayment = () => {
    setSubmitting(true)
    onPaymentCompleted()
  }

  return (
    <>
      <a href={payment_session?.data?.Data?.InvoiceURL}>
        <Button
          disabled={notReady}
          isLoading={submitting}
          size="large"
          data-testid="complete-payment-button"
        >
          Complete Payment
        </Button>
      </a>
      <ErrorMessage
        error={errorMessage}
        data-testid="myfatoorah-payment-error-message"
      />
    </>
  )
}

export default PaymentButton
