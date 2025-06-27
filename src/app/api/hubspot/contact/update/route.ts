import { NextResponse } from "next/server"

const HUBSPOT_ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN!

export async function PATCH(req: Request) {
  try {
    const { contactId, newEmail } = await req.json()

    if (!contactId || !newEmail) {
      return NextResponse.json(
        { message: "Missing contactId or newEmail" },
        { status: 400 }
      )
    }

    const hubspotRes = await fetch(
      `https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          properties: {
            email: newEmail,
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

    return NextResponse.json(
      { message: "Contact updated successfully", data },
      { status: 200 }
    )
  } catch (err) {
    console.error("HubSpot update error:", err)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}
