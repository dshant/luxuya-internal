import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/account/",
    },
    sitemap: [
      "https://luxuryforyou.com/sitemap/default.xml",
      "https://luxuryforyou.com/sitemap/categories.xml",
      "https://luxuryforyou.com/sitemap/products-one.xml",
      "https://luxuryforyou.com/sitemap/products-two.xml",
      "https://luxuryforyou.com/sitemap/products-three.xml",
      "https://luxuryforyou.com/sitemap/products-four.xml",
      "https://luxuryforyou.com/sitemap/products-five.xml",
    ],
  }
}
