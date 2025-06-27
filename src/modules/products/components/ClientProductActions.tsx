"use client"
import React, { Suspense, useCallback, useEffect, useState } from "react"
import { Button } from "@modules/common/components/ui/button"
import { HttpTypes } from "@medusajs/types"
import { motion } from "framer-motion"
import ProductImage from "./ProductImage"
import Image from "next/image"
import ProductActions from "./list-product-preview-actions"
import ProductPrice from "./product-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { SizeChartModal } from "./sizeChartModal"
import { analytics } from "@lib/context/segment"
import { meiliSearchProduct } from "types/global"
import ProductDiscount from "./product-discount"
import { TranslatedText } from "@modules/common/components/translation/translated-text"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"


const ClientProductActions = ({
  product,
  region,
}: {
  // product: HttpTypes.StoreProduct
  product: meiliSearchProduct
  region: HttpTypes.StoreRegion
}) => {
  const [showOptions, setShowOptions] = useState(false)
  const [selectedVariant, setSelectedVariant] =
    useState<HttpTypes.StoreProductVariant | null>(null)

  const handleTrack = () => {
    const price = product.cheapestVariant?.prices?.filter(
      (price: any) => price.currencyCode == region.currency_code
    )
    analytics.track("Product Viewed", {
      product_id: product.id,
      name: product.title,
      item_group_id: product.id,
      variant_id: product.cheapestVariant.id,
      variant: product.cheapestVariant?.title || product.variants[0]?.title,
      category: product.brand,
      product_name: product?.title ? product?.title : "",
      brand: product.brand,
      price: Number(price?.[0]?.salePrice) || price?.[0]?.price,
      currency: region.currency_code.toUpperCase(),
    })
  }

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
  }, [emblaApi, onSelect])

  return (
    <>
      <motion.div className="group flex w-full flex-col items-center gap-y-2">
        <div
          onMouseEnter={() => setShowOptions(true)}
          onMouseLeave={() => setShowOptions(false)}
          className="relative flex h-[300px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-gray-200/50 md:h-[400px] lg:h-[500px]"
        >
          <LocalizedClientLink
            href={`/products/${product.handle}`}
            onClick={handleTrack}
            className="h-full w-full"
          >
            <ProductDiscount
              product={product}
              variant={selectedVariant}
              region={region}
            />


            <div className="relative h-full w-full">
              {/* Desktop hover effect */}
              <div className="hidden md:block h-full w-full">
                {product.thumbnail ? (
                  <ProductImage
                    src={product.thumbnail}
                    alt={product?.title ? product.title : ""}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-200">
                    <p className="text-sm text-gray-500">
                      <TranslatedText text="No image" />
                    </p>
                  </div>
                )}

                {product.images[1] && (
                  <img
                    className="absolute inset-0 h-full w-full object-contain transition-opacity duration-300 opacity-0 group-hover:opacity-100 bg-white z-10"
                    src={product.images[1].url}
                    alt={`${product.title} hover`}
                  />
                )}
              </div>

              {/* Mobile Swiper effect */}
              <div className="md:hidden relative h-full w-full overflow-hidden" ref={emblaRef}>
                <div className="flex h-full">
                  <div className="relative min-w-full h-full">
                    {product.thumbnail ? (
                      <ProductImage
                        src={product.thumbnail}
                        alt={product?.title ?? ""}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-200">
                        <p className="text-sm text-gray-500">
                          <TranslatedText text="No image" />
                        </p>
                      </div>
                    )}
                  </div>
                  {product.images[1] && (
                    <div className="relative min-w-full h-full">
                      <img
                        className="w-full h-full object-contain bg-white"
                        src={product.images[1].url}
                        alt={`${product.title} hover`}
                        width="100%"
                        height="100%"
                        sizes="(max-width: 480px) 80vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      />
                    </div>
                  )}
                </div>
                {product.images?.[1] && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10 md:hidden">
                    {[0, 1].map((index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation()
                          emblaApi?.scrollTo(index)
                        }}
                        aria-label={`Go to image ${index + 1}`}
                        className={`h-2 w-2 rounded-full transition-all duration-300 ${selectedIndex === index ? "bg-black scale-110" : "bg-gray-300"
                          }`}
                      />
                    ))}
                  </div>
                )}

              </div>
            </div>
          </LocalizedClientLink>
          {/* Mobile Dot Controls (converted from working buttons) */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10 md:hidden">
            <button
              className={`h-2 w-2 rounded-full ${selectedIndex === 0 ? "bg-black scale-110" : "bg-gray-300"}`}
              onClick={(e) => {
                e.stopPropagation()
                emblaApi?.scrollTo(0)
              }}
              aria-label="Go to first image"
            />
            <button
              className={`h-2 w-2 rounded-full ${selectedIndex === 1 ? "bg-black scale-110" : "bg-gray-300"}`}
              onClick={(e) => {
                e.stopPropagation()
                emblaApi?.scrollTo(1)
              }}
              aria-label="Go to second image"
            />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showOptions ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-0 z-10 w-full cursor-pointer flex-col gap-y-2 bg-black/10 p-2 backdrop-blur-xl hidden md:flex"
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <Button
              variant="glass"
              size="sm"
              className="w-full"
              onClick={(e) => {
                e.stopPropagation()
                setShowOptions(false)
              }}
            >
              <TranslatedText text="Hide options" />
            </Button>
            <Suspense fallback={<></>}>
              <ProductActions
                product={product}
                region={region}
                onVariantSelect={setSelectedVariant}
                onHover={true}
              />
            </Suspense>
          </motion.div>
        </div>

        <LocalizedClientLink
          href={`/products/${product.handle}`}
          onClick={handleTrack}
          className="flex w-full items-start justify-between"
        >
          <div className="flex w-full flex-col gap-y-2">
            <div className="flex w-full items-center justify-between overflow-hidden">
              <div className="flex flex-col">
                {product.brand && (
                  <>
                    <div className="flex o justify-between">
                      <h4 className="w-9/10 mt-2 truncate font-semibold">
                        <TranslatedText text={product.brand} />
                      </h4>
                    </div>
                  </>
                )}

                <h6 className="mt-2 w-full text-wrap font-semibold text-gray-500">
                  <TranslatedText text={product?.title ? product.title : ""} />
                </h6>
              </div>
              {/* <Button
              onClick={() => {
                if (selectedVariant) {
                  handleAddToCart()
                  } else {
                    toast.error("Please select options first")
                }
                }}
                variant="outline"
                size="icon"
                >
                {showAddedToCart ? (
                  <Check className="h-6 w-6" />
                  ) : (
                    <ShoppingBag />
                    )}
                    </Button> */}
            </div>
          </div>
        </LocalizedClientLink>
      </motion.div>
      <LocalizedClientLink
        href={`/products/${product.handle}`}
        onClick={handleTrack}>
        <ProductPrice
          product={product}
          region={region}
          variant={selectedVariant}
        />
      </LocalizedClientLink >
    </>
  )
}

export default ClientProductActions
