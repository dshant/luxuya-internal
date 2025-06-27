"use client"

import { PropsWithChildren, useEffect, useRef, useState } from "react"
import Link from "next/link"

import { useClearFiltersUrl } from "@lib/hooks/use-clear-filters-url"
import { Button } from "@modules/common/components/button"
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@modules/common/components/dialog"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"
import { ChevronDown } from "lucide-react"
interface ProductFiltersDrawerProps extends PropsWithChildren {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export default function ProductFiltersDrawer({
  children,
  isOpen,
  setIsOpen,
}: ProductFiltersDrawerProps) {
  // const [isOpen, setIsOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement | null>(null)

  const clearAllUrl = useClearFiltersUrl()

  const handleOpenDialogChange = (open: boolean) => {
    setIsOpen(open)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenDialogChange}>
      <DialogTrigger asChild>
        <button className=" font-medium  text-[16px] w-full flex  px-2 hover:bg-gray-200  justify-center items-center gap-2 border-r border-gray-400 py-4">
          Add Filters
          <ChevronDown size={18} />
        </button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent
          id="dialog-content"
          className="!left-0 !top-0 w-[350px] max-w-full sm:max-w-[400px] md:max-w-[450px] !translate-x-0 !translate-y-0"
          aria-describedby={undefined}
        >
          <DialogHeader className="flex items-center gap-4 text-xl text-basic-primary small:text-2xl bg-white">
            Filters
            <DialogClose className="right-4" />
          </DialogHeader>
          <VisuallyHidden.Root>
            <DialogTitle>Filters Modal</DialogTitle>
          </VisuallyHidden.Root>
          <DialogBody className=" overflow-y-auto bg-white">
            {children}
          </DialogBody>
          <DialogFooter className="flex p-0 w-full bg-white">
            <Button
              variant="tonal"
              asChild
              className="w-1/2 mr-2"
              children={undefined}
            ></Button>

            <Button
              onClick={() => setIsOpen(false)}
              className="w-1/2"
              children={undefined}
            ></Button>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
