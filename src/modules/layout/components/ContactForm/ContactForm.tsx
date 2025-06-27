// ContactForm.tsx
"use client"

import { useState } from "react"
import { Button } from "@modules/common/components/ui/button"
import { Input } from "@modules/common/components/ui/input"
import { Textarea } from "@modules/common/components/ui/textarea"
import { toast } from "sonner"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import { TranslatedText } from "@modules/common/components/translation/translated-text"

const ContactForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    type: "",
  })

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch("/store/inquiry", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key":
            process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
        },
      })

      if (res.ok) {
        toast.success("Message sent successfully!")
      } else {
        toast.error("Failed to send message.")
      }
    } catch (err) {
      toast.error("Failed to send message.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
      <Input
        name="name"
        placeholder="Name *"
        value={formData.name}
        onChange={handleChange}
        required
        disabled={isLoading}
      />
      <Input
        name="email"
        type="email"
        placeholder="Email *"
        value={formData.email}
        onChange={handleChange}
        required
        disabled={isLoading}
      />
      <PhoneInput
        country="us"
        value={formData.phone}
        onChange={(phone) => setFormData({ ...formData, phone })}
        inputClass="!w-full !h-10 !text-base rounded-lg border !border-gray-200/50"
        containerClass="!w-full"
        buttonClass="!h-10"
        enableSearch
        disableSearchIcon
        inputProps={{
          disabled: isLoading,
        }}
      />
      <select
        name="type"
        value={formData.type}
        onChange={handleChange}
        required
        disabled={isLoading}
        className="rounded-lg border border-gray-100 bg-white py-2"
      >
        <option value="" disabled>
          <TranslatedText text="Select Inquiry Type *" />
        </option>
        <option value="product">
          <TranslatedText text="Product" />
        </option>
        <option value="general">
          <TranslatedText text="General" />
        </option>
        <option value="contact">
          <TranslatedText text="Contact" />
        </option>
      </select>
      <Textarea
        name="message"
        placeholder="Message *"
        value={formData.message}
        onChange={handleChange}
        required
        disabled={isLoading}
      />
      <Button
        variant="primary"
        className="w-fit font-bold bg-gray-500 text-white hover:bg-gray-600"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? (
          <TranslatedText text="Sending..." />
        ) : (
          <TranslatedText text="Submit Form" />
        )}
      </Button>
    </form>
  )
}

export default ContactForm
