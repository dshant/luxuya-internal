import * as React from "react"
import { Popover } from "radix-ui"
import { ChevronDownIcon } from "lucide-react"
import { Heading } from "@modules/common/components/heading"
import { Box } from "@modules/common/components/box"
import { TranslatedTextServer } from "@modules/common/components/translation/translatest-text-server"

type FilterPopoverProps = {
  title: string
  content: React.ReactNode
}

const FilterPopover = ({ title, content }: FilterPopoverProps) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Heading as="h3" className="flex text-lg font-medium items-center">
          {title}
          <Box
            id="chevronDownSvg"
            className="flex shrink-0 items-center justify-center p-2.5 duration-200 ease-in-out"
          >
            <ChevronDownIcon className="transition-all duration-300 group-data-[headlessui-state=open]:rotate-180" />
          </Box>
        </Heading>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="all z-50 overflow-hidden transition data-[state=closed]:animate-slide-up data-[state=open]:animate-slide-down 2xl:ml-52 border rounded-rounded shadow-lg">
          {content}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

export default FilterPopover
