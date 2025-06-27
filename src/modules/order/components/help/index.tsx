import { Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { TranslatedTextServer } from "@modules/common/components/translation/translatest-text-server"
import { Metadata } from "next"
import Head from "next/head"
import React from "react"


export const metadata: Metadata = {
  title: "About",
  description: "About - Luxury For You",
  robots: {
    index: true,
    follow: true,
  },
}

const LOCAL_SCHEMA = {
  "@context": "https://schema.org/",
  "@type": "Privately Held",
  "@id": "https://luxuryforyou.com",
  name: "Luxury For You",
  logo: "https://luxuryforyou.com/logo.svg",
  telephone: "+971 50 876 6294",
  email: "care@luxuryforyou.com",
  url: "https://luxuryforyou.com",
  sameAs: [
    "https://www.facebook.com/Luxuryforyouofficial",
    "https://www.instagram.com/luxuryforyouofficial",
    "https://www.linkedin.com/company/luxuryforyou",
    "https://www.tiktok.com/@luxuryforyouofficial",
    "https://www.pinterest.com/luxuryforyouofficial",
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Al Asayel Street",
    addressLocality: "Downtown Dubai, Business Bay",
    addressRegion: "Dubai, United Arab Emirates",
    postalCode: "00000",
  },
}

const Help = () => {
  return (
    <>
      <Head>
        <title> Help - Luxury For You</title>
        <meta
          name="description"
          content="Learn about our help at Luxury For You."
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_SCHEMA) }}
        />
      </Head>
      <div className="mt-6">
        <Heading className="text-base-semi"><TranslatedTextServer text="Need help?" /></Heading>
        <div className="text-base-regular my-2">
          <ul className="gap-y-2 flex flex-col">
            <li>
              <LocalizedClientLink href="/contact"><TranslatedTextServer text="Contact" /></LocalizedClientLink>
            </li>
            <li>
              <LocalizedClientLink href="/contact">
                <TranslatedTextServer text="Returns & Exchanges" />
              </LocalizedClientLink>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default Help
