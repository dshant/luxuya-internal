import SearchModal from "@modules/search/templates/search-modal"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Search",
  description: "Search from more than 40000+ products",
}

export default function SearchModalRoute() {
  return <SearchModal />
}