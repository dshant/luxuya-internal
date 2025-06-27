"use client"

import React, { Fragment } from "react"
import Link from "next/link"
import { Mail, Phone, X } from "lucide-react"
import { Dialog, Transition } from "@headlessui/react"
import WhatsappIcon from "@modules/common/icons/whatsapp-icon"
import { TranslatedText } from "@modules/common/components/translation/translated-text"

type HelpModalProps = {
  showHelpModal: boolean
  setShowHelpModal: (value: boolean) => void
}

const HelpModal: React.FC<HelpModalProps> = ({
  showHelpModal,
  setShowHelpModal,
}) => {
  return (
    <Transition appear show={showHelpModal} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-[75]"
        onClose={() => setShowHelpModal(false)}
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
                <div className="bg-white px-6 py-12">
                  <div className="w-full flex justify-end absolute right-0 top-0">
                    <button
                      onClick={() => setShowHelpModal(false)}
                      className="bg-white w-12 h-12 rounded-full text-ui-fg-base flex justify-center items-center"
                      data-testid="close-modal-button"
                    >
                      <X />
                    </button>
                  </div>
                  <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-900">
                    <WhatsappIcon className="w-5 h-5" />{" "}
                    <TranslatedText text="Need Help?" />
                  </h2>
                  <p className="text-gray-500">
                    <TranslatedText
                      text=" If you have any questions or need assistance, please contact
                    our customer support team."
                    />{" "}
                    <span className="text-[#ef4444]">
                      <TranslatedText text="*(10am - 10pm)" />
                    </span>
                  </p>
                  <div className="flex items-center justify-between gap-5 mt-4">
                    <Link
                      href="tel:+12202354544"
                      className="text-gray-500 w-full border border-gray-500 font-medium rounded-md p-4 items-center gap-2 justify-center flex flex-col"
                    >
                      <Phone size={18} />
                      <TranslatedText text="Contact Us" />
                    </Link>
                    <Link
                      href="http://wa.me/+12202354544"
                      className="text-gray-500 w-full border border-gray-500 font-medium rounded-md p-4 items-center gap-2 justify-center flex flex-col"
                    >
                      <WhatsappIcon className="w-5 h-5" />
                      <TranslatedText text="Whatsapp" />
                    </Link>
                    <Link
                      href="mailto:care@luxuryforyou.com"
                      className="text-gray-500 w-full border border-gray-500 font-medium rounded-md p-4 items-center gap-2 justify-center flex flex-col"
                    >
                      <Mail size={18} />
                      <TranslatedText text="Email" />
                    </Link>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default HelpModal
