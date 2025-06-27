"use client"

const Button = ({ char }: { char: string }) => {
  return (
    <button
      onClick={() => {
        const section = document.getElementById(`section-${char}`)
        if (section) {
          const offset = 100
          const topPos =
            section.getBoundingClientRect().top + window.scrollY - offset
          window.scrollTo({ top: topPos, behavior: "smooth" })
        }
      }}
      className="text-sm font-medium px-3 py-2 rounded text-gray-800 hover:text-[#c52129]"
    >
      {char}
    </button>
  )
}

export default Button
