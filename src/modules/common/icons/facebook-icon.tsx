import React from "react"

const FacebookIcon = ({ size = 24 }: { size?: number }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className="shrink-0"
    >
      <defs>
        <linearGradient
          id="fbGradient"
          x1="9.993"
          x2="40.615"
          y1="9.993"
          y2="40.615"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#2aa4f4"></stop>
          <stop offset="1" stopColor="#007ad9"></stop>
        </linearGradient>
      </defs>
      <path
        fill="url(#fbGradient)"
        d="M24,4C12.954,4,4,12.954,4,24s8.954,20,20,20s20-8.954,20-20S35.046,4,24,4z"
      ></path>
      <path
        fill="#fff"
        d="M26.707,29.301h5.176l0.813-5.258h-5.989v-2.874
        c0-2.184,0.714-4.121,2.757-4.121h3.283V12.46
        c-0.577-0.078-1.797-0.248-4.102-0.248
        c-4.814,0-7.636,2.542-7.636,8.334v3.498H16.06v5.258h4.948v14.452
        C21.988,43.9,22.981,44,24,44
        c0.921,0,1.82-0.084,2.707-0.204V29.301z"
      ></path>
    </svg>
  )
}

export default FacebookIcon
