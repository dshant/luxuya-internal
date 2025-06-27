"use client"

import React, { Suspense, useEffect, useState } from "react"
import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import { HttpTypes } from "@medusajs/types"
import { SizeChartModal } from "../components/sizeChartModal"
import { meilisearchProductType } from "types/meilisearch"
import JsonStructuredData from "@modules/common/components/json-structured-data"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@modules/common/components/ui/accordion"
import { ChevronDownIcon, InfoIcon, Tags } from "lucide-react"
import { Button } from "@modules/common/components/ui/button"
import WhatsappIcon from "@modules/common/icons/whatsapp-icon"
import HelpModal from "./HelpModal"
import PriceOfferModal from "./PriceOfferModal"
import { TranslatedText } from "@modules/common/components/translation/translated-text"
import _ from "lodash"

type ProductTemplateProps = {
  product: meilisearchProductType | null
  region: HttpTypes.StoreRegion
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
}) => {
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [showPriceModal, setShowPriceModal] = useState(false)
  const [selectedVariant, setSelectedVariant] =
    useState<HttpTypes.StoreProductVariant | null>(null)

  if (!product) {
    return <div>Product not found</div>
  }

  // Extract price and currency information
  const priceObj = product.cheapestVariant?.prices?.[0]
  const price = priceObj?.amount ? priceObj.amount / 100 : 0.0
  const currency =
    priceObj?.currency_code?.toUpperCase() || region.currency_code

  // Construct JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product?.title,
    image: product?.thumbnail ? [product?.thumbnail] : [],
    description: product?.description,
    sku: product?.id,
    brand: {
      "@type": "Brand",
      name: product?.brand || "Luxury For You",
    },
    offers: {
      "@type": "Offer",
      price: price.toFixed(2),
      priceCurrency: currency,
      availability: "https://schema.org/InStock",
    },
  }
  return (
    <>
      {/* Embed JSON-LD structured data */}
      <JsonStructuredData data={jsonLd} />
      <div className="mt-5 mx-auto px-3 flex flex-col">
        <div className="grid w-full grid-cols-1 gap-y-10 lg:grid-cols-3">
          {product?.images && (
            <ImageGallery title={product?.title} images={product?.images} />
          )}

          <div className="flex w-full flex-col gap-y-4 relative">
            <div className="flex-col gap-y-1 md:flex">
              <div className="flex items-center justify-between mb-3">
                {product?.brand && (
                  <h1 className="text-[22px]/6 uppercase font-medium">
                    <TranslatedText text={product?.brand} />{" "}
                  </h1>
                )}
              </div>

              {product?.title && (
                <h4 className="text-gray-500 text-lg font-normal">
                  <TranslatedText text={product?.title} />
                </h4>
              )}
            </div>
            <div className="flex items-center gap-x-2">
              <div className="font-bold">
                <TranslatedText text="Interest-free instalments available." />
              </div>
              <div className="flex items-center gap-1">
                <button type="button" className="flex items-center gap-1">
                  <img
                    alt="tabby"
                    src="/tabby.webp"
                    height="12"
                    className="h-3 object-contain w-auto"
                  />
                  <InfoIcon size={12} />
                </button>
              </div>
            </div>

            <div className="flex-col gap-y-2 md:flex">
              <Suspense fallback={<div>Loading actions...</div>}>
                <ProductActions
                  product={product}
                  region={region}
                  cheapestVariantId={product?.cheapestVariant?.id}
                  onVariantSelect={setSelectedVariant}
                />
              </Suspense>
            </div>
            <div className="flex flex-col">
              <Accordion className="AccordionRoot" type="single" collapsible>
                {product?.description && (
                  <AccordionItem value="details">
                    <AccordionTrigger
                      icon={false}
                      className="text-base font-medium text-gray-500 hover:text-gray-900 hover:no-underline"
                    >
                      <span className="text-base font-medium text-black hover:text-gray-900">
                        <TranslatedText text="Details" />
                      </span>
                      <ChevronDownIcon
                        className="AccordionChevron"
                        aria-hidden
                      />
                    </AccordionTrigger>

                    <AccordionContent>
                      <div
                        className="flex flex-col gap-y-2"
                        dangerouslySetInnerHTML={{
                          __html: product.description,
                        }}
                      />
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
              <Accordion className="AccordionRoot" type="single" collapsible>
                <AccordionItem value="delivery">
                  <AccordionTrigger
                    icon={false}
                    className="text-base font-medium text-gray-500 hover:text-gray-900 hover:no-underline"
                  >
                    <span className="text-base font-medium text-black hover:text-gray-900">
                      <TranslatedText text="Delivery & Free Returns" />
                    </span>
                    <ChevronDownIcon className="AccordionChevron" aria-hidden />
                  </AccordionTrigger>

                  <AccordionContent>
                    <div className="flex flex-col gap-y-2">
                      <div>
                        <p className="font-semibold">
                          <TranslatedText text="1. Fast Delivery" />
                        </p>
                        <ul className="list-disc list-inside">
                          <li>
                            <TranslatedText text="Most items land at your door in 4-7 business days." />
                            <span className="text-[#ef4444]">*</span>
                          </li>
                        </ul>
                        <p className="font-semibold mt-2">
                          <TranslatedText text="2. Free 30-Day Returns" />
                        </p>
                        <ul className="list-disc list-inside">
                          <li>
                            <TranslatedText
                              text="Changed your mind? Send it back within 30 days—no
                            questions asked."
                            />
                          </li>
                          <li>
                            <TranslatedText
                              text="We cover return shipping—just use the prepaid label
                            in your account."
                            />
                          </li>
                        </ul>
                        <p className="font-semibold mt-2">
                          <TranslatedText text="3. Peace of Mind" />
                        </p>
                        <ul className="list-disc list-inside">
                          <li>
                            <TranslatedText
                              text="Every parcel is fully insured and tracked
                            door-to-door, so you always know where it is."
                            />
                          </li>
                          <li className="text-[#ef4444] text-xs">
                            <TranslatedText
                              text="Delivery times can vary by brand, destination, and
                            customs clearance. See our full Shipping & Returns
                            policy for details."
                            />
                          </li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Button
                variant={"link"}
                className="justify-between px-0 py-4 h-auto border-b hover:no-underline rounded-none text-lg [&_svg]:size-6 text-gray-500"
                onClick={() => setShowHelpModal(true)}
              >
                <span className="flex items-center gap-x-2 text-base text-gray-900">
                  <WhatsappIcon className="w-5 h-5" />
                  <TranslatedText text="Need Help?" />
                </span>
                <ChevronDownIcon size={24} />
              </Button>
              <Button
                variant={"link"}
                className="justify-between px-0 py-4 h-auto border-b hover:no-underline rounded-none text-lg [&_svg]:size-6 text-gray-500"
                onClick={() => setShowPriceModal(true)}
              >
                <span className="flex items-center gap-x-2 text-base text-gray-900">
                  <Tags className="w-5 h-5" />
                  <TranslatedText text="We offer Price Match" />
                </span>
                <ChevronDownIcon size={24} />
              </Button>
            </div>
            <HelpModal
              setShowHelpModal={setShowHelpModal}
              showHelpModal={showHelpModal}
            />
            <PriceOfferModal
              showPriceModal={showPriceModal}
              setShowPriceModal={setShowPriceModal}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductTemplate
