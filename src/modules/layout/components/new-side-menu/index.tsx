"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import {
  SheetHeader,
  SheetDescription,
} from "@modules/common/components/ui/sheet"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@modules/common/components/ui/accordion"
import { Button } from "@modules/common/components/ui/button"
import { Menu } from "lucide-react"
import { HttpTypes } from "@medusajs/types"
import CountrySelect from "../country-select"
import { listRegions } from "@lib/data/regions"
import { useToggleState } from "@medusajs/ui"
import { useRouter } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import AuthModal from "@modules/account/components/auth-modal/auth-modal"
import { useAuthModal } from "./shared-auth-modal"
import { TranslatedText } from "@modules/common/components/translation/translated-text"
import LanguageSelect from "@modules/common/components/language-select"
import { useLanguageStore } from "@lib/stores/useLanguageStore"
import * as Dialog from '@radix-ui/react-dialog';
import { cn } from "@lib/util/cn"
import { X } from "lucide-react";

enum CacheKeys {
  ParentCategories = "parent",
  ChildSubCategory = "child",
}

export enum ParentCategoriesEnum {
  Men = "Men",
  Women = "women",
  Kids = "kids",
  Life = "life",
}

interface Props {
  regions: any
}
interface MobileMenuProps {
  categoriesData: HttpTypes.StoreProductCategory[]
}
const MobileMenu = ({ categoriesData }: MobileMenuProps) => {
  const { locale } = useLanguageStore()
  const router = useRouter()
  const [region, setRegion] = useState<HttpTypes.StoreRegion[]>([])
  const [authOpen, setAuthOpen] = useState<boolean>(false)
  const toggleState = useToggleState()
  const [categories, setCategories] = useState<
    HttpTypes.StoreProductCategory[]
  >([])
  const [childSubCategories, setChildSubCategories] = useState<
    HttpTypes.StoreProductCategory[]
  >([])
  const [customer, setCustomer] = useState<any | null>(null)
  const [open, setOpen] = React.useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [filteredSelectedMenu, setFilteredSelectedMenu] = useState<any>(null)
  const [cacheCategories, setCacheCategories] = useState<
    Map<string, HttpTypes.StoreProductCategory[]>
  >(new Map())
  const [currentSelectedMenu, setCurrentSelectedMenu] =
    useState<HttpTypes.StoreProductCategory | null>(null)
  const [customerLoading, setCustomerLoading] = useState(false)

  const { openAuthModal } = useAuthModal()

  const handleMenuChange = (name: string) => {
    const menuItem =
      cacheCategories
        .get(CacheKeys.ParentCategories)
        ?.find((menu) => menu.name === name) || null
    setCurrentSelectedMenu(menuItem)
    setChildSubCategories([])
  }

  const handleCloseMenu = () => setOpen(false)

  const handleSubSubCategories = (id: string) => {
    if (cacheCategories.has(id)) {
      setChildSubCategories(cacheCategories.get(id)!)
      return cacheCategories.get(id)
    }

    const subSubCategories = categories.filter(
      (category) =>
        category.parent_category && category.parent_category.id === id
    )
    setCacheCategories((prev) => {
      const newMap = new Map(prev)
      newMap.set(id, subSubCategories)
      return newMap
    })
    setChildSubCategories(subSubCategories)
    return subSubCategories
  }

  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData)
      const ParentCategories = categoriesData.filter(
        (category) =>
          category.handle === ParentCategoriesEnum.Men ||
          category.handle === ParentCategoriesEnum.Kids ||
          category.handle === ParentCategoriesEnum.Life ||
          category.handle === ParentCategoriesEnum.Women
      )
      setCacheCategories((prev) => {
        const newMap = new Map(prev)
        newMap.set(CacheKeys.ParentCategories, ParentCategories)
        return newMap
      })
      if (categoriesData.length > 0) {
        setCurrentSelectedMenu(categoriesData[0])
      }
      setIsLoading(false)
    }
  }, [categoriesData])

  useEffect(() => {
    const fetchCustomer = async () => {
      setCustomerLoading(true)
      const result = await retrieveCustomer().catch(() => null)
      console.log(result)
      setCustomer(result)
      setCustomerLoading(false)
    }

    fetchCustomer()
  }, [open])

  useEffect(() => {
    const fetchRegions = async () => {
      const regionsData = await listRegions()
      setRegion(regionsData)
    }
    fetchRegions()
  }, [])

  useEffect(() => {
    setIsLoading(true)
    const filteredData = currentSelectedMenu?.category_children
      .sort((a, b) => {
        if (a.handle.toLowerCase().includes("designer")) return 1
        if (b.handle.toLowerCase().includes("designer")) return -1
        return 0
      })
      .filter((cat) => {
        const data = handleSubSubCategories(cat.id)
        if (data) {
          return data.length > 0
        }
      })

    setFilteredSelectedMenu(filteredData)
    setIsLoading(false)
  }, [currentSelectedMenu])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        asChild
        className="relative h-full flex items-center  hover:text-ui-fg-base lg:hidden"
      >
        <Menu size={24} />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]" />
        <Dialog.Content
          // className="z-[2000] overflow-auto max-w-[90vw] "
          className={cn(
            'fixed top-0 left-0 bottom-0 z-[200] max-w-[90%] bg-white p-6 transition-transform duration-300',
            'data-[state=open]:animate-slide-right',
            'data-[state=closed]:animate-slide-left'
          )}
        >
          <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-gray-100">
            <X className="h-4 w-4" />
          </Dialog.Close>
          <SheetHeader className="mt-12 flex flex-row items-center space-y-0">
            {cacheCategories.get(CacheKeys.ParentCategories)?.map((category) => (
              // <Button
              //   key={category.id}
              //   className={
              //     currentSelectedMenu?.name === category.name
              //       ? "bg-green-400 hover:bg-green-500"
              //       : "hover:bg-slate-100"
              //   }
              //   variant="primary"
              //   onClick={() => handleMenuChange(category.name)}
              //   size="sm"
              // >
              //   {category.name}
              // </Button>

              <Button
                className={
                  currentSelectedMenu?.name === category.name
                    ? "bg-red-700 hover:bg-red-600 text-white focus-visible:!shadow-transparent focus-visible:!outline-0"
                    : "hover:bg-slate-100"
                }
                variant="primary"
                onClick={() => handleMenuChange(category.name)}
                size="sm"
                key={category.id}
                onDoubleClick={() => {
                  setOpen(false)
                  router.push(`/categories/${category.handle}`)
                }}
              >
                <TranslatedText text={category.name} />
              </Button>
            ))}
          </SheetHeader>

          <SheetDescription asChild>
            <div className="my-2 ">
              <Accordion type="single" collapsible>
                {!isLoading &&
                filteredSelectedMenu &&
                filteredSelectedMenu?.length > 0 ? (
                  filteredSelectedMenu.map((subCategory: any) => (
                    <AccordionItem
                      key={subCategory.id}
                      value={subCategory.name}
                      onClick={() => handleSubSubCategories(subCategory.id)}
                    >
                      <AccordionTrigger className="text-base font-medium text-gray-500 hover:text-gray-900 relative">
                        <Link
                          href={`/categories/${subCategory.handle}`}
                          onClick={() => setOpen(false)}
                        >
                          <span className="capitalize">
                            <TranslatedText
                              text={
                                subCategory.name.toLowerCase() === "designers"
                                  ? "Featured Designers"
                                  : subCategory.name.toLowerCase()
                              }
                            />
                          </span>
                        </Link>
                        {/* {
                          subCategory.handle.split("-")[1] === "designers" && (
                            <Link
                              href={`/brand/${subCategory.handle
                                .replace("-designers", "")
                                .replace(/s$/, "")}`}
                              onClick={() => setOpen(false)}
                              className='text-xs capitalize font-normal text-red-500 absolute top-1/2 -translate-y-1/2'
                              style={
                                locale === "ar"
                                  ? {
                                      left: "18px",
                                    }
                                  : {
                                      right: "18px",
                                    }
                              }
                            >
                              Designers A-Z
                            </Link>
                          )
                        } */}
                      </AccordionTrigger>
                      {childSubCategories.length > 0 && (
                        <AccordionContent>
                          <div
                            className={`flex flex-col gap-y-2  ${
                              subCategory?.name === "Designers"
                                ? "h-64 overflow-auto"
                                : ""
                            }`}
                          >
                            {childSubCategories
                              .slice(0, 8)
                              .map((childSubCategory) => (
                                <Link
                                  key={childSubCategory.id}
                                  href={`/categories/${childSubCategory.handle}`}
                                  className="text-sm capitalize  text-gray-500 hover:text-gray-900"
                                  onClick={() => setOpen(false)}
                                >
                                  <TranslatedText
                                    text={childSubCategory.name.toLowerCase()}
                                  />
                                </Link>
                              ))}

                            {subCategory.handle.split("-")[1] === "designers" && (
                              <Link
                                href={`/brand/${subCategory.handle
                                  .replace("-designers", "")
                                  .replace(/s$/, "")}`}
                                onClick={() => setOpen(false)}
                                className="text-sm capitalize font-semibold text-[#C52128]"
                                style={
                                  locale === "ar"
                                    ? {
                                        left: "18px",
                                      }
                                    : {
                                        right: "18px",
                                      }
                                }
                              >
                                Designers A-Z
                              </Link>
                            )}
                          </div>
                        </AccordionContent>
                      )}
                    </AccordionItem>
                  ))
                ) : (
                  <div className="text-center text-gray-500 my-4 mt-7">
                    {!isLoading ? (
                      <p>
                        <TranslatedText text="No sub-categories found" />{" "}
                      </p>
                    ) : (
                      <p>Loading ....</p>
                    )}
                  </div>
                )}
              </Accordion>
            </div>
          </SheetDescription>
          <div className="mt-6 mb-4 flex flex-col items-center px-4">
            {/* Sign In Button */}
            <div className="w-full flex justify-center mb-4">
              {customer ? (
                <Link href="/account" className="w-full max-w-xs">
                  <button
                    className="w-full  text-white font-semibold py-2 px-6 h-10 rounded-md hover:bg-green-600 transition"
                    onClick={() => setOpen(false)}
                    style={{ backgroundColor: "#C32126" }}
                    disabled={customerLoading}
                  >
                    <TranslatedText text="My Account" />
                  </button>
                </Link>
              ) : (
                <>
                  <button
                    className="w-full text-white font-semibold py-2 px-6 h-10 rounded-md hover:bg-green-600 transition"
                    style={{ backgroundColor: "#C32126" }}
                    onClick={() => {
                      setOpen(false) // close sheet
                      setTimeout(() => {
                        openAuthModal() // open modal after sheet closes
                      }, 300) // adjust timing if needed
                    }}
                  >
                    <TranslatedText text="My Account" />
                  </button>

                  <AuthModal open={authOpen} setOpen={setAuthOpen} />
                </>
              )}
            </div>
            <div className="flex items-center mx-6 gap-1">
              <div
                className="border border-gray-200 py-2 rounded-xl w-[200px] md:w-[220px] text-ellipsis whitespace-nowrap "
                onMouseEnter={() => toggleState.toggle()}
                onMouseLeave={() => toggleState.toggle()}
              >
                {region && (
                  <CountrySelect toggleState={toggleState} regions={region} />
                )}
              </div>

              <div className="">
                <LanguageSelect />
              </div>
            </div>
          </div>
          <div className="w-full py-3">
            <Link href={"/about"} onClick={handleCloseMenu}>
              {" "}
              <p className=" text-[#6B7280] border-b py-[14px] border-gray-300">
                <TranslatedText text="About Us" />
              </p>
            </Link>
            <Link href={"/contact"} onClick={handleCloseMenu}>
              {" "}
              <p className=" text-[#6B7280] border-b py-[14px] border-gray-300">
                <TranslatedText text="Contact Us" />
              </p>
            </Link>
            <Link href={"/policies/refund-policy"} onClick={handleCloseMenu}>
              {" "}
              <p className=" text-[#6B7280] border-b py-[14px] border-gray-300">
                <TranslatedText text="Terms & Conditions" />
              </p>
            </Link>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default MobileMenu
