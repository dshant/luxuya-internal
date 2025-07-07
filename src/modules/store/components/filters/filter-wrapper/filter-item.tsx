"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { Label } from "@modules/common/components/label"
import clsx from "clsx"
import Checkbox from "@modules/common/components/checkbox"
import { TranslatedText } from "@modules/common/components/translation/translated-text"
import { FacetDistribution } from "@meilisearch/instant-meilisearch/dist/types/types"

type CheckboxProps = {
  param: string
  facets: FacetDistribution | undefined
  selectedFilters: { [key: string]: string[] }
  updateFilters: (param: string, values: string[]) => void
  isLg: boolean
}

export const FilterItems: React.FC<CheckboxProps> = ({
  param,
  facets,
  selectedFilters,
  updateFilters,
  isLg,
}) => {
  const brandsFacetArray = Object.entries(facets?.brand || {}).map(([id]) => ({
    id,
    value: id,
  }))
  const sizeFacetArray = Object.entries(facets?.sizes || {}).map(([id]) => ({
    id,
    value: id,
  }))
  const colorFacetArray = Object.entries(facets?.colors || {}).map(([id]) => ({
    id,
    value: id,
  }))

  const sortedArray =
    param === "brand"
      ? brandsFacetArray
      : param === "size"
      ? sizeFacetArray
      : param === "color"
      ? colorFacetArray
      : []

  const pathName = usePathname()
  const urlOnBrandFilter = (brand: string): string => {
    return `/categories/${
      pathName.split("/").pop()?.split("-")[0]
    }?brand=${encodeURIComponent(brand)}`
  }
  // const pathname = usePathname()
  // const searchParams = useSearchParams()

  // const values = searchParams.get(param)?.split(",") ?? []

  // const searchParamsObj = omit(
  //   Object.fromEntries(searchParams.entries()),
  //   "page"
  // )
  // const brandsFacetArray: { id: string; value: string; disabled?: boolean }[] =
  //   Object.entries(facets.brand).map(([id]) => ({
  //     id,
  //     value: id,
  //   }))

  // const sizeFacetArray: { id: string; value: string; disabled?: boolean }[] =
  //   Object.entries(facets.sizes).map(([id]) => ({
  //     id,
  //     value: id,
  //   }))

  // const colorFacetArray: { id: string; value: string; disabled?: boolean }[] =
  //   Object.entries(facets.colors).map(([id]) => ({
  //     id,
  //     value: id,
  //   }))

  // const sortedArray =
  //   param !== "price"
  //     ? param === "brand"
  //       ? brandsFacetArray.sort((a, b) => a.value.localeCompare(b.value))
  //       : param === "size"
  //       ? sizeFacetArray.sort((a, b) => a.value.localeCompare(b.value))
  //       : param === "color"
  //       ? colorFacetArray.sort((a, b) => a.value.localeCompare(b.value))
  //       : []
  //     : []

  //   return (
  //     <ul className="flex flex-col px-2 bg-white">
  //       {sortedArray.map((item) => {
  //         const checked = values.includes(item.id)
  //         const DynamicTag = item.disabled ? "li" : Link

  //         const newValues = checked
  //           ? values
  //               .filter((v) => v !== item.id)
  //               .sort()
  //               .join(",")
  //           : [...values, item.id].sort().join(",")

  //         const newSearchParamsObject = newValues.length
  //           ? { ...searchParamsObj, [param]: newValues }
  //           : omit(searchParamsObj, param)

  //         const href = createUrl(
  //           pathname,
  //           new URLSearchParams(newSearchParamsObject)
  //         )

  //         return (
  //           <DynamicTag
  //             className={clsx(
  //               "flex items-center gap-2 p-1 pr-[90px] text-basic-primary transition-opacity",
  //               {
  //                 "pointer-events-none text-disabled opacity-50": item.disabled,
  //                 " hover:bg-gray-200": !item.disabled,
  //               }
  //             )}
  //             href={href}
  //             scroll={false}
  //             key={item.id}
  //             data-testid={formatNameForTestId(`${item.value}-filter-item`)}
  //           >
  //             <div>
  //               <Checkbox
  //                 //@ts-ignore
  //                 id={`${param}-${item.id}`}
  //                 role="checkbox"
  //                 type="button"
  //                 checked={checked}
  //                 aria-checked={checked}
  //                 name={item.value}
  //                 disabled={item.disabled}
  //               />
  //             </div>
  //             <Label
  //               htmlFor={`${param}-${item.id}`}
  //               size="lg"
  //               className={clsx(
  //                 "cursor-pointer text-basic-primary transition-opacity",
  //                 {
  //                   "pointer-events-none text-disabled ": item.disabled,
  //                 }
  //               )}
  //             >
  //               {item.value}
  //             </Label>
  //           </DynamicTag>
  //         )
  //       })}
  //     </ul>
  //   )
  // }
  return (
    <ul
      className={`flex flex-col ${
        isLg ? "max-h-[200px] overflow-auto" : ""
      } px-2 bg-white`}
    >
      {sortedArray.map((item) => {
        const checked = selectedFilters[param]?.includes(item.id) ?? false

        // Toggle filter selection
        const handleChange = () => {
          const updatedValues = checked
            ? selectedFilters[param].filter((v) => v !== item.id)
            : [...(selectedFilters[param] || []), item.id]

          updateFilters(param, updatedValues)
        }

        return (
          <li
            key={item.id}
            onClick={handleChange}
            className={clsx(
              "flex items-center gap-2 p-1 text-basic-primary transition-opacity cursor-pointer"
              // { "pointer-events-none text-disabled opacity-50": item.disabled }
            )}
          >
            <div>
              <Checkbox
                id={`${param}-${item.id}`}
                role="checkbox"
                type="button"
                checked={checked}
                aria-checked={checked}
                name={item.value}
                disabled={false}
                // onChange={handleChange}
                label={""}
              />
            </div>
            <Label
              htmlFor={`${param}-${item.id}`}
              size="lg"
              className="cursor-pointer"
            >
              {/* {param === "brand" ? (
                <Link
                  href={urlOnBrandFilter(item.value)}
                  className="text-lg"
                  target="_blank"
                >
                  <TranslatedText text={item.value} />
                </Link>
              ) : ( */}
                <TranslatedText text={item.value} />
              {/* )} */}
            </Label>
          </li>
        )
      })}
    </ul>
  )
}
