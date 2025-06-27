"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetDescription,
  SheetTitle,
} from "@modules/common/components/ui/sheet"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@modules/common/components/ui/accordion"


import { Button } from "@modules/common/components/ui/button"
import { Menu } from "lucide-react"
import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { usePathname } from "next/navigation"
import { listCategories } from "@lib/data/categories"

enum CacheKeys {
  ParentCategories = "parent",
  ChildSubCategory = "child",
}

const MobileMenu = async () => {
  const [categories, setCategories] = useState<
    HttpTypes.StoreProductCategory[]
  >([])
  const [ChildSubCategories, setChildSubCategories] = useState<
    HttpTypes.StoreProductCategory[]
  >([])
  const [cacheCategories, setCacheCategories] = useState<
    Map<string, HttpTypes.StoreProductCategory[]>
  >(new Map())

  const params=usePathname()

const product_categories = await listCategories()
  useEffect(() => {

    sdk.store.category.list().then((response) => {
      const parentCategories = response.product_categories.filter(
        (category) => category.parent_category === null
      )
      setCacheCategories((previous) => {
        const newCacheMap = new Map(previous)
        newCacheMap.set(CacheKeys.ParentCategories, parentCategories)
        return newCacheMap
      })
      setCurrentSelectedMenu(parentCategories[0])
      setCategories(response.product_categories)
    })
  }, [])

  const [currentSelectedMenu, setCurrentSelectedMenu] = useState(categories[0])

  const handleMenuChange = (name: string) => {
    const menuItem =
      cacheCategories
        .get(CacheKeys.ParentCategories)!
        .find((menu) => menu.name === name) || categories[0]
    setCurrentSelectedMenu(menuItem)
  }

  const handleSubSubCategories = (id: string) => {
    if (cacheCategories.get(id)) {
      setChildSubCategories(cacheCategories.get(id)!)
      return
    }
    const subSubCategories = categories.filter(
      (category) =>
        category.parent_category && category.parent_category.id === id
    )
    setCacheCategories((previous) => {
      const newMap = new Map(previous)
      newMap.set(id, subSubCategories)
      return newMap
    })
    setChildSubCategories(subSubCategories)
  }

  return (
    <Sheet>
      <SheetTrigger className="block h-10 bg-white p-2 hover:bg-gray-100 md:hidden">
        <Menu size={12} />
      </SheetTrigger>
      <SheetContent side="left" className="z-[2000] overflow-y-auto">
        <SheetHeader className="mt-12 flex flex-row items-center gap-x-2 space-y-0">
          <SheetTitle></SheetTitle>
          {cacheCategories.get(CacheKeys.ParentCategories)?.map((category) => (
            <Button
              className={
                currentSelectedMenu &&
                currentSelectedMenu.name === category.name
                  ? "bg-green-400 hover:bg-green-500"
                  : "hover:bg-slate-100"
              }
              key={category.id}
              variant={"primary"}
              onClick={() => handleMenuChange(category.name)}
              size="sm"
            >
              {category.name}
            </Button>
          ))}
        </SheetHeader>
   
        <SheetDescription>
          <div className="my-2">
            <Accordion type="single" collapsible>
              {currentSelectedMenu &&
              currentSelectedMenu.category_children.length > 0 ? (
                currentSelectedMenu?.category_children?.map((subCategory) => (
                  <AccordionItem
                    key={subCategory.id}
                    value={subCategory.name}
                    onClick={() => handleSubSubCategories(subCategory.id)}
                  >
                    <AccordionTrigger className="text-base font-medium text-gray-500 hover:text-gray-900">
                      <Link href={`/categories/${subCategory.handle}`}>
                        {subCategory.name}
                      </Link>
                    </AccordionTrigger>
                    {ChildSubCategories && ChildSubCategories.length > 0 && (
      
                      <AccordionContent>
                        <div className="flex flex-col gap-y-2">
                          {ChildSubCategories.map((childSubCategory) => (
                            <Link
                              key={childSubCategory.id}
                              href={`/categories/${childSubCategory.handle}`}
                              className="text-sm text-gray-500 hover:text-gray-900"
                            >
                              {childSubCategory.name}
                            </Link>
                          ))}
                        </div>
                      </AccordionContent>
                    )}
                  </AccordionItem>
                ))
              ) : (

                <div className="text-center text-gray-500 my-4 mt-7">
                  <p>No sub-categories found</p>
                </div>
              )}
            </Accordion>
          </div>
        </SheetDescription>
      </SheetContent>
    </Sheet>
  )
}

export default MobileMenu

