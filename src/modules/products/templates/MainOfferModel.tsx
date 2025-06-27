"use client"
import React, { Fragment, useEffect, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { X } from "lucide-react"
import { usePathname } from "next/navigation"
import { getOrSetCart, updateCart } from "@lib/data/cart"
import { getModalCookie, setModalCookie } from "@lib/data/cookies-client"
import Link from "next/link"
import { Copy, CopyCheck, LoaderCircle } from "lucide-react"
import { toast } from "sonner"

interface InactivityModalProps {
  messageTitle?: string
  messageBody?: string
  inactivityTime?: number // Time in milliseconds before showing the modal
  countryCode: string
}

const MainOfferModel: React.FC<InactivityModalProps> = ({
  messageTitle = "Are you still there?",
  messageBody = "We noticed you haven't been active for a while. Let us know if you need help!",
  inactivityTime = 10000, // Default to 10 seconds
  countryCode,
}) => {
  const router = usePathname()
  const [email, setEmail] = useState("")
  const [number, setNumber] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [codeCopied, setCodeCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  // Check if this is first visit
  const isFirstVisit = () => {
    if (typeof window === "undefined") return false
    const hasVisited = localStorage.getItem("hasVisitedBefore")
    if (!hasVisited) {
      localStorage.setItem("hasVisitedBefore", "true")
      return true
    }
    return false
  }

  // Check if user has submitted before
  const hasSubmittedBefore = () => {
    if (typeof window === "undefined") return false
    return localStorage.getItem("hasSubmittedOffer") === "true"
  }

  const handleCodeSubmit = async () => {
    if (email && email !== "") {
      setLoading(true)
      await fetch(
        "https://hook.eu2.make.com/mix8j84mxx98h8sb191z4oq8iwbxfyur",
        {
          method: "POST",
          body: JSON.stringify({
            email: email,
          }),
        }
      )
      await getOrSetCart(countryCode)
      await updateCart({ email: email })
      // Store submission in localStorage
      localStorage.setItem("hasSubmittedOffer", "true")
    }
    setIsSubmitted(true)
    setEmail("")
    setNumber("")
    setLoading(false)
  }

  const handleCloseModal = () => {
    const maxAge = 24 * 60 * 60 // 1 day in seconds
    setModalCookie("hideModalUntil", "true", maxAge)
    setIsModalOpen(false)
    setIsSubmitted(false)
  }

  useEffect(() => {
    let timeout: NodeJS.Timeout

    const shouldShowModal = () => {
      // Don't show if user has submitted before
      if (hasSubmittedBefore()) return false

      // Show on first visit
      if (isFirstVisit()) return true

      const hideModalUntil = getModalCookie("hideModalUntil")
      const currentTime = new Date().getTime()

      // Show if cookie has expired
      return !hideModalUntil || currentTime > Number(hideModalUntil)
    }

    const resetTimer = () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        if (shouldShowModal()) {
          setIsModalOpen(true)
        }
      }, inactivityTime)
    }

    const handleUserActivity = () => {
      resetTimer()
    }

    // Add event listeners for user activity
    window.addEventListener("mousemove", handleUserActivity)
    window.addEventListener("keydown", handleUserActivity)
    window.addEventListener("scroll", handleUserActivity)

    // Start the timer initially
    resetTimer()

    return () => {
      // Cleanup event listeners and timeout
      window.removeEventListener("mousemove", handleUserActivity)
      window.removeEventListener("keydown", handleUserActivity)
      window.removeEventListener("scroll", handleUserActivity)
      clearTimeout(timeout)
    }
  }, [inactivityTime, router])

  return (
    <Transition appear show={isModalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleCloseModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>
        <div className="fixed inset-0 flex items-center justify-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-[500px] p-0 transform overflow-hidden rounded-2xl bg-transaprent text-left align-middle transition-all">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900"
              >
                {messageTitle}
              </Dialog.Title>
              <div className="w-full flex justify-end absolute right-[10px] top-[35px]">
                <button
                  onClick={handleCloseModal}
                  className="text-white w-12 h-12 rounded-full text-ui-fg-base flex justify-center items-center z-[555]"
                  data-testid="close-modal-button"
                >
                  <X />
                </button>
              </div>
              <div className=" w-full flex justify-center items-center ">
                <div className="relative bg-[#5A524C] w-full border-4 border-[#735936] rounded-[34px] overflow-hidden">
                  <img
                    src="/offer-model-img.png"
                    alt="im"
                    width="100%"
                    height="100%"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute rounded-3xl top-0 bg-black/50 px-5 sm:px-12  w-full h-full flex flex-col justify-center py-10 items-center">
                    {isSubmitted ? (
                      <div className="flex flex-col items-center justify-center text-center">
                        {/* <div className="text-[#d8bb94] text-4xl mb-4">🎉</div> */}
                        <h2 className="text-[#d8bb94] text-3xl font-bebas mb-4">
                          You're All Set!
                        </h2>
                        <p className="text-white text-xl mb-6">
                          Thanks for subscribing — here's your 10% off code:
                        </p>
                        <div
                          className="bg-[#735936] text-white font-bold py-3 px-8 rounded-lg mb-6 w-[75%]
                              flex items-center justify-between border border-dashed border-[#d8bb94]"
                        >
                          <p className="text-2xl">NEW10</p>

                          <div className="cursor-pointer -mr-4">
                            {codeCopied ? (
                              <CopyCheck
                                className="opacity-50"
                                onClick={() => {
                                  navigator.clipboard.writeText("NEW10")
                                  toast.success("Code copied to clipboard!")
                                  setCodeCopied(false)
                                }}
                              />
                            ) : (
                              <Copy
                                className="opacity-75"
                                onClick={() => {
                                  navigator.clipboard.writeText("NEW10")
                                  toast.success("Code copied to clipboard!")
                                  setCodeCopied(true)
                                }}
                              />
                            )}
                          </div>
                        </div>
                        <p className="text-white text-lg mb-8">
                          Use it at checkout and enjoy 10% off your first order.
                        </p>
                        <p className="text-white text-xl mb-4">
                          Ready to find something you love?
                        </p>
                        <button
                          onClick={handleCloseModal}
                          className="bg-[#735936] text-white text-xl py-3 px-8 rounded-lg hover:bg-[#8a6d43] transition-colors duration-300"
                        >
                          Start shopping now
                        </button>
                        <p className="text-[#d8bb94] text-xl mt-6">
                          Happy shopping!
                        </p>
                      </div>
                    ) : (
                      <>
                        <p className="text-[55px] xsmall:text-[68px]/[68px] -tracking-[2px] text-[#d8bb94] text-center font-bebas">
                          ENJOY
                        </p>
                        <p className="text-[40px] xsmall:text-[63px] text-[#d8bb94] -tracking-[2px] leading-[68px] mb-5 xsmall:leading-[38px] text-center font-bebas">
                          10% OFF NOW
                        </p>
                        <p className="text-[18px] xsmall:text-[23px] md:text-xl mb-10 text-white leading-[15px] xsmall:leading-[30px] text-center">
                          Unlock exclusive concierge access, early-bird and
                          express delivery
                        </p>

                        <div className="flex flex-col w-full mb-6">
                          {/* <label className='text-[18px] xsmall:text-[22px] text-white  text-left'>Email address </label> */}
                          <input
                            placeholder="Email address "
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="text"
                            className="w-full text-[18px] py-2 bg-transparent text-white outline-none border-b-2 border-[#6a6459]"
                          />
                        </div>
                        <div className="flex flex-col w-full mb-6">
                          {/* <label className='text-[18px] xsmall:text-[22px] text-white  text-left'>Whatsapp Number (optional) </label> */}
                          <input
                            placeholder="Whatsapp Number (optional)"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            type="text"
                            className="w-full text-[18px] py-2 bg-transparent outline-none text-white border-b-2 border-[#6a6459]"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleCodeSubmit}
                          className="mb-7 w-[80%] xmall:w-[60%] h-[50px] bg-[#735936] rounded-xl text-white leading-3 text-center flex items-center justify-center"
                        >
                          {loading ? (
                            <LoaderCircle className="animate-spin" />
                          ) : (
                            <p className="text-[22px]">UNLOCK MY CODE</p>
                          )}
                        </button>
                        <p className="text-base text-[#e8e4d6] leading-7 text-center">
                          We respect your privacy. Zero spam-only curated drops.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

export default MainOfferModel
