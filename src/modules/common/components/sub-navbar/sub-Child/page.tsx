import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { HttpTypes } from "@medusajs/types"
import { Dispatch, SetStateAction } from "react"
import { KidsCategoryHandle } from "@lib/constants"

interface CategoryDetailProps {
  subCategory: HttpTypes.StoreProductCategory[]
  toggle: boolean
  SettoggleState: (state: boolean) => void
  parentName: string
  selectedCategory: string | null
  setHoveredCategory: Dispatch<SetStateAction<string | null>>
}

const CategoryDetail: React.FC<CategoryDetailProps> = ({
  subCategory,
  SettoggleState,
  toggle,
  parentName: SubParentName,
  selectedCategory,
  setHoveredCategory,
}) => {
  const filteredSubCategories = subCategory
    .filter((category) => category.category_children.length > 0)
    .sort((a, b) => {
      const aIsDesigner =
        a.name.toLowerCase().includes("designers") ||
        a.handle.toLowerCase().includes("designers")
      const bIsDesigner =
        b.name.toLowerCase().includes("designers") ||
        b.handle.toLowerCase().includes("designers")
      if (aIsDesigner === bIsDesigner) return 0
      return aIsDesigner ? 1 : -1
    })

  const hasDesigners = filteredSubCategories.some(
    (category) =>
      category.name.toLowerCase().includes("designers") ||
      category.handle.toLowerCase().includes("designers")
  )

  return (
    <AnimatePresence>
      {toggle && subCategory && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          onMouseEnter={() => {
            setHoveredCategory(selectedCategory)
            SettoggleState(true)
          }}
          className="absolute left-0 top-14 z-50 mx-auto h-auto overflow-auto w-full border border-gray-100 bg-gray-50 py-5"
        >
          <div className="flex w-full justify-center gap-10 mx-auto max-w-[1440px] overflow-x-hidden">
            <div className="flex flex-wrap h-auto gap-x-10 gap-y-2 pb-8">
              {filteredSubCategories.map((subMenuItem) => (
                <div
                  key={subMenuItem.handle}
                  className="flex flex-col gap-y-2 text-left"
                >
                  <Link
                    href={
                      subMenuItem.name.toLowerCase() === "designers"
                        ? `/brand/${subMenuItem.handle
                            .replace("-designers", "")
                            .replace(/s$/, "")}`
                        : `/categories/${subMenuItem.handle}`
                    }
                    className="text-base capitalize font-medium text-[#C52128]"
                  >
                    {subMenuItem.name.toLowerCase() === "designers"
                      ? "Featured Designers"
                      : subMenuItem.name.toLowerCase()}
                  </Link>

                  {subMenuItem.category_children.length > 0 && (
                    <ChildCategories
                      subChildCategory={subMenuItem.category_children}
                      parentHandle={subMenuItem.handle}
                    />
                  )}
                </div>
              ))}
              {!hasDesigners && (
                <div className="flex flex-col gap-y-2 text-left">
                  <Link
                    href="/brand/kids"
                    className="text-base capitalize font-medium text-[#C52128]"
                  >
                    Featured Designers
                  </Link>
                  <div className="flex flex-col gap-y-1">
                    {SubParentName.toLowerCase().includes("kids") ? (
                      <>
                        {KidsCategoryHandle.map((item) => (
                          <Link
                            key={item.productName}
                            href={item.link}
                            className="text-sm text-gray-400 hover:text-gray-600"
                          >
                            {item.productName}
                          </Link>
                        ))}
                        <Link
                          href="/brand/kids"
                          className="text-base capitalize font-medium text-[#C52128] hover:underline mt-1"
                        >
                          Designer A-Z
                        </Link>
                      </>
                    ) : (
                      <>
                        {KidsCategoryHandle.map((item) => (
                          <Link
                            key={item.productName}
                            href={item.link}
                            className="text-sm text-gray-400 hover:text-gray-600"
                          >
                            {item.productName}
                          </Link>
                        ))}
                        <Link
                          href="/brand/kids"
                          className="text-base capitalize font-medium text-[#C52128] hover:underline mt-1"
                        >
                          Designer A-Z
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface ChildCategoriesProps {
  subChildCategory: HttpTypes.StoreProductCategory[]
  parentHandle: string
}

const ChildCategories: React.FC<ChildCategoriesProps> = ({
  subChildCategory,
  parentHandle,
}) => {
  const ifDesigners = parentHandle.split("-")[1] === "designers"
  const visibleChildren = ifDesigners
    ? subChildCategory.slice(0, 10)
    : subChildCategory

  const hasMore = subChildCategory.length > 10

  return (
    <div className="flex flex-col gap-y-1">
      {visibleChildren.map((child) => (
        <Link
          key={child.id}
          href={`/categories/${child.handle}`}
          className="text-sm text-gray-400 hover:text-gray-600"
        >
          {child.name}
        </Link>
      ))}

      {ifDesigners && hasMore && (
        <Link
          href={`/brand/${parentHandle
            .replace("-designers", "")
            .replace(/s$/, "")}`}
          className="text-base capitalize font-medium text-[#C52128] hover:underline mt-1"
        >
          Designer A-Z
        </Link>
      )}
    </div>
  )
}

export default CategoryDetail
