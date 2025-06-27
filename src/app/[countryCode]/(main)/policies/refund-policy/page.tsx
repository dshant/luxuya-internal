import { TranslatedTextServer } from "@modules/common/components/translation/translatest-text-server"
import Head from "next/head"
import React from "react"
import { Metadata } from "next"
import { getBaseURL } from "@lib/util/env"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params

  return {
    title: "Refund Policies | Luxury For You",
    description: "Clear, transparent, and hassle-free refund policies.",
    alternates: {
      canonical: new URL(getBaseURL()),
    },
    openGraph: {
      title: "Refund Policies | Luxury For You",
      description: "Clear, transparent, and hassle-free refund policies.",
      type: "website",
      url: `${getBaseURL()}/${params.countryCode}/policies/refund-policy`,
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

const RefundPolicy = () => {
  const returnInstructionsText =
    'Click the "Return item(s)" button and follow the instructions'
  return (
    <>
      <Head>
        <title>Refund Policy - Luxury For You</title>
        <meta
          name="description"
          content="Learn about our refund policy at Luxury For You."
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_SCHEMA) }}
        />
      </Head>
      <div className="mx-auto max-w-2xl p-8">
        <h1 className="mb-4 text-2xl font-bold">
          <TranslatedTextServer text="Refund Policy" />
        </h1>
        <p>
          <TranslatedTextServer
            text="Thank you for shopping at Luxury For You. We take pride in providing you
        with the highest quality products and excellent customer service.
        However, we understand that there may be instances where you need to
        return or exchange a product. This Refund Policy outlines the terms and
        conditions under which you may do so. Please read this policy carefully
        before making a purchase."
          />
        </p>

        <h2 className="mt-6 text-xl font-semibold">
          <TranslatedTextServer text="Return Period" />
        </h2>
        <p>
          <TranslatedTextServer
            text="Customers can return products within 14 days of receipt. Returns beyond
        this period may not be accepted."
          />
        </p>

        <h2 className="mt-6 text-xl font-semibold">
          <TranslatedTextServer text="Refund Conditions" />
        </h2>
        <p>
          <TranslatedTextServer
            text="In order to qualify for a refund, all items (including promotional gift
        items accompanying the Order) must be returned to us within 14 days of
        Order receipt with the following conditions:"
          />
        </p>
        <ul className="list-disc pl-5">
          <li>
            <TranslatedTextServer
              text="Items must be unaltered, unused, and in full sellable condition (or
          the condition in which they were received from us or our agents).
          Shoes must be in brand-new condition and without any damage."
            />
          </li>
          <li>
            <TranslatedTextServer
              text="Items must be in their original packaging/box/dust cover and with all
          brand and product labels/tags/instructions still attached.
          Authenticity cards, where provided, should also be returned. Swimwear
          must have the original hygiene liner attached."
            />
          </li>
          <li>
            <TranslatedTextServer text="The return must be accompanied by the original Order confirmation." />
          </li>
          <li>
            <TranslatedTextServer
              text="Please note, that beauty items, grooming items, underwear, and
          earrings cannot be returned."
            />
          </li>
        </ul>
        <p>
          <TranslatedTextServer
            text="Refunds will be made to the original mode of payment and may take up to
        10 working days, depending on the issuing bank of the credit card."
          />
        </p>
        <h2 className="mt-6 text-xl font-semibold">
          <TranslatedTextServer text="Returns Process" />
        </h2>
        <p>
          <TranslatedTextServer text="Once you receive your item you can initiate a return as follows:" />
        </p>
        <ul className="list-disc pl-5">
          <li>
            <TranslatedTextServer text="Go to the account page." />
          </li>
          <li>
            <TranslatedTextServer text="Navigating to the order which contains the item you'd like to return." />
          </li>
          <li>
            <TranslatedTextServer text="Click on the order to go to the order detail page." />
          </li>
          <li>
            <TranslatedTextServer text={returnInstructionsText} />
          </li>
          <li>
            <TranslatedTextServer
              text="If you encounter any problems, please contact our customer service at
          care@luxuryforyou.com"
            />
          </li>
          <li>
            <TranslatedTextServer
              text="If you checked out as a guest. Sign up for an account with the same email address you used to place
        the order and initiate a return as specified above. "
            />
          </li>
        </ul>

        <h2 className="mt-6 text-xl font-semibold">
          <TranslatedTextServer text="Return Shipping Fee" />
        </h2>
        <p>
          <TranslatedTextServer
            text="Customers are responsible for the shipping costs of returning a product
        for a change of mind or exchange. However, the company will be
        responsible for shipping costs for damaged or defective items."
          />
        </p>

        <h2 className="mt-6 text-xl font-semibold">
          <TranslatedTextServer text="Item Return Policies" />
        </h2>
        <h3 className="mt-4 text-lg font-semibold">
          <TranslatedTextServer text="Damaged Goods and Incorrectly-Fulfilled Orders" />
        </h3>
        <p>
          <TranslatedTextServer
            text="If you receive an item that is damaged or not the product you ordered,
        please arrange for the return of the item to us using the Returns
        Process above. The item must be returned in the same condition you
        received it in within 14 days of receipt to qualify for a full refund.
        Replacements may be available depending on stock. If an item has a
        manufacturing defect, it may also benefit from a manufacturer's defects
        warranty. If you believe your item is defective, please call us at +1
        (220) 235-4544."
          />
        </p>

        <h3 className="mt-4 text-lg font-semibold">
          <TranslatedTextServer text="Shoes" />
        </h3>
        <p>
          <TranslatedTextServer
            text="Shoe returns will only be accepted if the items are in brand-new
        condition and without any damage to the items or their packaging. To
        avoid damage, shoes should only be tried on carpeted surfaces. Any items
        returned with scuffing, scratches, dents, any type of damage, and
        visible signs of wear will not be accepted and will be returned to the
        customer with a rejected refund request."
          />
        </p>

        <h3 className="mt-4 text-lg font-semibold">
          <TranslatedTextServer text="Non-Returnable Items" />
        </h3>
        <p>
          <TranslatedTextServer text="Lingerie and swimwear items once worn or opened are not returnable." />
        </p>

        <h3 className="mt-4 text-lg font-semibold">
          <TranslatedTextServer text="Packaging" />
        </h3>
        <p>
          <TranslatedTextServer
            text="Please take care to preserve the condition of any product packaging as,
        for example, damaged shoe boxes may prevent re-sale and may mean that we
        cannot give you a full refund. Our agents may ask to inspect returned
        items at the point of collection but that initial inspection does not
        constitute a guarantee of your eligibility for a full refund."
          />
        </p>

        <h3 className="mt-4 text-lg font-semibold">
          <TranslatedTextServer text="Gifted Items" />
        </h3>
        <p>
          <TranslatedTextServer
            text="Gifted items and items in gift orders can only be returned with a refund
        given to the purchaser of the gift."
          />
        </p>

        <h3 className="mt-4 text-lg font-semibold">
          <TranslatedTextServer text="Sale Items" />
        </h3>
        <p>
          <TranslatedTextServer
            text="Only regular-priced items may be refunded, unfortunately, sale items
        cannot be refunded."
          />
        </p>

        <h3 className="mt-4 text-lg font-semibold">
          <TranslatedTextServer text="Exchange Products" />
        </h3>
        <p>
          <TranslatedTextServer
            text="The fastest way to ensure you get what you want is to return the item
        you have, and once the return is accepted, make a separate purchase for
        the new item."
          />
        </p>

        <h3 className="mt-4 text-lg font-semibold">
          <TranslatedTextServer text="Order Cancellations" />
        </h3>
        <p>
          <TranslatedTextServer
            text="As long as the order has not been sent for picking and packing in our
        warehouse you can cancel your order. Please contact us as soon as
        possible if you wish to cancel. If the item has left our warehouse
        please wait for the item to arrive before organizing a return. Do note
        that once the order has left our warehouse, postage back to us will not
        be covered. You'll have to pay return shipping and there is no
        restocking fee."
          />
        </p>

        <h3 className="mt-4 text-lg font-semibold">
          <TranslatedTextServer text="Received the Wrong Product" />
        </h3>
        <p>
          <TranslatedTextServer
            text="We follow careful order-picking procedures to ensure every product in
        your order is correct, but occasionally we do make mistakes. You can
        choose to keep the wrong item with a partial refund or request the
        correct item. To request the correct item, we may offer you a
        free-of-charge return shipping label. After receiving your returned
        item, please send us an email to care@luxuryforyou.com indicating your
        order details. We will, upon request, send you the correct item or issue
        a full refund."
          />
        </p>

        <h3 className="mt-4 text-lg font-semibold">
          <TranslatedTextServer text="Customized Items" />
        </h3>
        <p>
          <TranslatedTextServer
            text="Customized items can't be canceled when we start processing. Please
        contact us at care@luxuryforyou.com to confirm the order process before
        canceling. We don't accept order canceling once it's in the
        process of shipping."
          />
        </p>

        <h3 className="mt-4 text-lg font-semibold">
          <TranslatedTextServer text="Refunds" />
        </h3>
        <p>
          <TranslatedTextServer
            text="We will notify you once we've received and inspected your return, and
        let you know if the refund was approved or not. If approved, you'll be
        automatically refunded to your original payment method and it may take
        up to 10 working days. Please remember it can take some time for your
        bank or credit card company to process and post the refund as well.
        Please note, a nominal return charge might be deducted from the refund
        amount for returns. Duties and taxes will not be refunded."
          />
        </p>
        <p>
          <TranslatedTextServer
            text="If more than 10 business days have passed since we've approved your
        return, please contact us at "
          />
          <a href="/contact">care@luxuryforyou.com</a>.
        </p>
      </div>
    </>
  )
}

export default RefundPolicy
