import { getBrandsForCategory } from "@lib/data/meiliSearch"
import { Metadata } from "next"
import { getRegion } from "@lib/data/regions"
import { notFound } from "next/navigation"
import { getBaseURL } from "@lib/util/env"
import Button from "./button"
import Main from "./main"

type Props = {
  params: Promise<{ countryCode: string; slug: string[] }>
}
const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").concat("0-9")

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const slug = params.slug[0]

  if (!slug) notFound()

  const region = await getRegion(params.countryCode)

  if (!region) notFound()

  return {
    title: `${slug} | Luxury For You`,
    description: slug || "Luxury For You",
    alternates: {
      canonical: new URL(getBaseURL()),
    },
    openGraph: {
      title: `${slug} | Luxury For You`,
      description: slug || "Luxury For You",
      images: [],
      type: "website",
      url: `${getBaseURL()}/${params.countryCode}/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function BrandsPage({
  params,
}: {
  params: { slug: string[] }
}) {
  const categorySlug = params.slug[params.slug.length - 1]
  const brands = await getBrandsForCategory(categorySlug)
  const allBrands = brands?.brands || {}

  const groupedBrands = characters.reduce(
    (groups: Record<string, { name: string; count: number }[]>, char) => {
      groups[char] = []
      return groups
    },
    {}
  )

  Object.entries(allBrands).forEach(([name, count]) => {
    const firstChar = name?.charAt(0)?.toUpperCase() || "0-9"
    const groupKey = /[A-Z]/.test(firstChar) ? firstChar : "0-9"
    groupedBrands[groupKey].push({ name, count })
  })

  return (
    <div className="my-10 px-4 sm:px-8 pt-0">
      {/* Alphabet navigation */}
      <div className="overflow-x-auto wrapper-scroll flex w-full justify-between mb-6 sticky top-[56px] z-30 bg-white border-b pb-2">
        {characters.map((char) => (
          <Button key={char} char={char} />
        ))}
      </div>

      {/* Main content */}
      <Main
        characters={characters}
        groupedBrands={groupedBrands}
        categorySlug={categorySlug}
      />
    </div>
  )
}
