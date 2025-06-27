

import { NextResponse } from "next/server";
import { listCategories } from "@lib/data/categories"; 

export async function GET() {
  try {
    const categories = await listCategories( {limit: 1000});
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
