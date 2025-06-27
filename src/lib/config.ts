import Medusa from "@medusajs/js-sdk"
import { MeiliSearch } from "meilisearch"

// Defaults to standard port for Medusa server
let MEDUSA_BACKEND_URL = "https://portal.lfyfashion.com"

if (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
}

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})

export const meiliSearchClient = new MeiliSearch({
  host: process.env.NEXT_PUBLIC_MEILISEARCH_HOST || "",
  apiKey: process.env.NEXT_PUBLIC_MEILISEARCH_API_KEY || "",
})
