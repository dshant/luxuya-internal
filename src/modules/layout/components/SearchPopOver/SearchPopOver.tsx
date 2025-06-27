"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Heart, SearchIcon } from "lucide-react"

const SearchPopOver = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>

            <div className="relative inline-block text-left h-6 sm:hidden">
                <Link
                    className="inline-flex items-center justify-center w-full rounded text-sm font-medium hover:opacity-80"
                    href={"/search"}
                >
                    <SearchIcon size={20} />
                    <span className="text-nowrap"></span>
                </Link>
            </div>

            <div
                className="relative text-left hidden h-6 sm:block"
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
            >

                <Link
                    className="inline-flex items-center justify-center w-full rounded text-sm font-medium hover:opacity-80"
                    href={"/search"}
                >
                    <SearchIcon size={20} />
                    <span className="text-nowrap"></span>
                </Link>

                {isOpen && (
                    <div className="absolute right-0 top-full w-[65px] px-3 py-1 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <p>Search</p>
                    </div>
                )}
            </div>
        </>
    )
}

export default SearchPopOver
