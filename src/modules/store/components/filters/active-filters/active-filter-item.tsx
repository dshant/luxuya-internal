import { Box } from "@modules/common/components/box"
import { Chips } from "@modules/common/components/chips"
import { Label } from "@modules/common/components/label"
import XIcon from "@modules/common/icons/x"
import Spinner from "@modules/common/icons/spinner"
import { useState } from "react"

type ActiveFilterItemProps = {
  label: string
  filterKey: string
  options: {
    id: string
    value: string
  }[]
  handleRemoveFilter: (filterKey: string, handle: string) => void
}

export default function ActiveFilterItem({
  label,
  filterKey,
  options,
  handleRemoveFilter,
}: ActiveFilterItemProps) {
  const [loadingItems, setLoadingItems] = useState<{ [key: string]: boolean }>(
    {}
  )

  const handleClick = async (filterKey: string, handle: string) => {
    setLoadingItems((prev) => ({ ...prev, [handle]: true }))
    await handleRemoveFilter(filterKey, handle)
    setLoadingItems((prev) => ({ ...prev, [handle]: false }))
  }

  return (
    <Box className="flex items-center gap-4 medium:items-center">
      <Label className="text-secondary pt-2 sm:pt-0">{label}:</Label>
      <Box className="flex flex-wrap gap-2">
        {options
          ?.sort((a, b) =>
            label !== "Price" ? a.value.localeCompare(b.value) : 0
          )
          .map((option) => (
            <Chips
              key={option.value}
              rightIcon={loadingItems[option.value] ? <Spinner /> : <XIcon />}
              className="cursor-inherit"
              selected
              onClick={() => handleClick(filterKey, option.value)}
            >
              <p className="text-center">{option.value}</p>
            </Chips>
          ))}
      </Box>
    </Box>
  )
}


