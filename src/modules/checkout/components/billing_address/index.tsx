import { HttpTypes } from "@medusajs/types"
import Input from "@modules/common/components/input"
import React, { useState } from "react"
import CountrySelect from "../country-select"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"

const BillingAddress = ({ cart }: { cart: HttpTypes.StoreCart | null }) => {
  const [formData, setFormData] = useState<any>({
    "billing_address.first_name": cart?.billing_address?.first_name || "",
    "billing_address.last_name": cart?.billing_address?.last_name || "",
    "billing_address.address_1": cart?.billing_address?.address_1 || "",
    "billing_address.company": cart?.billing_address?.company || "",
    "billing_address.postal_code": cart?.billing_address?.postal_code || "",
    "billing_address.city": cart?.billing_address?.city || "",
    "billing_address.country_code": cart?.billing_address?.country_code || "",
    "billing_address.province": cart?.billing_address?.province || "",
    "billing_address.phone": cart?.billing_address?.phone || "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateField = (name: string, value: string) => {
    let error = ""

    if (value.trim() === "") {
      error = "This field is required"
    }

    if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      error = "Enter a valid email"
    }

    if (name.includes("postal_code") && !/^\d{4,6}$/.test(value)) {
      error = "Enter a valid postal code"
    }

    if (name === "billing_address.phone" && value.trim().length < 8) {
      error = "Enter a valid phone number"
    }

    if (name === "billing_address.country_code" && !value) {
      error = "Select a country"
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }))
  }


  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <>
      <div className="grid grid-cols md:grid-cols-2 gap-4">
        <Input
          label="First name"
          name="billing_address.first_name"
          autoComplete="given-name"
          value={formData["billing_address.first_name"]}
          onChange={handleChange}
          required
          data-testid="billing-first-name-input"
        />
        <Input
          label="Last name"
          name="billing_address.last_name"
          autoComplete="family-name"
          value={formData["billing_address.last_name"]}
          onChange={handleChange}
          required
          data-testid="billing-last-name-input"
        />
        <Input
          label="Address"
          name="billing_address.address_1"
          autoComplete="address-line1"
          value={formData["billing_address.address_1"]}
          onChange={handleChange}
          required
          data-testid="billing-address-input"
        />
        <Input
          label="Company"
          name="billing_address.company"
          value={formData["billing_address.company"]}
          onChange={handleChange}
          autoComplete="organization"
          data-testid="billing-company-input"
        />
        <Input
          label="Postal code"
          name="billing_address.postal_code"
          autoComplete="postal-code"
          value={formData["billing_address.postal_code"]}
          onChange={handleChange}
          required
          data-testid="billing-postal-input"
        />
        <Input
          label="City"
          name="billing_address.city"
          autoComplete="address-level2"
          value={formData["billing_address.city"]}
        />
        <div className="w-full">
          <CountrySelect
            name="billing_address.country_code"
            autoComplete="country"
            region={cart?.region}
            value={formData["billing_address.country_code"]}
            onChange={handleChange}
            required
            data-testid="billing-country-select"
            onBlur={(e) => validateField(e.target.name, e.target.value)}
          />
          {errors["billing_address.country_code"] && (
            <p className="text-rose-500 text-sm mt-1 ml-1">
              {errors["billing_address.country_code"]}
            </p>
          )}
        </div>
        <Input
          label="State / Province"
          name="billing_address.province"
          autoComplete="address-level1"
          value={formData["billing_address.province"]}
          onChange={handleChange}
          data-testid="billing-province-input"
        />
        <div className="w-full">
          <PhoneInput
            country={formData["billing_address.country_code"]?.toLowerCase() || "us"}
            value={formData["billing_address.phone"] || ""}
            onChange={(value) =>
              setFormData((prev: Record<string, any>) => ({
                ...prev,
                "billing_address.phone": value,
              }))
            }
            inputClass="!w-full !h-10 !text-base rounded-md border !border-gray-200 !bg-gray-100/50"
            containerClass="!w-full"
            buttonClass="!h-10"
            enableSearch
            inputProps={{
              name: "billing_address.phone",
              required: true,
              autoComplete: "tel",
            }}
            onBlur={(e) => validateField(e.target.name, e.target.value)}
            defaultErrorMessage={errors["billing_address.phone"]}
          />
          {errors["billing_address.phone"] && (
            <p className="text-rose-500 text-sm mt-1 ml-1">
              {errors["billing_address.phone"]}
            </p>
          )}
        </div>
      </div>
    </>
  )
}

export default BillingAddress
