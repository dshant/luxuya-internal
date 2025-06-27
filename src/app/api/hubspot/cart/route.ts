// app/api/hubspot/cart/route.ts
import { NextResponse } from "next/server"

const HUBSPOT_ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN!

export async function POST(req: Request) {
  try {
    const {
      cartName,
      cartId, // maps to hs_external_cart_id
      discount, // maps to hs_cart_discount
      currency, // maps to hs_cart_currency_code
      totalPrice, // maps to hs_cart_total (in cents)
      associateToId, // contact ID or email (object association)
      cartStatus,
      createdAt,
    } = await req.json()

    if (!cartId || !associateToId || !cartName) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      )
    }

    const response = await fetch(
      "https://api.hubapi.com/crm/v3/objects/carts",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          associations: [
            {
              to: {
                id: associateToId, // this should be the **contact ID**, not email
              },
              types: [
                {
                  associationCategory: "HUBSPOT_DEFINED",
                  associationTypeId: 586, // Contact-to-Cart
                },
              ],
            },
          ],
          properties: {
            hs_cart_name: cartName,
            hs_external_cart_id: cartId,
            hs_cart_discount: String(discount ?? 0),
            hs_currency_code: currency,
            hs_total_price: String(totalPrice), // in cents
            hs_external_status: cartStatus,
            hs_createdate: createdAt,
          },
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "HubSpot API error" },
        { status: response.status }
      )
    }

    return NextResponse.json(
      { id: data.id, properties: data.properties },
      { status: 201 }
    )
  } catch (err) {
    console.error("HubSpot cart create error:", err)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request) {
  try {
    const {
      hsCartId,
      discount, // maps to hs_cart_discount
      totalPrice, // maps to hs_cart_total (in cents)
      cartStatus,
    } = await req.json()

    // Construct properties object conditionally
    const properties: Record<string, string> = {
      hs_external_status: cartStatus,
    }

    if (typeof discount !== "undefined") {
      properties.hs_cart_discount = String(discount)
    }

    if (typeof totalPrice !== "undefined") {
      properties.hs_total_price = String(totalPrice)
    }

    const response = await fetch(
      `https://api.hubapi.com/crm/v3/objects/carts/${hsCartId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          properties,
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "HubSpot API error" },
        { status: response.status }
      )
    }

    return NextResponse.json(
      { id: data.id, properties: data.properties },
      { status: 201 }
    )
  } catch (err) {
    console.error("HubSpot cart create error:", err)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}
