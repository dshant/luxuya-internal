"use client"

import { Button, FocusModal } from "@medusajs/ui"
import { useEffect, useState } from "react"
import { ShowCountrySize } from "./ShowCountrySize" // Import child component
import { TranslatedText } from "@modules/common/components/translation/translated-text"

interface SizeChartModalProps {
  product: any
  isModal?: boolean
}

export const SizeChartModal = ({ product, isModal }: SizeChartModalProps) => {
  const [sizeChart, setSizeChart] = useState<Map<string, any>>(new Map())
  const [loading, setLoading] = useState<boolean>(true)
  const [open, setOpen] = useState(false)

  const handleModal = () => {
    setOpen(true)
  }

  useEffect(() => {
    if (!product || !product.metadata || !product.metadata.SizeChart) {
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const parsedSizeChart = JSON.parse(product.metadata.SizeChart)
      const transformedChart = new Map<string, any>()

      parsedSizeChart.forEach((item: any) => {
        Object.entries(item).forEach(([key, value]) => {
          if (!transformedChart.has(key)) {
            transformedChart.set(key, [])
          }
          transformedChart.get(key)?.push(value)
        })
      })

      setSizeChart(transformedChart)
    } catch (error) {
      console.error("Error parsing SizeChart:", error)
    } finally {
      setLoading(false)
    }
  }, [product.metadata?.SizeChart])

  return (
    <>
      <div className="flex justify-center">
        {isModal ? (
          <p
            onClick={handleModal}
            className="underline font-bold text-[#c52128] cursor-pointer"
          >
            {" "}
            <TranslatedText text="Size Guide" /> 
          </p>
        ) : (
          <Button
            className="mx-2 py-2 text-xs whitespace-nowrap text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
            variant={"secondary"}
            onClick={handleModal}
          >
            <TranslatedText text="Size Guide" /> 
          </Button>
        )}

        <FocusModal open={open} onOpenChange={setOpen}>
          <FocusModal.Content className="z-[99999] w-[90%] sm:w-[70%] md:w-[55%] lg:w-[45%] mt-16 mx-auto overflow-auto mb-1 h-[86%] p-6 bg-white backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200">
            <FocusModal.Header>
              <h2 className="text-xl font-bold text-gray-700 text-center">
                <TranslatedText text="Size Chart" />
              </h2>
            </FocusModal.Header>

            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 mb-4 border-b border-gray-300">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-32 h-32 object-contain rounded-md shadow-md"
              />
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-bold text-gray-500">
                  <TranslatedText text={product.brand} />
                </h3>
                <h2 className="text-lg font-semibold text-gray-800">
                  <TranslatedText text={product.title} />
                </h2>
              </div>
            </div>

            <FocusModal.Body>
              <ShowCountrySize sizeChart={sizeChart} />
            </FocusModal.Body>
          </FocusModal.Content>
        </FocusModal>
      </div>
    </>
  )
}
