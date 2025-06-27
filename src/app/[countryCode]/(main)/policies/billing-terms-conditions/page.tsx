import { getBaseURL } from "@lib/util/env"
import { TranslatedTextServer } from "@modules/common/components/translation/translatest-text-server"
import Head from "next/head"
import React from "react"

export const metadata = {
  title: "Billing Terms Conditions - Luxury For You",
  description: "Learn about our billing terms conditions at Luxury For You.",
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

const BillingTermsConditions = () => {
  return (
    <>
      <Head>
        <title>Billing Terms Conditions - Luxury For You</title>
        <meta
          name="description"
          content="Learn about our billing terms conditions at Luxury For You."
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_SCHEMA) }}
        />
      </Head>
      <div className="mx-auto max-w-2xl p-8">
        <h1 className="mb-4 text-2xl font-bold">
          <TranslatedTextServer text="Billing Terms &amp; Conditions" />
        </h1>

        <h2 className="mt-6 text-xl font-semibold">
          <TranslatedTextServer text="Is it safe to do the payment on your website?" />
        </h2>
        <p>
          <TranslatedTextServer
            text="Luxury For You uses Secure Sockets Layer (128 Bit SSL Security or SSL)
        technology to supply you with the safest, most secure shopping
        experience possible. SSL technology enables encryption (scrambling) of
        sensitive information, including passwords and credit or debit card
        numbers, during your online transactions. All of the forms on our site
        are secured with SSL technology so your personal information stays safe
        and out of malicious hands."
          />
        </p>

        <h2 className="mt-6 text-xl font-semibold">
          <TranslatedTextServer text="We accept the following credit and debit cards:" />
        </h2>
        <ul className="list-disc pl-5">
          <li>
            <TranslatedTextServer text="Visa" />
          </li>
          <li>
            <TranslatedTextServer text="Mastercard" />
          </li>
          <li>
            <TranslatedTextServer text="American Express" />
          </li>
          <li>
            <TranslatedTextServer text="Apple Pay" />
          </li>
        </ul>

        <h2 className="mt-6 text-xl font-semibold">
          <TranslatedTextServer text="How can I choose my payment method?" />
        </h2>
        <p>
          <TranslatedTextServer
            text="Please place the order directly, then go on. When you are on the
        checkout page, you will see the payment method are shown on this page,
        then you can choose which you like."
          />
        </p>

        <h2 className="mt-6 text-xl font-semibold">
          <TranslatedTextServer text="Will I receive a confirmation email after I do the payment?" />
        </h2>
        <p>
          <TranslatedTextServer
            text="Yes, as soon as the payment is complete, you will receive an email
        confirming it from both our company and the company that accepts your
        payment method."
          />
        </p>

        <h2 className="mt-6 text-xl font-semibold">
          <TranslatedTextServer text="Pricing:" />
        </h2>
        <p>
          <TranslatedTextServer
            text="Product prices are as listed on the Website and are subject to change
        without prior notice."
          />
        </p>

        <h2 className="mt-6 text-xl font-semibold">
          <TranslatedTextServer text="Taxes &amp; Duties" />
        </h2>
        <p>
          <TranslatedTextServer
            text="All import taxes and duties are included in the final price. You won’t
        have to pay any additional charges upon delivery."
          />
        </p>

        <h2 className="mt-6 text-xl font-semibold">
          <TranslatedTextServer text="Billing Authorization" />
        </h2>
        <p>
          <TranslatedTextServer
            text="By providing your payment information, you authorize us to charge the
        specified amount for your order."
          />
        </p>

        <h2 className="mt-6 text-xl font-semibold">
          <TranslatedTextServer text="Modifications to Terms" />
        </h2>
        <p>
          <TranslatedTextServer
            text="We reserve the right to modify or update these Billing Terms &amp;
        Conditions at any time. Changes will be effective upon posting on our
        website."
          />
        </p>
      </div>
    </>
  )
}

export default BillingTermsConditions
