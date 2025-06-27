import { NextRequest, NextResponse } from "next/server"
import { fetchContact } from "@lib/data/strapi"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const countryCode = searchParams.get("countryCode")

    if (!countryCode) {
      return NextResponse.json(
        { error: "Missing countryCode parameter" },
        { status: 400 }
      )
    }
    const categories = await fetchContact({ params: { countryCode } })
    //const categories = await fetchContact( {params});
    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    )
  }
}
