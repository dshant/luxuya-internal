"use client"
import { BrandSearch } from "./brand-search"
import { useState } from "react"

const Main = ({
  characters,
  groupedBrands,
  categorySlug,
}: {
  characters: string[]
  groupedBrands: Record<string, { name: string; count: number }[]>
  categorySlug: string
}) => {
  const [searchTerm, setSearchTerm] = useState("")

  const handleBrandClick = (brandName: string): string => {
    return `/categories/${categorySlug}?brand=${encodeURIComponent(brandName)}`
  }

  return (
    <div className="sm:flex justify-between sm:pt-8">
      {/* Sidebar Search */}
      <div className="mb-8 sm:w-1/4">
        <div className="sticky top-[10rem] z-20 w-full max-w-md">
          <BrandSearch setSearchTerm={setSearchTerm} searchTerm={searchTerm} />
        </div>
      </div>

      {/* Brands Listing */}
      <div className="sm:w-[70%] space-y-10 sm:pr-4">
          
        {characters
          .filter(
            (e) =>
              !searchTerm ||
              searchTerm.toLocaleLowerCase().charAt(0) ===
                e.toLocaleLowerCase() ||
              (searchTerm &&
                searchTerm
                  .toLocaleLowerCase()
                  .charAt(0)
                  .match(/[^a-z]/i) &&
                e === "0-9")
          )
          .map(
            (char) =>
              groupedBrands[char].length > 0 && (
                <div key={char} id={`section-${char}`}>
                  <div className="font-semibold text-lg mb-4">{char}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2">
                    {groupedBrands[char]
                      .filter(
                        (e) =>
                          !searchTerm ||
                          e.name
                            .toLocaleLowerCase()
                            .startsWith(searchTerm.toLocaleLowerCase())
                      )
                      .map((brand) => (
                        <a
                          key={brand.name}
                          href={handleBrandClick(brand.name)}
                          target="_blank"
                          className="text-left text-black text-base font-medium hover:text-[#c52129] cursor-pointer flex items-center gap-2"
                        >
                          {brand.name}
                        </a>
                      ))}
                  </div>
                </div>
              )
          )}
      </div>
    </div>
  )
}

export default Main
