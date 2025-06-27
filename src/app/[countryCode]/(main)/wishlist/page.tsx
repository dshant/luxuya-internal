import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { getRegion } from "@lib/data/regions"
import { wishListItems } from "@lib/data/wishlist"
import CartTemplate from "@modules/cart/templates"
import WishlistTemplate from "@modules/common/wishlist/wishListTemplate"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "wishList",
  description: "View your wishList",
  robots: {
    index: true,
    follow: true,
  },
}

type Props = {
  params: Promise<{ countryCode: string}>
}
export default async function WishListPage(props: Props) {
  const wishListData= await wishListItems()
  const customer = await retrieveCustomer()


  const params = await props.params
  const region = await getRegion(params.countryCode)
  if (!region) {
    notFound()
  }

  


  return <WishlistTemplate customer={customer} wishListData={wishListData}  region={region} countryCode={params.countryCode}/>

}
