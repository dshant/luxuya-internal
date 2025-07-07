import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"
import { useState, useEffect } from "react"
import { set } from "lodash"

const ZoomImageDesktop = ({ src }: { src: string }) => {
  // const [maxScale] = useState<number>(2)
  // const [doubleClickMode, setDoubleClickMode] = useState<
  //   "zoomIn" | "zoomOut" | "reset" | "toggle" | undefined
  // >("zoomIn")
  // const [scale, setScale] = useState<number>(0)

  // useEffect(() => {
  //   if (scale >= maxScale) {
  //     setDoubleClickMode("zoomOut")
  //   } else if (scale <= 0) {
  //     setDoubleClickMode("zoomIn")
  //   }

  // }, [scale])

  return (
    <TransformWrapper
      smooth
      // doubleClick={{
      //   mode: doubleClickMode,
      // }}
      // initialScale={1}
      // onZoom={() => {
      //   const diff =
      //     doubleClickMode === "zoomIn"
      //       ? 1
      //       : doubleClickMode === "zoomOut"
      //       ? -1
      //       : 0
      //   setScale((prevScale) => prevScale + diff)
      // }}
    >
      <TransformComponent
        contentStyle={{
          height: "100vh",
          width: "100%",

          flex: 1,
          // cursor:
          //   doubleClickMode === "zoomIn"
          //     ? "zoom-in"
          //     : doubleClickMode === "zoomOut"
          //     ? "zoom-out"
          //     : "pointer",
        }}
      >
        <img
          src={src}
          alt="Zoom Image"
          style={{
            width: "100%",
            height: "100vh",
            objectFit: "contain",
          }}
        />
      </TransformComponent>
    </TransformWrapper>
  )
}

export default ZoomImageDesktop
