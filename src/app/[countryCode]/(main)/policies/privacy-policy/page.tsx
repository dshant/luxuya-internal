import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@modules/common/components/ui/table"
import { TranslatedTextServer } from "@modules/common/components/translation/translatest-text-server"
import Head from "next/head"

export const metadata = {
  title: "Privacy Policy - Luxury For You",
  description: "Learn about our privacy policy at Luxury For You.",
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

const PrivacyPolicy = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy - Luxury For You</title>
        <meta
          name="description"
          content="Learn about our privacy policy at Luxury For You."
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_SCHEMA) }}
        />
      </Head>
      <div className="mx-auto max-w-2xl p-8">
        <h1 className="mb-4 text-2xl font-bold">
          <TranslatedTextServer text="Privacy Policy" />
        </h1>
        <p className="mb-4">
          <TranslatedTextServer text="Last updated: July 08, 2024" />
        </p>
        <p>
          <TranslatedTextServer
            text="This Privacy Policy describes how Luxury For You (the
        &ldquo;Site&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or
        &ldquo;our&rdquo;) collects, uses, and discloses your personal
        information when you visit, use our services, or make a purchase from
        www.luxuryforyou.com (the &ldquo;Site&rdquo;) or otherwise communicate
        with us (collectively, the &ldquo;Services&rdquo;). For purposes of this
        Privacy Policy, &ldquo;you&rdquo; and &ldquo;your&rdquo; means you as
        the user of the Services, whether you are a customer, website visitor,
        or another individual whose information we have collected pursuant to
        this Privacy Policy."
          />
        </p>
        <p>
          <TranslatedTextServer
            text="Please read this Privacy Policy carefully. By using and accessing any of
        the Services, you agree to the collection, use, and disclosure of your
        information as described in this Privacy Policy. If you do not agree to
        this Privacy Policy, please do not use or access any of the Services."
          />
        </p>

        <h2 className="mt-6 text-xl font-semibold">
          <TranslatedTextServer text="Changes to This Privacy Policy" />
        </h2>
        <p>
          <TranslatedTextServer
            text="We may update this Privacy Policy from time to time, including to
        reflect changes to our practices or for other operational, legal, or
        regulatory reasons. We will post the revised Privacy Policy on the Site,
        update the &ldquo;Last updated&rdquo; date and take any other steps
        required by applicable law."
          />
        </p>

        <h2 className="mt-6 text-xl font-semibold">
          <TranslatedTextServer text="How We Collect and Use Your Personal Information" />
        </h2>
        <p>
          <TranslatedTextServer
            text="To provide the Services, we collect and have collected over the past 12
        months personal information about you from a variety of sources, as set
        out below. The information that we collect and use varies depending on
        how you interact with us."
          />
        </p>

        <h2 className="mt-6 text-xl font-semibold">
          <TranslatedTextServer text="What Personal Information We Collect" />
        </h2>
        <p>
          <TranslatedTextServer
            text="The types of personal information we obtain about you depends on how you
        interact with our Site and use our Services. When we use the term
        &ldquo;personal information&rdquo;, we are referring to information that
        identifies, relates to, describes or can be associated with you. The
        following sections describe the categories and specific types of
        personal information we collect."
          />
        </p>

        <h2 className="mt-6 text-xl font-semibold">
          <TranslatedTextServer text="Information We Collect Directly from You" />
        </h2>
        <p>
          <TranslatedTextServer
            text="Information that you directly submit to us through our Services may
        include:"
          />
        </p>
        <ul className="list-disc pl-5">
          <li>
            <TranslatedTextServer
              text="Basic contact details including your name, address, phone number,
          email."
            />
          </li>
          <li>
            <TranslatedTextServer
              text="Order information including your name, billing address, shipping
          address, payment confirmation, email address, phone number."
            />
          </li>
          <li>
            <TranslatedTextServer
              text="Account information including your username, password, security
          questions."
            />
          </li>
          <li>
            <TranslatedTextServer
              text="Shopping information including the items you view, put in your cart or
          add to your wishlist."
            />
          </li>
          <li>
            <TranslatedTextServer
              text="Customer support information including the information you choose to
          include in communications with us, for example, when sending a message
          through the Services."
            />
          </li>
        </ul>

        <h2 className="mt-6 text-xl font-semibold">
          <TranslatedTextServer text="Information We Collect through Cookies" />
        </h2>
        <p>
          <TranslatedTextServer
            text="We also automatically collect certain information about your interaction
        with the Services (&ldquo;Usage Data&rdquo;). To do this, we may use
        cookies, pixels and similar technologies (&ldquo;Cookies&rdquo;). Usage
        Data may include information about how you access and use our Site and
        your account, including device information, browser information,
        information about your network connection, your IP address and other
        information regarding your interaction with the Services."
          />
        </p>

        <h2 className="mt-6 text-xl font-semibold">
          <TranslatedTextServer text="Information We Obtain from Third Parties" />
        </h2>
        <p>
          <TranslatedTextServer
            text="Finally, we may obtain information about you from third parties,
        including from vendors and service providers who may collect information
        on our behalf, such as:"
          />
        </p>
        <ul className="list-disc pl-5">
          <li>
            <TranslatedTextServer text="Companies who support our Site and Services, such as Shopify." />
          </li>
          <li>
            <TranslatedTextServer
              text="Our payment processors, who collect payment information (e.g., bank
          account, credit or debit card information, billing address) to process
          your payment in order to fulfill your orders and provide you with
          products or services you have requested, in order to perform our
          contract with you."
            />
          </li>
        </ul>

        <h2 className="mt-6 text-xl font-semibold">
          <TranslatedTextServer text="How We Use Your Personal Information" />
        </h2>
        <p>
          <TranslatedTextServer
            text="Providing Products and Services. We use your personal information to
        provide you with the Services in order to perform our contract with you,
        including to process your payments, fulfill your orders, to send
        notifications to you related to your account, purchases, returns,
        exchanges or other transactions, to create, maintain and otherwise
        manage your account, to arrange for shipping, facilitate any returns and
        exchanges and to enable you to post reviews."
          />
        </p>

        <h2 className="mt-6 text-xl font-semibold">
          <TranslatedTextServer text="Cookies" />
        </h2>
        <p>
          <TranslatedTextServer
            text="Like many websites, we use Cookies on our Site. For specific information
        about the Cookies that we use related to powering our store with
        Shopify, see"
          />
          <a
            href="https://www.shopify.com/legal/cookies"
            className="text-blue-500 underline"
          >
            <TranslatedTextServer text="Shopify Cookies" />
          </a>
          .{" "}
          <TranslatedTextServer
            text="We use Cookies to power and improve our Site and our Services
        (including to remember your actions and preferences), to run analytics
        and better understand user interaction with the Services (in our
        legitimate interests to administer, improve and optimize the Services).
        We may also permit third parties and services providers to use Cookies
        on our Site to better tailor the services, products and advertising on
        our Site and other websites."
          />
        </p>

        <h2 className="mt-6 text-xl font-semibold">
          <TranslatedTextServer text="How We Disclose Personal Information" />
        </h2>
        <p>
          <TranslatedTextServer
            text="In certain circumstances, we may disclose your personal information to
        third parties for legitimate purposes subject to this Privacy Policy.
        Such circumstances may include:"
          />
        </p>
        <ul className="list-disc pl-5">
          <li>
            <TranslatedTextServer
              text="With vendors or other third parties who perform services on our behalf
          (e.g., IT management, payment processing, data analytics, customer
          support, cloud storage, fulfillment and shipping)."
            />
          </li>
          <li>
            <TranslatedTextServer
              text="With business and marketing partners, including Shopify, to provide
          services and advertise to you. Our business and marketing partners
          will use your information in accordance with their own privacy
          notices."
            />
          </li>
          <li>
            <TranslatedTextServer
              text="When you direct, request us or otherwise consent to our disclosure of
          certain information to third parties, such as to ship you products or
          through your use of social media widgets or login integrations, with
          your consent."
            />
          </li>
          <li>
            <TranslatedTextServer
              text="With our affiliates or otherwise within our corporate group, in our
          legitimate interests to run a successful business."
            />
          </li>
          <li>
            <TranslatedTextServer
              text="In connection with a business transaction such as a merger or
          bankruptcy, to comply with any applicable legal obligations (including
          to respond to subpoenas, search warrants and similar requests), to
          enforce any applicable terms of service, and to protect or defend the
          Services, our rights, and the rights of our users or others."
            />
          </li>
        </ul>

        <h2 className="mt-6 text-xl font-semibold">
          <TranslatedTextServer text="Categories of Recipients" />
        </h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <TranslatedTextServer text="Category" />
              </TableHead>
              <TableHead>
                <TranslatedTextServer text="Categories of Recipients" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <TranslatedTextServer
                  text="Identifiers such as basic contact details and certain order and
              account information"
                />
              </TableCell>
              <TableCell>
                <TranslatedTextServer
                  text="Vendors and third parties who perform services on our behalf (such
              as Internet service providers, payment processors, fulfillment
              partners, customer support partners and data analytics providers)"
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <TranslatedTextServer
                  text="Commercial information such as order information, shopping
              information and customer support information"
                />
              </TableCell>
              <TableCell>
                <TranslatedTextServer text="Business and marketing partners" />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <TranslatedTextServer text="Internet or other similar network activity, such as Usage Data" />
              </TableCell>
              <TableCell>
                <TranslatedTextServer text="Affiliates" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <h2 className="mt-6 text-xl font-semibold">
          <TranslatedTextServer text="User Generated Content" />
        </h2>
        <p>
          <TranslatedTextServer
            text="The Services may enable you to post product reviews and other
        user-generated content. If you choose to submit user generated content
        to any public area of the Services, this content will be public and
        accessible to anyone."
          />
        </p>

        <h2 className="mt-6 text-xl font-semibold">
          <TranslatedTextServer text="Third-Party Websites and Links" />
        </h2>
        <p>
          <TranslatedTextServer
            text="Our Site may provide links to websites or other online platforms
        operated by third parties. If you follow links to sites not affiliated
        or controlled by us, you should review their privacy and security
        policies and other terms and conditions. We do not guarantee and are not
        responsible for the privacy or security of such sites, including the
        accuracy, completeness, or reliability of information found on these
        sites. Information you provide on public or semi-public venues,
        including information you share on third-party social networking
        platforms may also be viewable by other users of the Services and/or
        users of those third-party platforms without limitation as to its use by
        us or by a third party. Our inclusion of such links does not, by itself,
        imply any endorsement of the content on such platforms or of their
        owners or operators, except as disclosed on the Services."
          />
        </p>

        <h2 className="mt-6 text-xl font-semibold">
          <TranslatedTextServer text="Children's Data" />
        </h2>
        <p>
          <TranslatedTextServer
            text="The Services are not intended to be used by children, and we do not
        knowingly collect any personal information about children. If you are
        the parent or guardian of a child who has provided us with their
        personal information, you may contact us using the contact details set
        out below to request that it be deleted."
          />
        </p>

        <h2 className="mt-6 text-xl font-semibold">
          <TranslatedTextServer text="Security and Retention of Your Information" />
        </h2>
        <p>
          <TranslatedTextServer
            text="Please be aware that no security measures are perfect or impenetrable,
        and we cannot guarantee &ldquo;perfect security.&rdquo; In addition, any
        information you send to us may not be secure while in transit. We
        recommend that you do not use insecure channels to communicate sensitive
        or confidential information to us."
          />
        </p>

        <h2 className="mt-6 text-xl font-semibold">
          <TranslatedTextServer text="Your Rights and Choices" />
        </h2>
        <p>
          <TranslatedTextServer
            text="Depending on where you live, you may have some or all of the rights
        listed below in relation to your personal information. However, these
        rights are not absolute and may apply only in certain circumstances,
        and, in certain cases, we may decline your request as permitted by law."
          />
        </p>

        <h2 className="mt-6 text-xl font-semibold">
          <TranslatedTextServer text="Complaints" />
        </h2>
        <p>
          <TranslatedTextServer
            text="If you have complaints about how we process your personal information,
        please contact us using the contact details provided below. If you are
        not satisfied with our response to your complaint, depending on where
        you live you may have the right to appeal our decision by contacting us
        using the contact details set out below or lodge your complaint with
        your local data protection authority."
          />
        </p>

        <h2 className="mt-6 text-xl font-semibold">
          <TranslatedTextServer text="International Users" />
        </h2>
        <p>
          <TranslatedTextServer
            text="Please note that we may transfer, store, and process your personal
        information outside the country you live in, including the United
        States. Your personal information is also processed by staff and
        third-party service providers and partners in these countries."
          />
        </p>

        <h2 className="mt-6 text-xl font-semibold">
          <TranslatedTextServer text="Contact" />
        </h2>
        <p>
          <TranslatedTextServer
            text="Should you have any questions about our privacy practices or this
        Privacy Policy, or if you would like to exercise any of the rights
        available to you, please call +1 (220) 235-4544 or email us at"
          />
          <a href="/contact">care@luxuryforyou.com</a>.
        </p>
      </div>
    </>
  )
}

export default PrivacyPolicy
