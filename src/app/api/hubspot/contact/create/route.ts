import { NextResponse } from "next/server"

const HUBSPOT_ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN!

export async function POST(req: Response) {
  const { email } = await req.json()

  if (!email) {
    return NextResponse.json({ message: "Missing email" }, { status: 400 })
  }

  try {
    const hubspotRes = await fetch(
      "https://api.hubapi.com/crm/v3/objects/contacts",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          properties: {
            email: email,
          },
        }),
      }
    )

    const data = await hubspotRes.json()

    if (!hubspotRes.ok) {
      return NextResponse.json(
        { message: data.message || "HubSpot API error" },
        { status: hubspotRes.status }
      )
    }

    const contact = data
    if (!contact) {
      return NextResponse.json(
        { message: "Contact not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { id: contact.id, properties: contact.properties },
      { status: 200 }
    )
  } catch (err: any) {
    console.error("Unexpected error:", err.message)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}
