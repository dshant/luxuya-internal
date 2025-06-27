"use server";

import { SEARCH_INDEX_NAME, searchClient } from "@lib/search-client";

export interface Hits {
  readonly objectID?: string;
  id?: string;
  [x: string | number | symbol]: unknown;
}

/**
 * Uses MeiliSearch to search for a query with pagination
 * @param {string} query - search query
 * @param {number} page - current page number (1-based index)
 * @param {number} perPage - number of items per page
 */
export async function search(query: string, page: number = 1, perPage: number = 20) {

  const queries = [
    {
      params: {
        query, 
        page: page - 1, // Meilisearch pages start from 0
        hitsPerPage: perPage, // Instead of limit
        attributesToRetrieve: ["id"],
      },
      indexName: SEARCH_INDEX_NAME,
    },
  ];

  const { results } = (await searchClient.search(queries)) as Record<string, any>;
  const { hits, nbHits } = results[0] as { hits: Hits[]; nbHits: number };


  return {
    hits,
    total: nbHits,
    totalPages: Math.ceil(nbHits / perPage),
    currentPage: page,
    perPage,
  };
}
