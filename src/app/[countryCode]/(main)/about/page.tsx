import { getBaseURL } from "@lib/util/env"
import { TranslatedTextServer } from "@modules/common/components/translation/translatest-text-server"
import { Metadata } from "next"
import Head from "next/head"

export const metadata: Metadata = {
  title: "About",
  description: "About - Luxury For You",
  alternates: {
    canonical: new URL(getBaseURL()),
  },
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

export default function AboutPage() {
  return (
    <>
      <Head>
        <title> About - Luxury For You</title>
        <meta
          name="description"
          content="Learn about our about at Luxury For You."
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_SCHEMA) }}
        />
      </Head>
      <div className="my-10 flex flex-col justify-between p-8 md:flex-row">
        <div className="md:w-1/3">
          <h1 className="mb-4 text-center font-bold">
            <TranslatedTextServer text="About Us" />
          </h1>
          <p>
            <TranslatedTextServer
              text="Welcome to Luxury For You, we are one of the leading luxury fashion
          products platforms for fashion lovers."
            />
          </p>
          <p>
            <TranslatedTextServer
              text="We connect customers all over the world with luxury items ranging from
          clothes, shoes, bags, leather goods and more."
            />
          </p>
          <p>
            <TranslatedTextServer
              text=" Giving you 100% authentic products, at lowest possible price and a
          peace of mind with hassle free returns."
            />
          </p>
          <p>
            <TranslatedTextServer
              text="Luxury For You ensures topmost quality controls on the products
          dispatched to our customers, making sure they are 100% authentic,
          quality-issue free, timely delivered with our extremely responsive
          customer support services."
            />
          </p>
          <p>
            <TranslatedTextServer
              text="At Luxury For You, we believe that living the luxury life is about
          more than just the material. It's about experiencing the pinnacle
          of craftsmanship, design, and service."
            />
          </p>
          <p>
            <TranslatedTextServer
              text="Our expert team is constantly on the lookout for the latest trends and
          exclusive pieces, bringing you insider information and the most
          coveted items from around the globe."
            />
          </p>
          <p>
            <TranslatedTextServer
              text="We take pride in our ability to deliver not just luxury products, but
          a luxury experience, from the moment you visit our site to the
          unboxing of your purchase. We bring to you more than 300 world
          renowned brands, their worldwide collection at an affordable price."
            />
          </p>
          <p>
            <TranslatedTextServer
              text="(Please note we do not have any physical store and we only sell
          online)"
            />
          </p>
        </div>
      </div>
    </>
  )
}
