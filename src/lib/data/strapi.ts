import { getRegion } from "./regions"

const regionMap: any = {
  usd: "en-US",
  eur: "de-DE",
  inr: "hi-IN",
  aed: "ar-AE",
  sar: "ar-SA",
  qar: "ar-QA",
  kwd: "ar-KW",
  gbp: "en-GB",
}

export const getFaqData = async ({
  params,
}: {
  params: { countryCode: string }
}) => {
  const { countryCode } = await params

  const region = await getRegion(countryCode)
  const locale =
    region && region.currency_code
      ? regionMap[region.currency_code] || "en-US"
      : "en-US"
  try {
    const res = await fetch(
      `${process.env.STRAPI_URL}/api/fa-q?locale=${locale}&populate[Sections][populate]=*`,
      {
        next: { revalidate: 3600 },
      }
    )
    if (!res.ok) {
      throw new Error("Failed to fetch FAQ data")
    }
    const data = await res.json()
    return data.data
  } catch (error) {
    console.error("Error fetching FAQ:", error)
    return null
  }
}
export const fetchShippingPolicy = async ({
  params,
}: {
  params: { countryCode: string }
}) => {
  const { countryCode } = await params

  const region = await getRegion(countryCode)
  const locale =
    region && region.currency_code
      ? regionMap[region.currency_code] || "en-US"
      : "en-US"
  const res = await fetch(
    `${process.env.NEXT_STRAPI_URL}/api/shipping-policy?populate=*&locale=${locale}`,
    {
      next: { revalidate: 3600 },
    }
  )

  const data = await res.json()

  if (!res.ok) {
    throw new Error("Failed to fetch shipping policy")
  }

  return data
}

export const fetchContact = async ({
  params,
}: {
  params: { countryCode: string }
}) => {
  const { countryCode } = await params

  const region = await getRegion(countryCode)
  const locale =
    region && region.currency_code
      ? regionMap[region.currency_code] || "en-US"
      : "en-US"

  const res = await fetch(
    `${process.env.STRAPI_URL}/api/contact?locale=${locale}&populate=*`,
    {
      next: { revalidate: 3600 },
    }
  )

  const data = await res.json()
  if (!res.ok) {
    // throw new Error("Failed to fetch contact page details")
    console.log("Failed to fetch contact page details")
  }

  return data
}
