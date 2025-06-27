"use client"

import React, { useState } from "react"
import WishlistPopoverItem from "./wishlistPopverItem"
import Link from "next/link"
import { Wishlist } from "@modules/layout/templates/nav"
import { Heart } from "lucide-react"

const WishlistPopover = ({ wishlist }: { wishlist: Wishlist }) => {
  const [isOpen, setIsOpen] = useState(false)
  const wishlistCount = wishlist?.items?.length || 0

  return (
    <>
  
      <div className="relative inline-block text-left h-6 sm:hidden">
        <Link
          className="inline-flex items-center justify-center w-full rounded text-sm font-medium hover:opacity-80"
          href={"/wishlist"}
        >
          <Heart size={20}  />
          <span className="text-nowrap"></span>
        </Link>

        {wishlistCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {wishlistCount}
          </span>
        )}
      </div>

      <div
       className="relative text-left hidden h-6 sm:block"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
         
        <Link
          className="inline-flex items-center justify-center w-full rounded text-sm font-medium hover:opacity-80"
          href={"/wishlist"}
        >
         <Heart size={20} />
          <span className="text-nowrap"></span>
        </Link>
        {wishlistCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {wishlistCount}
          </span>
        )}

        {isOpen && (
          <div className="absolute right-0 top-full mt w-96 px-6 py-4 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">

              {!wishlist?.items || wishlist?.items?.length < 1 ? (
                <div className="flex justify-center">
                  <p>Your wish list is empty</p>
                </div>
              ) : (
                <>
                  {wishlist.items?.slice(0, 4)?.map((item: any) => (
                    <div className="py-2 first:pt-0" key={item.id}>
                      <WishlistPopoverItem item={item} />
                    </div>
                  ))}
                  <div className="flex flex-col mt-4">
                    <Link href="/wishlist">
                      <button className="text-ui-dark py-2 text-sm w-full border px-3 py-1.5 rounded hover:text-black hover:bg-gray-100">
                        View Wish List
                      </button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default WishlistPopover
