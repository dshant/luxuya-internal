import { clx } from "@medusajs/ui"

const Divider = ({ className }: { className?: string }) => (
  <div
    className={clx("h-px w-full border-b border-gray-200", className)}
  />
)

export default Divider
