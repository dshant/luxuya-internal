import { WishlistItem } from "@modules/layout/templates/nav"
import Link from "next/link"
import React from "react"

const WishlistPopoverItem = ({ item }:{item:WishlistItem}) => {


  return (
    <Link href={`/products/${item?.product_variant?.product?.handle}`} className="font-normal">
      <div className="flex hover:bg-gray-100">
        <div className="overflow-hidden rounded-md mr-4">
          <img className="w-16 h-auto" src={item?.product_variant?.product?.thumbnail || undefined} alt={""} />
        </div>
        <div className="flex items-center">
          <div>
            <p className="font-medium text-sm">{item?.product_variant?.product.title}</p>
            <p className="text-sm">variant : {item?.product_variant?.title}</p>
          </div>
          
        </div>
      </div>
    </Link>
  )
}
export default WishlistPopoverItem