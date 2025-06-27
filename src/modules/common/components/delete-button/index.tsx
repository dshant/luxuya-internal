import { deleteLineItem, retrieveCart } from "@lib/data/cart"
import { getCartIdClient } from "@lib/data/cookies-client"
import { createOrUpdateHsCart } from "@lib/data/hubspot"
import { Spinner, Trash } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import { useState } from "react"

const DeleteButton = ({
  id,
  children,
  className,
}: {
  id: string
  children?: React.ReactNode
  className?: string
}) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    await deleteLineItem(id).catch((err) => {
      setIsDeleting(false)
    })

    const cartId = await getCartIdClient()
    if (cartId) {
      const cart = await retrieveCart(cartId)
      if (cart) {
        createOrUpdateHsCart(cart)
        const url = new URL(window.location.href)
        url.searchParams.set("deleted", "true")
        window.history.replaceState({}, "", url.toString())
      }
    }
  }

  return (
    <div
      className={clx(
        "flex items-center justify-between text-small-regular",
        className
      )}
    >
      <button
        className="flex gap-x-1 text-ui-fg-subtle hover:text-ui-fg-base cursor-pointer"
        onClick={() => handleDelete(id)}
      >
        {isDeleting ? <Spinner className="animate-spin" /> : <Trash />}
        <span>{children}</span>
      </button>
    </div>
  )
}

export default DeleteButton
