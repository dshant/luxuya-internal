"use client"

import { verifyEmail } from "@lib/util/common"
import { toast } from "sonner"
import Link from "next/link"
import Facebook from "@modules/common/icons/facebook"
import Instagram from "@modules/common/icons/instagram"
import LinkedIn from "@modules/common/icons/linkedIn"
import Tiktok from "@modules/common/icons/tiktok"
import Pinterest from "@modules/common/icons/pinterest"
import { TranslatedText } from "@modules/common/components/translation/translated-text"

export default function Footer() {
  const handleSubscribe = async (formData: FormData) => {
    const email = formData.get("email")?.toString() || ""
    if (!verifyEmail(email)) {
      throw new Error("Invalid email address")
    }
    try {
      const response = await fetch("/api/send/contact", {
        method: "POST",
        body: JSON.stringify({
          email,
          audienceId: "1c16e8bf-c8ce-4447-96a0-a560c6796251",
        }),
      })
      if (!response.ok) {
        toast.error("Something went wrong, please try again later")
      } else {
        toast.success("You are subscribed to our newsletter")
      }
    } catch (error) {
      toast.error("Something went wrong, please try again later")
    }
  }

  return (
    <footer className="mt-10 border-t bg-white pt-12 px-5">
      <div className="container max-w-[1440px] mx-auto grid grid-cols-1 gap-5 md:px-2 md:grid-cols-12">
        <div className="space-y-2 lg:col-span-4 md:col-span-6">
          <h3 className="text-sm font-semibold">
            <TranslatedText text="Company" />
          </h3>
          <p className="w-2/3 text-sm text-gray-600">
            <TranslatedText
              text=" Luxury For You is a leading luxury fashion products platform for
            fashion lovers offering over 300 designer brands, 100% authentic
            products, at the lowest possible price, and peace of mind with
            hassle-free returns. All products dispatched are quality checked,
            timely delivered, with our extremely responsive customer support
            services."
            />
          </p>
        </div>
        <div className="space-y-2 lg:col-span-2 md:col-span-6">
          <h3 className="text-sm font-semibold">
            <TranslatedText text="Policies" />
          </h3>
          <ul className="space-y-1">
            <li>
              <a href="/policies/shipping-policy" className="hover:underline">
                <TranslatedText text="Shipping Policy" />
              </a>
            </li>
            <li>
              <a href="/policies/refund-policy" className="hover:underline">
                <TranslatedText text="Refund and Return Policy" />
              </a>
            </li>
            <li>
              <a href="/policies/privacy-policy" className="hover:underline">
                <TranslatedText text="Privacy Policy" />
              </a>
            </li>
            <li>
              <a
                href="/policies/terms-and-conditions"
                className="hover:underline"
              >
                <TranslatedText text="Terms of Service" />
              </a>
            </li>
            <li>
              <a
                href="/policies/billing-terms-conditions"
                className="hover:underline"
              >
                <TranslatedText text="Billing Terms & Conditions" />
              </a>
            </li>
          </ul>
        </div>
        <div className="space-y-2 lg:col-span-2 md:col-span-6">
          <h3 className="text-sm font-semibold">
            <TranslatedText text="Help" />
          </h3>
          <ul className="space-y-1">
            <li>
              <a href="/about" className="hover:underline">
                <TranslatedText text="About Us" />
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:underline">
                <TranslatedText text="Contact" />
              </a>
            </li>
            <li>
              <a href="/help" className="hover:underline">
                <TranslatedText text="FAQs" />
              </a>
            </li>
            <li>
              <a href="/account" className="hover:underline">
                <TranslatedText text="Track Order" />
              </a>
            </li>
          </ul>
        </div>
        <div className="space-y-4 lg:col-span-4 md:col-span-6">
          <h3 className="text-sm font-semibold">
            <TranslatedText text="Newsletter" />
          </h3>
          <p className="text-sm">
            <TranslatedText
              text="Sign up to be the first to know about new collections and exclusive
            events."
            />
          </p>
          <div className="flex justify-start">
            {" "}
            {/* Adjusted here */}
            <iframe
              className="w-[350px] h-80 md:h-80 flex justify-start"
              src="https://cdn.forms-content-1.sg-form.com/86fb93b5-ef90-11ef-9eb4-0ab8a55c9275"
              style={{ border: "none", overflow: "hidden" }}
            />
          </div>
        </div>
      </div>
      <div className="container max-w-[1440px] relative lg:bottom-[150px] lg:right-[120px] md:bottom-[200px] md:right-[300px]  mx-auto flex flex-col justify-center md:items-center gap-2">
        <h3 className="text-sm font-semibold">
          <TranslatedText text="KEEP IN TOUCH" />
        </h3>

        <div className="flex gap-2 items-center flex-wrap">
          <Link
            target="_blank"
            href={`https://www.instagram.com/luxuryforyouofficial`}
          >
            <Instagram size={25} />
          </Link>
          <Link
            target="_blank"
            href={`https://www.linkedin.com/company/luxuryforyou`}
          >
            <LinkedIn size={23} />
          </Link>
          <Link
            target="_blank"
            href={`https://www.facebook.com/Luxuryforyouofficial`}
          >
            <Facebook size={25} />
          </Link>
          <Link
            target="_blank"
            href={`https://www.tiktok.com/@luxuryforyouofficial`}
          >
            <Tiktok size={29} />
          </Link>
          <Link
            target="_blank"
            href={`https://www.pinterest.com/luxuryforyouofficial`}
          >
            <Pinterest size={25} />
          </Link>
        </div>
      </div>
    </footer>
  )
}
