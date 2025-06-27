"use client"

import Image from "next/image"
import { useState } from "react"

const ProductImage = ({ src, alt }: { src: string; alt: string }) => {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div
      className={`relative h-full w-full `}
    >
      {/* 

       <Image
        src={src}
        alt={alt}
        fill
        className={`object-cover transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={() => setIsLoading(false)}
      />  */}
      <img
        src={src}
        alt={alt}
        width="100%"
        height="100%"
        className={`object-contain w-full h-full transition-opacity duration-300  bg-white`}
        // onLoad={() => setIsLoading(false)}
      />
    </div>
  )
}

export default ProductImage
