"use client"

import { Dialog, Transition } from "@headlessui/react"
import { TranslatedText } from "@modules/common/components/translation/translated-text"
import { Separator } from "@modules/common/components/ui/separator"
import { BadgeCheck, X } from "lucide-react"
import Link from "next/link"
import React, { Fragment } from "react"

type PriceModalProps = {
  showPriceModal: boolean
  setShowPriceModal: (value: boolean) => void
}

const PriceOfferModal: React.FC<PriceModalProps> = ({
  showPriceModal,
  setShowPriceModal,
}) => {
  return (
    <Transition appear show={showPriceModal} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-[75]"
        onClose={() => setShowPriceModal(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-700 bg-opacity-75 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed bottom-0 inset-x-0">
          <div className="flex min-h-full h-full items-center justify-center text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Panel
                className="w-full h-full transform overflow-hidden text-left flex flex-col gap-y-3"
                data-testid="mobile-actions-modal"
              >
                <div className="bg-white px-6 py-12 text-center flex flex-col justify-center items-center gap-2">
                  <div className="w-full flex justify-end absolute right-0 top-0">
                    <button
                      onClick={() => setShowPriceModal(false)}
                      className="bg-white w-12 h-12 rounded-full text-ui-fg-base flex justify-center items-center"
                      data-testid="close-modal-button"
                    >
                      <X />
                    </button>
                  </div>
                  <BadgeCheck size={30} color="green" />
                  <h3 className="text-2xl font-normal my-2">
                    <TranslatedText text="Our Price Match" />
                  </h3>
                  <h4 className="text-lg uppercase text-red-500 mb-2">
                    <TranslatedText text=" YOUR BEST BUY. EVERY TIME." />
                  </h4>
                  <p>
                    <TranslatedText
                      text="If your item is priced lower elsewhere, we will refund you
                    the difference in Luxury for you store credit."
                    />
                  </p>
                  <Separator />
                  <h5 className="mt-2">
                    <TranslatedText text="Already made your purchase?" />
                  </h5>
                  <p>
                    <TranslatedText
                      text="Don't worry! Our Customer Care team will ensure you get the
                    price difference in store credit."
                    />
                  </p>
                  <Link href="/contact" className="underline font-medium mb-4">
                    <TranslatedText text="Contact Us" />
                  </Link>
                  <Separator />
                  <p className="mt-4">
                    <TranslatedText text="Please see" />{" "}
                    <Link
                      href="/policies/terms-and-conditions"
                      className="underline font-medium"
                    >
                      <TranslatedText text="Terms &amp; Conditions" />
                    </Link>{" "}
                    <TranslatedText text="for further details" />
                  </p>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default PriceOfferModal
