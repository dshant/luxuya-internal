"use client"
import ProductCard from "../../products/components/ProductCard"
import { Pagination } from "@modules/store/components/pagination"
import { meiliSearchProduct } from "types/global"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { StoreRegion } from "@medusajs/types"
export default function PaginatedProducts({
  pageNumber,
  region,
  meiliSearchProducts,
  totalPages,
  productPerPage,
}: {
  pageNumber: number
  region: StoreRegion | null | undefined
  meiliSearchProducts: meiliSearchProduct[]
  totalPages: number
  productPerPage: number
}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const handlePrevPage = () => {
    if (pageNumber > 1) {
      const params = new URLSearchParams(searchParams)
      params.set("page", (pageNumber - 1).toString())
      router.push(`${pathname}?${params.toString()}`)
    }
  }
  const handleNextPage = () => {
    if (pageNumber < totalPages - 1) {
      const params = new URLSearchParams(searchParams)
      params.set("page", (pageNumber + 1).toString())
      router.push(`${pathname}?${params.toString()}`)
    }
  }
  const handleLastPage = () => {
    const params = new URLSearchParams(searchParams)
    params.set("page", totalPages.toString())
    router.push(`${pathname}?${params.toString()}`)
  }
  if (!region) {
    return null
  }
  return (
    <>
      <ul
        className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8"
        data-testid="products-list"
      >
        {meiliSearchProducts?.map((product) => {
          return (
            <li key={product.id}>
              <ProductCard meiliSearchProduct={product} region={region} />
            </li>
          )
        })}
      </ul>
      <div className="flex items-center flex-col md:flex-row gap-3">
        <div className="flex justify-between sm:flex-grow flex-col md:flex-row gap-3">
          <div className="flex justify-center items-center">
            <span>
              {(pageNumber - 1) * productPerPage + 1} – {" "}
              {Math.min(pageNumber * productPerPage, totalPages * productPerPage)} of{" "}
              {totalPages * productPerPage} results
            </span>
          </div>
          <div className="flex justify-center">
            <p>{`${pageNumber} of ${totalPages} pages`}</p>
          </div>
        </div>
        <div className="flex justify-center items-center gap-6 pl-5">
          <div>
            <button
              onClick={handlePrevPage}
              disabled={pageNumber <= 1}
              className="hover:underline disabled:text-gray-400"
            >
              Prev
            </button>
          </div>
          <div className="flex justify-center">
            {totalPages > 1 && (
              <Pagination
                data-testid="product-pagination"
                page={pageNumber}
                totalPages={totalPages}
              />
            )}
          </div>
          <div>
            <button
              onClick={handleNextPage}
              disabled={pageNumber >= totalPages}
              className="hover:underline disabled:text-gray-400"
            >
              Next
            </button>
          </div>
        </div>

      </div>
    </>
  )
}
