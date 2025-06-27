"use client"

import { Dispatch, SetStateAction } from "react"

export function BrandSearch({
  searchTerm,
  setSearchTerm,
}: {
  searchTerm: string
  setSearchTerm: Dispatch<SetStateAction<string>>
}) {
  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search brands"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <span className="absolute left-3 top-2.5 text-gray-400 pointer-events-none">
        🔍
      </span>
    </div>
  )
}
