"use client"

import {
  Badge,
  Heading,
  Input,
  Label,
  Text,
  toast,
  Tooltip,
} from "@medusajs/ui"
import React, { useActionState, useEffect, useState } from "react"

import { applyPromotions, submitPromotionForm } from "@lib/data/cart"
import { convertToLocale } from "@lib/util/money"
import { InformationCircleSolid } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import Trash from "@modules/common/icons/trash"
import ErrorMessage from "../error-message"
import { SubmitButton } from "../submit-button"
import { TranslatedText } from "@modules/common/components/translation/translated-text"

type DiscountCodeProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

const DiscountCode: React.FC<DiscountCodeProps> = ({ cart }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [hasTriedAddingPromotion, setHasTriedAddingPromotion] = useState(false);


  const { items = [], promotions = [] } = cart
  const removePromotionCode = async (code: string) => {
    const validPromotions = promotions.filter(
      (promotion) => promotion.code !== code
    )

    await applyPromotions(
      validPromotions.filter((p) => p.code === undefined).map((p) => p.code!)
    )
  }

  const addPromotionCode = async (formData: FormData) => {

    const code = formData.get("code")
    if (!code) {
      return
    }
    setHasTriedAddingPromotion(true);
    const input = document.getElementById("promotion-input") as HTMLInputElement
    const codes = promotions
      .filter((p) => p.code === undefined)
      .map((p) => p.code!)
    codes.push(code.toString())

    await applyPromotions(codes)

    // if (input) {
    //   input.value = ""
    // }
  }
  useEffect(() => {
    if (hasTriedAddingPromotion && promotions.length === 0) {
      setErrorMessage("Invalid Code");
    } else {
      setErrorMessage(null);
    }
  }, [promotions, hasTriedAddingPromotion]);

  const [message, formAction] = useActionState(submitPromotionForm, null)

  return (
    <div className="w-full bg-white flex flex-col">
      <div className="txt-medium">
        <form action={(a) => addPromotionCode(a)} className="w-full mb-5">
          <Label className="flex gap-x-1 my-2 items-center">
            {/* <button
              onClick={() =>{
                setIsOpen(!isOpen)
                setErrorMessage(null)
              }
                 }

              type="button"
              className="txt-medium text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              data-testid="add-discount-button"
            >
              <TranslatedText text="Add Promotion Code(s)" />
            </button> */}

            {/* <Tooltip content="You can add multiple promotion codes">
              <InformationCircleSolid color="var(--fg-muted)" />
            </Tooltip> */}
          </Label>

          <text className="txt-large">Promo Code</text>
          <div className="flex gap-2 w-full mt-2">
            <div className="size-full">
              <Input
                className="flex-1 basis-3/4 h-10"
                id="promotion-input"
                name="code"
                type="text"
                autoFocus={false}
                data-testid="discount-input"
              />
            </div>
            <SubmitButton
              className="basis-1/4"
              variant="secondary"
              data-testid="discount-apply-button"
            >
              <TranslatedText text="Apply" />
            </SubmitButton>
          </div>

          <ErrorMessage
            error={message}
            data-testid="discount-error-message"
          />
        </form>

        {errorMessage && (
          <h4 className="text-red-500 text-sm mt-3"><TranslatedText text={errorMessage} /></h4>
        )}

        {promotions.length > 0 && (
          <div className="w-full flex items-center">
            <div className="flex flex-col w-full">
              <Heading className="txt-medium mb-2">
                Promotion(s) applied:
              </Heading>

              {promotions.map((promotion) => {
                return (
                  <div
                    key={promotion.id}
                    className="flex items-center justify-between w-full max-w-full mb-2"
                    data-testid="discount-row"
                  >
                    <Text className="flex gap-x-1 items-baseline txt-small-plus w-4/5 pr-1">
                      <span className="truncate" data-testid="discount-code">
                        <Badge
                          color={promotion.is_automatic ? "green" : "grey"}
                          size="small"
                        >
                          {promotion.code}
                        </Badge>{" "}
                        (
                        {promotion.application_method?.value !== undefined &&
                          promotion.application_method.currency_code !==
                          undefined && (
                            <>
                              {promotion.application_method.type ===
                                "percentage"
                                ? `${promotion.application_method.value}%`
                                : convertToLocale({
                                  amount: Number(promotion.application_method.value),
                                  currency_code:
                                    promotion.application_method
                                      .currency_code,
                                })}
                            </>
                          )}
                        )
                        {/* {promotion.is_automatic && (
                          <Tooltip content="This promotion is automatically applied">
                            <InformationCircleSolid className="inline text-zinc-400" />
                          </Tooltip>
                        )} */}
                      </span>
                    </Text>
                    {!promotion.is_automatic && (
                      <button
                        className="flex items-center"
                        onClick={() => {
                          if (!promotion.code) {
                            return
                          }

                          setHasTriedAddingPromotion(false)

                          removePromotionCode(promotion.code)
                        }}
                        data-testid="remove-discount-button"
                      >
                        <Trash size={14} />
                        <span className="sr-only">
                          <TranslatedText text="Remove discount code from order" />
                        </span>
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DiscountCode
