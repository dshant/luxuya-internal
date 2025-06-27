"use client"

import { RadioGroup, Radio } from "@headlessui/react"
import { setShippingMethod } from "@lib/data/cart"
import { calculatePriceForShippingOption } from "@lib/data/fulfillment"
import { convertToLocale } from "@lib/util/money"
import { CheckCircleSolid, Loader } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Button, Heading, Text, clx } from "@medusajs/ui"
import ErrorMessage from "@modules/checkout/components/error-message"
import Divider from "@modules/common/components/divider"
import MedusaRadio from "@modules/common/components/radio"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

type ShippingProps = {
  cart: HttpTypes.StoreCart
  availableShippingMethods: HttpTypes.StoreCartShippingOption[] | null
}

const Shipping: React.FC<ShippingProps> = ({
  cart,
  availableShippingMethods,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPrices, setIsLoadingPrices] = useState(true)
  const [calculatedPricesMap, setCalculatedPricesMap] = useState<
    Record<string, number>
  >({})
  const [error, setError] = useState<string | null>(null)
  const [shippingMethodId, setShippingMethodId] = useState<string | null>(
    cart.shipping_methods?.at(-1)?.shipping_option_id || null
  )

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // useEffect(() => {
  //   setIsLoadingPrices(true)

  //   if (availableShippingMethods?.length) {
  //     const promises = availableShippingMethods
  //       .filter((sm) => sm.price_type === "calculated")
  //       .map((sm) => calculatePriceForShippingOption(sm.id, cart.id))

  //     if (promises.length) {
  //       Promise.allSettled(promises).then((res) => {
  //         const pricesMap: Record<string, number> = {}
  //         res
  //           .filter((r) => r.status === "fulfilled")
  //           .forEach((p) => (pricesMap[p.value?.id || ""] = p.value?.amount!))

  //         setCalculatedPricesMap(pricesMap)
  //         setIsLoadingPrices(false)
  //       })
  //     }
  //   }
  // }, [availableShippingMethods])

  useEffect(() => {
    if (!shippingMethodId && availableShippingMethods?.length) {
      const defaultMethod = availableShippingMethods[0]
      handleSetShippingMethod(defaultMethod.id)
    }
  }, [availableShippingMethods, shippingMethodId])

  // const handleSubmit = () => {
  //   try {
  //     //@ts-ignore
  //     window.gtag("event", "add_shipping_info", {
  //       currency: cart.currency_code.toUpperCase(),
  //       value: cart.total,
  //       shipping_tier: shippingMethodId,
  //       items: cart.items?.map((item) => ({
  //         item_id: item.product_title || item.id,
  //         item_group_id: item.product_id,
  //         item_name: item.variant_id || item.title,
  //         price: item.unit_price,
  //         quantity: item.quantity,
  //       })),
  //     })
  //   } catch (err) {
  //     console.log("GTAG Error:", err)
  //   }
  // }

  const handleSetShippingMethod = async (id: string) => {
    setError(null)
    let currentId: string | null = null
    setIsLoading(true)
    setShippingMethodId((prev) => {
      currentId = prev
      return id
    })

    await setShippingMethod({ cartId: cart.id, shippingMethodId: id })
      .catch((err) => {
        setShippingMethodId(currentId)
        setError(err.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    setError(null)
  }, [])

  return (
    // <div className="bg-white">
    //   <div className="flex flex-row items-center justify-between mb-6">
    //   </div>
    //   <div data-testid="delivery-options-container">
    //     <div className="pb-8">
    //       <RadioGroup
    //         value={shippingMethodId}
    //         onChange={handleSetShippingMethod}
    //       >
    //         {availableShippingMethods?.map((option) => {
    //           const isDisabled =
    //             option.price_type === "calculated" &&
    //             !isLoadingPrices &&
    //             typeof calculatedPricesMap[option.id] !== "number"

    //           return (
    //             <Radio
    //               key={option.id}
    //               value={option.id}
    //               data-testid="delivery-option-radio"
    //               disabled={isDisabled}
    //               className={clx(
    //                 "flex items-center justify-between text-small-regular cursor-pointer py-4 border rounded-rounded px-8 mb-2 hover:shadow-borders-interactive-with-active",
    //                 {
    //                   "border-ui-border-interactive":
    //                     option.id === shippingMethodId,
    //                   "hover:shadow-brders-none cursor-not-allowed":
    //                     isDisabled,
    //                 }
    //               )}
    //             >
    //               <div className="flex items-center gap-x-4">
    //                 <MedusaRadio checked={option.id === shippingMethodId} />
    //                 <span className="text-base-regular">{option.name}</span>
    //               </div>
    //               <span className="justify-self-end text-ui-fg-base">
    //                 {option.price_type === "flat" ? (
    //                   convertToLocale({
    //                     amount: option.amount!,
    //                     currency_code: cart?.currency_code,
    //                   })
    //                 ) : calculatedPricesMap[option.id] ? (
    //                   convertToLocale({
    //                     amount: calculatedPricesMap[option.id],
    //                     currency_code: cart?.currency_code,
    //                   })
    //                 ) : isLoadingPrices ? (
    //                   <Loader />
    //                 ) : (
    //                   "-"
    //                 )}
    //               </span>
    //             </Radio>
    //           )
    //         })}
    //       </RadioGroup>
    //     </div>

    //     <ErrorMessage
    //       error={error}
    //       data-testid="delivery-option-error-message"
    //     />

    //     {/* <Button
    //       size="large"
    //       className="mt-6"
    //       onClick={handleSubmit}
    //       isLoading={isLoading}
    //       disabled={!cart.shipping_methods?.[0]}
    //       data-testid="submit-delivery-option-button"
    //     >
    //       Continue to payment
    //     </Button> */}
    //   </div>
    //   <Divider className="mt-8" />
    // </div>
    <></>
  )
}

export default Shipping
