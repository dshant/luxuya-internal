import { Metadata, ResolvingMetadata } from "next"
import SearchResultsTemplate from "@modules/search/templates/search-results-template"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { safeDecodeURIComponent } from "@lib/util/safe-decode-uri"

type Props = {
  params: Promise<{ query: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const { query } = await params
  const decodedQuery = safeDecodeURIComponent(query)

  return {
    title: `Search Results - ${decodedQuery}`,
    description: `Search results for ${decodedQuery}`,
    robots: {
      index: true,
      follow: true,
    },
  }
}

type Params = {
  params: Promise<{ query: string; countryCode: string }>
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    gender?: string
  }>
}

export default async function SearchResults(props: Params) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { query } = params
  const decodedQuery = safeDecodeURIComponent(query)
  const { page } = searchParams

  return (
    <SearchResultsTemplate
      query={decodedQuery}
      page={page}
      searchParams={searchParams}
      countryCode={params.countryCode}
    />
  )
}
