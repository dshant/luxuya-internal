import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"
import { Manrope, Bebas_Neue } from "next/font/google"
import { LanguageWrapper } from "layouts/language-wrapper"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export const LOCAL_SCHEMA = {
  "@context": "https://schema.org/",
  "@type": "Local Business Schema",
  "@id": "https://luxuryforyou.com",
  name: "Luxury For You",
  logo: " https://luxuryforyou.com/logo.svg",
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

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
})

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bebas-neue",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr" data-mode="light">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <script
          id="config"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_SCHEMA) }}
        />
      </head>
      <body
        className={`${manrope.variable} ${bebasNeue.variable} font-manrope antialiased`}
      >
        <LanguageWrapper>
          <main className="relative">{children}</main>
        </LanguageWrapper>
      </body>
    </html>
  )
}
