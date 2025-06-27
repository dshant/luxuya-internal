"use client"

import { useState } from "react"
import { AspectRatio } from "@radix-ui/react-aspect-ratio"
import Image from "next/image"
import HeaderSelectorImage from "./HeaderSelectorImage"
import { useRouter } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { TranslatedText } from "@modules/common/components/translation/translated-text"

const Hero = () => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleNavigation = (href: string) => {
    setLoading(true)
    router.push(href)
  }

  return (
    <section className="flex flex-col gap-y-5">
      <div className="flex flex-col items-center gap-y-2 text-center">
        <h1 className="font-bebas text-[6rem] leading-[6rem] md:text-[16rem] md:leading-[16rem]">
          <TranslatedText text="DISCOVER LIMITLESS" /><span className="text-[0px]">Luxury for you</span>
        </h1>
        <p className="mx-auto max-w-6xl text-base uppercase md:text-2xl">
          <TranslatedText
            text="  Where Every Product Imaginable Meets Your Needs. Explore a Vast Array
          of Quality Goods, Discover Unbeatable Deals, and Shop with Confidence,
          All in One Convenient Location"
          />
        </p>
      </div>
      <AspectRatio ratio={16 / 9}>
        <img
          src="/hero-image.png"
          alt="Discover Limitless"
          // fill
          className="overflow-hidden rounded-2xl object-cover w-full h-full"
          width={"100%"}
          height={"100%"}
        />
      </AspectRatio>
      <div className="flex flex-col gap-y-5">
        <h3 className="text-2xl">
          <TranslatedText text="Our Collections" />
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {/* {loading && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
              <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full border-4 border-white border-t-transparent animate-spin shadow-[0_0_20px_rgba(255,255,255,0.8)]"></div>
                </div>
              </div>
            </div>
          )} */}

          <LocalizedClientLink
            href="/categories/women"
          >
            <HeaderSelectorImage image="https://img.mytheresa.com/cms/1440/1640/65/images/4fb76128-ad2f-4711-9845-3326680c2ef5.jpg">
              <h2 className="font-bebas text-white text-[42px]">Women</h2>
            </HeaderSelectorImage>
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/categories/Men"
          >
            <HeaderSelectorImage image="https://img.mytheresa.com/cms/1440/1640/65/images/c8744b85-57e0-4cff-82c9-8d0a804e7fb6.jpg">
              <h2 className="font-bebas text-white text-[42px]">Men</h2>
            </HeaderSelectorImage>
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/categories/kids"
          >            <HeaderSelectorImage image="https://img.mytheresa.com/cms/1440/1640/65/images/e207a325-7d7c-4dce-9e8f-e05e29533faf.jpg">
              <h2 className="font-bebas text-white text-[42px]">Kids</h2>
            </HeaderSelectorImage>
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/categories/life"
          >            <HeaderSelectorImage image="https://www.mytheresa.com/content/1440/1640/65/bd2b639d-2bf7-4ad5-a7da-ab7ae17cabe0.jpg">
              <h2 className="font-bebas text-white text-[42px]">Life</h2>
            </HeaderSelectorImage>
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}

export default Hero
