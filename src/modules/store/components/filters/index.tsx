"use client"

import React, { useEffect, useState } from "react"
import { Box } from "@modules/common/components/box"
import Divider from "@modules/common/components/divider"
import FilterWrapper from "./filter-wrapper"
import { FilterItems } from "./filter-wrapper/filter-item"
import { Button } from "@modules/common/components/button"
import { useClearFiltersUrl } from "@lib/hooks/use-clear-filters-url"
import Link from "next/link"
import FilterPopover from "./filter-popover"
import { TranslatedText } from "@modules/common/components/translation/translated-text"
import { FacetDistribution } from "@meilisearch/instant-meilisearch/dist/types/types"

interface ProductFiltersProps {
  facets: FacetDistribution | undefined
  isLg: boolean
  setIsOpen?: (isOpen: boolean) => void
  selectedFilters: { [key: string]: string[] }
  updateFilters: (param: string, values: string[]) => void
  applyFilters: () => void
}

export default function ProductFilters({
  facets,
  isLg = false,
  setIsOpen,
  selectedFilters,
  updateFilters,
  applyFilters,
}: ProductFiltersProps) {
  const clearAllUrl = useClearFiltersUrl()

  const filters = [
    {
      title: "Brands",
      param: "brand",
    },
    {
      title: "Size",
      param: "size",
    },
    {
      title: "Colors",
      param: "color",
    },
  ]

  return (
    <>
      <Box
        className={`flex ${
          isLg ? "flex-row relative" : "flex-col"
        } gap-4 bg-white px-5 py-2`}
      >
        {isLg ? (
          <>
            {filters.map((filter, index) => (
              <FilterPopover
                title={filter.title}
                key={index}
                content={
                  <div className="hidden lg:flex w-[300px] flex-col">
                    <FilterItems
                      param={filter.param}
                      facets={facets}
                      selectedFilters={selectedFilters}
                      updateFilters={updateFilters}
                      isLg={isLg}
                    />
                    {isLg && (
                      <div className="flex px-4 py-4 w-[300px] bg-white z-50 ">
                        <Button
                          variant="tonal"
                          id="clearFilter"
                          onClick={() => setIsOpen?.(false)}
                          asChild
                          className="bg-gray-300 mr-2  focus:ring-2 focus:ring-gray-400 active:bg-gray-400 transition-all"
                        >
                          <Link href={clearAllUrl}>
                            <TranslatedText text="Clear filters" />
                          </Link>
                        </Button>
                        <Button
                          onClick={() => {
                            applyFilters()
                          }}
                          className="bg-red-500 hover:bg-red-600 focus:ring-2 focus:ring-red-500 active:bg-red-700 transition-all text-white"
                        >
                          <TranslatedText text="View products" />
                        </Button>
                      </div>
                    )}
                  </div>
                }
              />
            ))}
          </>
        ) : (
          <>
            {filters.map((filter, index) => (
              <div key={index}>
                <FilterWrapper
                  title={filter.title}
                  content={
                    <div className="flex w-[300px] flex-col">
                      <FilterItems
                        param={filter.param}
                        facets={facets}
                        selectedFilters={selectedFilters}
                        updateFilters={updateFilters}
                        isLg={isLg}
                      />
                      {isLg && (
                        <div className="flex px-4 py-4 w-[300px] bg-white z-50 ">
                          <Button
                            variant="tonal"
                            id="clearFilter"
                            onClick={() => setIsOpen?.(false)}
                            asChild
                            className="bg-gray-300 mr-2  focus:ring-2 focus:ring-gray-400 active:bg-gray-400 transition-all"
                          >
                            <Link href={clearAllUrl}>
                              <TranslatedText text="Clear filters" />
                            </Link>
                          </Button>
                          <Button
                            onClick={() => {
                              applyFilters()
                            }}
                            className="bg-red-500 hover:bg-red-600 focus:ring-2 focus:ring-red-500 active:bg-red-700 transition-all text-white"
                          >
                            <TranslatedText text="View products" />
                          </Button>
                        </div>
                      )}
                    </div>
                  }
                />
                <Divider />
              </div>
            ))}
          </>
        )}
      </Box>
      <div className={`absolute ${isLg ? "hidden" : ""} bottom-5 w-full px-5`}>
        <div className="grid grid-cols-2 gap-4 w-full">
          <Button
            variant="tonal"
            id="clearFilter"
            onClick={() => setIsOpen?.(false)}
            asChild
            className="bg-gray-300 mr-2 focus:ring-2 focus:ring-gray-400 active:bg-gray-400 transition-all"
          >
            <Link href={clearAllUrl}>
              <TranslatedText text="Clear filters" />
            </Link>
          </Button>
          <Button
            onClick={() => {
              applyFilters()
              setIsOpen?.(false)
            }}
            className="bg-red-500 hover:bg-red-600 focus:ring-2 focus:ring-red-500 active:bg-red-700 transition-all text-white"
          >
            <TranslatedText text="View products" />
          </Button>
        </div>
      </div>
    </>
  )
}
