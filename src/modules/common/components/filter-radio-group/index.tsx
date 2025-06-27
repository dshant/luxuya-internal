import { ChevronDown } from "lucide-react"
import { DropdownMenu } from "@medusajs/ui"
import { TranslatedTextServer } from "../translation/translatest-text-server"
type FilterRadioGroupProps = {
  items: {
    value: string
    label: string
  }[]
  value: any
  handleChange: (...args: any[]) => void
  "data-testid"?: string
}
const FilterRadioGroup = ({
  items,
  value,
  handleChange,
  "data-testid": dataTestId,
}: FilterRadioGroupProps) => {
  return (
    <>
      <DropdownComponent
        dataTestId={dataTestId}
        handleChange={handleChange}
        items={items}
        value={value}
      />
    </>
  )
}
export default FilterRadioGroup
const DropdownComponent = ({
  dataTestId,
  items,
  value,
  handleChange,
}: {
  dataTestId: any
  items: any
  value: any
  handleChange: any
}) => {
  const handleSortChange = (value: any) => {
    handleChange(value)
  }

  return (
    <div className="flex w-full h-full flex-col gap-3">
      <div className="relative w-full h-full flex justify-center items-center">
        <DropdownMenu>
          <DropdownMenu.Trigger className=" w-full h-full flex gap-2 justify-center items-center outline-none focus:outline-none">
            <span className="font-medium text-[16px]">Sort By</span>{" "}
            <ChevronDown size={20} />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className=" max-h-[200px] relative z-50">
            {items?.map((i: any, index: number) => (
              <DropdownMenu.Item
                className={`w-full font-normal text-gray-900  p-2 pl-4 ${value === i.value ? "bg-slate-200" : ""
                  }`}
                key={index}
                onClick={() => handleSortChange(i.value)}
              >
                {" "}
                {i.label}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu>
      </div>
    </div>
  )
}