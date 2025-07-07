"use client"

import { HttpTypes } from "@medusajs/types"
import useEmblaCarousel from "embla-carousel-react"
import Image from "next/image"
import { Fragment, useCallback, useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, X, Share2 } from "lucide-react"
import { cn } from "@lib/util/common"
import { Dialog, Transition, DialogPanel } from "@headlessui/react"
import ZoomImageMobile from "./zoomImageMobile";
import ZoomImageDesktop from './zoomImageDesktop';

type ImageGalleryProps = {
  title: string
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ title, images }: ImageGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const [mainCarouselRef, mainEmblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  })

  const [thumbCarouselRef, thumbEmblaApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
    align: "start",
  })

  const [modalCarouselRef, modalEmblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
  })

  const scrollTo = useCallback(
    (index: number) => {
      if (!mainEmblaApi || !thumbEmblaApi) return
      mainEmblaApi.scrollTo(index)
      setSelectedIndex(index)
    },
    [mainEmblaApi, thumbEmblaApi]
  )

  const handleShare = async () => {
    if (typeof window !== "undefined" && navigator?.share) {
      try {
        await navigator.share({
          url: window.location.href,
          title: "Share Item",
        })
      } catch (err) {
        return
      }
    }
  }

  const onSelect = useCallback(() => {
    if (!mainEmblaApi) return
    const newIndex = mainEmblaApi.selectedScrollSnap()
    setSelectedIndex(newIndex)
    if (thumbEmblaApi) {
      thumbEmblaApi.scrollTo(newIndex)
    }
  }, [mainEmblaApi, thumbEmblaApi])

  useEffect(() => {
    if (!mainEmblaApi) return
    mainEmblaApi.on("select", onSelect)
    mainEmblaApi.on("reInit", onSelect)
  }, [mainEmblaApi, onSelect])

  useEffect(() => {
    if (modalEmblaApi) {
      modalEmblaApi.scrollTo(selectedIndex)
    }
  }, [modalEmblaApi, selectedIndex])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile() // Check on mount

    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  if (!images) return null

  return (
    <>
      <div className="relative col-span-2 mx-auto grid w-full grid-cols-[auto_1fr] gap-x-0 lg:gap-x-4">
        {/* Thumbnail Carousel */}
        <div className="hidden overflow-hidden lg:block" ref={thumbCarouselRef}>
          <div className="grid grid-flow-row gap-y-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={cn(
                  "relative aspect-square h-24 w-24 cursor-pointer overflow-hidden rounded-xl border",
                  selectedIndex === index
                    ? "border-gray-800"
                    : "border-gray-200"
                )}
              >
                <Image
                  width={96}
                  height={96}
                  src={image?.url}
                  alt={title ?? ""}
                  className="h-full w-full object-cover"
                  style={{ objectFit: "cover" }}
                />
              </button>
            ))}
          </div>
        </div>
        <div
          onClick={handleShare}
          className="bg-white p-0 size-[44px] flex justify-center items-center border border-gray-200/60 shadow-2xl rounded-full absolute right-0 sm:right-6 bottom-8 z-40"
        >
          <Share2 />
        </div>
        {/* Main Carousel */}
        <div className="relative grid place-items-center">
          <div className="overflow-hidden relative" ref={mainCarouselRef}>
            <div className="grid auto-cols-[100%] grid-flow-col">
              {images.map((image, index) => (
                <div
                  className="relative min-w-0 cursor-pointer"
                  key={index}
                  onClick={() => {
                    setSelectedIndex(index)
                    setIsModalOpen(true)
                  }}
                >
                  <Image
                    width={1000}
                    height={400}
                    src={image?.url.toString()}
                    alt={title ?? ""}
                    className="h-full min-h-[380px] max-h-[390px] sm:max-h-[650px] w-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            className="absolute -left-4 sm:left-2 top-1/2 -translate-y-1/2 disabled:opacity-50 bg-transparent border-none"
            onClick={() => mainEmblaApi?.scrollPrev()}
            disabled={selectedIndex === 0}
          >
            <ChevronLeft size={30} />
          </button>

          <button
            className="absolute -right-4 sm:right-2 top-1/2 -translate-y-1/2 disabled:opacity-50"
            onClick={() => mainEmblaApi?.scrollNext()}
            disabled={selectedIndex === images.length - 1}
          >
            <ChevronRight size={30} />
          </button>
        </div>
      </div>
      {/* Modal for Full-Width Preview */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 Dialog-Image"
          onClose={() => setIsModalOpen(false)}
        >
          <div className="fixed inset-0 flex items-center justify-center bg-white">
            <DialogPanel className="relative h-screen w-screen ">
              <button
                className="absolute top-4 right-4 text-black z-50"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={30} />
              </button>

              <div
                className="hidden overflow-hidden lg:block absolute top-4 left-4"
                ref={thumbCarouselRef}
              >
                <div className="grid grid-flow-row gap-y-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => scrollTo(index)}
                      className={cn(
                        "relative aspect-square h-24 w-24 cursor-pointer overflow-hidden rounded-xl border",
                        selectedIndex === index
                          ? "border-gray-800"
                          : "border-gray-200"
                      )}
                    >
                      <Image
                        width={96}
                        height={96}
                        src={image?.url}
                        alt={title ?? ""}
                        className="h-full w-full object-cover"
                        style={{ objectFit: "cover" }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="absolute left-0 right-0 top-0 bottom-0 grid place-items-center lg:left-[8rem]">
                <div className="overflow-hidden" ref={modalCarouselRef}>
                  <div className="grid auto-cols-[100%] grid-flow-col">
                    {images.map((image, index) => (
                      <div
                        className="h-screen flex items-center justify-center"
                        key={index}
                      >{isMobile?<ZoomImageMobile src={image?.url.toString()} />:<ZoomImageDesktop src={image?.url.toString()} />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 text-black lg:left-[9rem]"
                onClick={() => modalEmblaApi?.scrollPrev()}
              >
                <ChevronLeft size={30} />
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-black"
                onClick={() => modalEmblaApi?.scrollNext()}
              >
                <ChevronRight size={30} />
              </button>
            </DialogPanel>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default ImageGallery
