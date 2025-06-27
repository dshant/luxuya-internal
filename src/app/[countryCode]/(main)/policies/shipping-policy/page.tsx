import { fetchShippingPolicy } from "@lib/data/strapi"
import { getBaseURL } from "@lib/util/env"
import { TranslatedTextServer } from "@modules/common/components/translation/translatest-text-server"
import { Metadata } from "next"
import React from "react"
import Head from "next/head"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params

  return {
    title: "Shipping Policies | Luxury For You",
    description: "Clear, transparent, and hassle-free shipping policies.",
    alternates: {
      canonical: new URL(getBaseURL()),
    },
    openGraph: {
      title: "Shipping Policies | Luxury For You",
      description: "Clear, transparent, and hassle-free shipping policies.",
      type: "website",
      url: `${getBaseURL()}/${params.countryCode}/policies/shipping-policy`,
      images: "./safeCheckout.png",
    },
    robots: {
      index: true,
      follow: true,
    },
  }
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

export default async function ShippingPolicy({
  params,
}: {
  params: { countryCode: string }
}) {
  const data = await fetchShippingPolicy({ params })

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_SCHEMA) }}
        />
      </Head>

      <div className="mx-auto max-w-2xl p-8">
        <h1 className="mb-4 text-2xl font-bold">
          <TranslatedTextServer text={data?.data?.Title ?? "Shipping Policy"} />
        </h1>

        <p>
          <TranslatedTextServer text={data?.data.Page_Description} />
        </p>

        {data?.data.Sections?.map((section: any, index: number) => (
          <div key={index} className="mt-6">
            <h2 className="text-xl font-semibold">
              <TranslatedTextServer
                text={section?.Heading?.map((h: any) =>
                  h.children?.map((child: any) => child.text).join(" ")
                ).join(" ")}
              />
            </h2>
            <p>
              <TranslatedTextServer
                text={section?.Description?.map((d: any) =>
                  d.children?.map((child: any) => child.text).join(" ")
                ).join(" ")}
              />
            </p>
          </div>
        ))}
      </div>
    </>
  )
}
