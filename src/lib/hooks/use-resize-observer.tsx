import { debounce } from "lodash"
import { useEffect, useState } from "react"

const useResizeObserver = () => {
  const [element, setElement] = useState<HTMLDivElement | null>(null)
  const [width, setWidth] = useState<number | null>(null)
  const [resizeObserver, setResizeObserver] = useState<ResizeObserver | null>(
    null
  )

  const handleResize = debounce((target: Element) => {
    setWidth(target.clientWidth)
  }, 100)

  useEffect(() => {
    // Only create ResizeObserver on client-side
    if (typeof window !== "undefined") {
      const observer = new ResizeObserver((entries) => {
        const first = entries[0]
        if (first?.target) {
          handleResize(first.target)
        }
      })
      setResizeObserver(observer)

      return () => {
        observer.disconnect()
      }
    }
  }, [])

  useEffect(() => {
    if (element && resizeObserver) {
      resizeObserver.observe(element)
    }

    return () => {
      if (element && resizeObserver) {
        resizeObserver.unobserve(element)
      }
    }
  }, [element, resizeObserver])

  return { width, element, setElement }
}

export default useResizeObserver
