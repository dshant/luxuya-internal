import { Checkbox, Label } from "@medusajs/ui"
import React from "react"

type CheckboxProps = {
  id?: any
  checked?: boolean
  onChange?: () => void
  label: string
  name?: string
  "data-testid"?: string
  role: any
  type: any
  disabled: any
}

const CheckboxWithLabel: React.FC<CheckboxProps> = ({
  checked = true,
  id,
  onChange,
  label,
  name,
  role,
  type,
  disabled,
  "data-testid": dataTestId,
}) => {
  return (
    <div className="flex items-center space-x-2 ">
      <Checkbox
        className="text-base-regular flex items-center gap-x-2"
        id="checkbox"
        role="checkbox"
        type="button"
        checked={checked}
        aria-checked={checked}
        onClick={onChange}
        name={name}
        data-testid={dataTestId}
      />
      <Label
        htmlFor="checkbox"
        className="!transform-none !txt-medium"
        size="large"
      >
        {label}
      </Label>
    </div>
  )
}

export default CheckboxWithLabel
