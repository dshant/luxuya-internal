import { Metadata } from "next"
import { getBaseURL } from "@lib/util/env"
import ContactPage from "./Contact"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params

  return {
    title: "Contact US | Luxury For You",
    description: "Got any querries? Contact us .",
    alternates: {
      canonical: new URL(getBaseURL()),
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function Contact({ params }: Props) {
  const countryCode = (await params).countryCode

  return <ContactPage countryCode={countryCode} />
}
