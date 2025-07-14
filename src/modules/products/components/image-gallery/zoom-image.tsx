'use client'
import React, { useState, useEffect } from "react"
import dynamic from "next/dynamic";
import "react-inner-image-zoom/lib/styles.min.css";

const InnerImageZoom = dynamic(() => import("react-inner-image-zoom"), { ssr: false });

const ZoomImage = ({ src }: { src: string }) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 650)
    }

    checkMobile() // Check on mount

    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, []);


  return (
    <div style={{ width: isMobile?'325px':'650px', display: "flex", alignItems: "center", justifyContent: "center" }}>
      <InnerImageZoom
        src={src}
        zoomSrc={src}
        zoomType="click"
        zoomPreload={true}
        hideCloseButton={true}
        hideHint={true}
      />
    </div>
  )
}

export default ZoomImage;
