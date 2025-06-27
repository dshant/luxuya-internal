"use client"

import useEmblaCarousel from "embla-carousel-react"
import { EmblaOptionsType } from "embla-carousel"
import { Button } from "@modules/common/components/ui/button"
import { useCallback, useEffect, useState, useRef, useMemo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import LocalizedClientLink from "../localized-client-link"
import { HttpTypes, StoreProductCategory } from "@medusajs/types"
import useResizeObserver from "@lib/hooks/use-resize-observer"
import { Translate } from "embla-carousel/components/Translate"
import { TranslatedText } from "../translation/translated-text"

interface Props {
  category: HttpTypes.StoreProductCategory
  options?: EmblaOptionsType
}

const CategoriesSlider = ({ category }: Props) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    slidesToScroll: "auto",
    dragFree: true,
  })
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [data, setData] = useState<StoreProductCategory[]>(
    category.category_children
  )
  const [slideOffset, setSlideOffset] = useState(0)
  const { width, setElement, element } = useResizeObserver()

  useEffect(() => {
    let offset = slideOffset > 0 ? slideOffset : 0
    if (width) {
      setData(
        category.category_children.slice(
          0 + offset,
          Math.floor((width - 84) / 121) + offset
        )
      )
    } else {
      setData(category.category_children)
    }
  }, [width, slideOffset])

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        const itemsWidth = Array.from(containerRef.current.children).reduce(
          (acc, child) => {
            return acc + (child as HTMLElement).offsetWidth
          },
          0
        )
      }
    }
    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  const scrollPrev = useCallback(() => {
    if (
      !data
        .map((item) => item.id)
        .includes(category.category_children.at(0)!.id)
    ) {
      setSlideOffset((prev) => prev - 1)
    }
  }, [data])

  const scrollNext = useCallback(() => {
    if (
      !data
        .map((item) => item.id)
        .includes(category.category_children.at(-1)!.id)
    ) {
      setSlideOffset((prev) => prev + 1)
    }
  }, [data])

  return (
    <>
      <div className="relative w-full hidden md:flex items-center justify-between gap-1.5">
        <div
          className={`min-w-12 rounded-lg ${
            slideOffset === 0 ? "cursor-not-allowed bg-gray-200" : ""
          } ${
            width &&
            category.category_children.length < Math.floor((width - 84) / 121)
              ? "invisible"
              : ""
          }`}
        >
          <Button
            onClick={scrollPrev}
            disabled={slideOffset === 0}
            variant="outline"
            size="icon"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </div>

        <div ref={setElement} className="w-full">
          <div className="overflow-hidden" ref={emblaRef}>
            <div ref={containerRef} className={`flex justify-center`}>
              {data.map((child, index) => (
                <LocalizedClientLink
                  key={index}
                  href={`/categories/${child.handle}`}
                  data-testid="sort-by-link"
                >
                  <div
                    key={index}
                    className="mx-1 min-w-[80px] sm:min-w-[100px] sm:mx-3 flex-[0_0_auto]"
                  >
                    <div className="flex flex-col items-center justify-center gap-y-2">
                      <div className="relative h-24 w-24 cursor-pointer overflow-hidden rounded-full border-2 transition-all duration-150 ease-in-out hover:border-gray-700">
                        <img
                          src={
                            (child?.metadata?.thumbnail as string) ||
                            `https://placehold.co/800?text=${child.name}&font=roboto`
                          }
                          alt={child.name}
                          className="h-full w-full object-cover"
                          width="100%"
                          height="100%"
                        />
                      </div>
                      <h3 className="whitespace-nowrap text-sm">
                        <TranslatedText text={child.name} />
                      </h3>
                    </div>
                  </div>
                </LocalizedClientLink>
              ))}
            </div>
          </div>
        </div>

        <div
          className={`min-w-12 rounded-lg ${
            data
              .map((item) => item.id)
              .includes(category.category_children.at(-1)!.id)
              ? "cursor-not-allowed bg-gray-200"
              : ""
          } ${
            width &&
            category.category_children.length < Math.floor((width - 84) / 121)
              ? "invisible"
              : ""
          }`}
        >
          <Button
            onClick={scrollNext}
            variant="outline"
            size="icon"
            disabled={data
              .map((item) => item.id)
              .includes(category.category_children.at(-1)!.id)}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>
      <div className="flex gap-1.5 md:hidden flex-nowrap overflow-auto mobileCategories">
        {data.map((child, index) => (
          <LocalizedClientLink
            key={index}
            href={`/categories/${child.handle}`}
            data-testid="sort-by-link"
          >
            <div
              key={index}
              className="mx-1 min-w-[80px] sm:min-w-[100px] sm:mx-3 flex-[0_0_auto]"
            >
              <div className="flex flex-col items-center justify-center gap-y-2">
                <div className="relative h-24 w-24 cursor-pointer overflow-hidden rounded-full border-2 transition-all duration-150 ease-in-out hover:border-gray-700">
                  <img
                    src={
                      (child?.metadata?.thumbnail as string) ||
                      `https://placehold.co/800?text=${child.name}&font=roboto`
                    }
                    alt={child.name}
                    className="h-full w-full object-cover"
                     width="100%"
                     height="100%"
                  />
                </div>
                <h3 className="whitespace-nowrap text-sm"><TranslatedText text={child.name} /></h3>
              </div>
            </div>
          </LocalizedClientLink>
        ))}
      </div>
    </>
  )
}

export default CategoriesSlider
