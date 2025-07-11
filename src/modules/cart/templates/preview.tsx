"use client"

import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Table, clx } from "@medusajs/ui"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  cart: HttpTypes.StoreCart
}

const ItemsPreviewTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart.items
  const hasOverflow = items && items.length > 4

  return (
    <div
      className={clx({
        "pl-[1px] overflow-y-scroll overflow-x-hidden no-scrollbar max-h-[420px]":
          hasOverflow,
      })}
    >
      <Table>
        <Table.Body data-testid="items-table">
          {items
            ? items
              .sort((a, b) => {
                return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
              })
              .map((item) => (
                <tr key={item.id}>
                  <td className="!p-0">
                    <Item
                      item={item}
                      type="preview"
                      currencyCode={cart.currency_code}
                    />
                  </td>
                </tr>
              ))
            : repeat(5).map((i) => (
              <tr key={i}>
                <td className="!p-0">
                  <SkeletonLineItem />
                </td>
              </tr>
            ))}
        </Table.Body>
      </Table>
    </div>
  )
}

export default ItemsPreviewTemplate
