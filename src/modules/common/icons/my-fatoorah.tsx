import React from "react"

const MyFatoorah: React.FC = () => {
  const paymentIcons = [
    {
      alt: "visa",
      src: "https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/assets/visa.sxIq5Dot.svg",
    },
    {
      alt: "master",
      src: "https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/assets/master.CzeoQWmc.svg",
    },
    {
      alt: "mada",
      src: "https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/assets/mada.B18Lw7s7.svg",
    },
    {
      alt: "knet",
      src: "https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/assets/knet.CLqZBkB3.svg",
    },
  ]

  return (
    <div className="flex gap-1">
      {paymentIcons.map((icon, index) => (
        <img
          key={index}
          alt={icon.alt}
          src={icon.src}
          role="img"
          width="38"
          height="24"
          className="payment-icon"
        />
      ))}
      <img
        alt={"ssl"}
        src={"/safeCheckout.png"}
        role="img"
        width="60"
        height="24"
        className="ssl-icon object-cover"
      />
      <button type="button" aria-pressed="false" className="more-options">
        <div className="more-option border pl-2 pr-2 p-1 rounded-lg">
          <span className="more-text">+9</span>
        </div>
      </button>
    </div>
  )
}

export default MyFatoorah
