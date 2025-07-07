import React, { useRef, useState, useEffect } from "react"
import InnerImageZoom from "react-inner-image-zoom"
import "react-inner-image-zoom/lib/styles.min.css"

const ZoomImageMobile = ({ src }: { src: string }) => {
  const zoomRef = useRef<any>(null)
  const [zoomed, setZoomed] = useState(false)

  useEffect(() => {
    if (!zoomed) return

    const handleZoomClick = () => {
      if (zoomRef.current) {
        zoomRef.current.closeZoom()
      }
    }

    const zoomImg = document.querySelector(".iiz__zoom-img")
    if (zoomImg) {
      zoomImg.addEventListener("click", handleZoomClick)
    }

    return () => {
      if (zoomImg) {
        zoomImg.removeEventListener("click", handleZoomClick)
      }
    }
  }, [zoomed])

  return (
    <div style={{ width: "100%", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <InnerImageZoom
        ref={zoomRef}
        src={src}
        zoomSrc={src}
        zoomType="click"
        zoomPreload={true}
        hideCloseButton={true}
        hideHint={true}
        afterZoomIn={() => setZoomed(true)}
        afterZoomOut={() => setZoomed(false)}
      />
    </div>
  )
}

export default ZoomImageMobile;
