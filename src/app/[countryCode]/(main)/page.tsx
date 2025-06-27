import { Metadata } from "next"

import Hero from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { TranslatedTextServer } from "@modules/common/components/translation/translatest-text-server"
import { getBaseURL } from "@lib/util/env"
import MainOfferModel from "@modules/products/templates/MainOfferModel"

export const metadata: Metadata = {
  title: "Luxury For You",
  description: "Luxury For You",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: new URL(getBaseURL()),
  },
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <MainOfferModel
        messageTitle=""
        messageBody="Don't miss out on our latest offers!"
        inactivityTime={10000}
        countryCode={params.countryCode}
      />
      <div className="flex flex-col gap-y-12">
        <Hero />
        <h2 className="text-center font-bebas text-[2rem] leading-[2rem] md:text-[5rem] md:leading-[5rem] uppercase">
          <TranslatedTextServer
            text="We're dedicated to providing you with a seamless and enjoyable
          shopping experience. Our platform brings together a diverse range of
          sellers and products"
          />
        </h2>
      </div>
    </>
  )
}
