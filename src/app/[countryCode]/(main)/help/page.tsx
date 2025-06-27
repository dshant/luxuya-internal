import { Separator } from "@modules/common/components/ui/separator"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@modules/common/components/ui/accordion"
import { getFaqData, fetchContact } from "@lib/data/strapi"
import { Metadata } from "next"
import { Fragment } from "react"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "FAQs | Luxury For You",
    description: "Find answers to frequently asked questions.",
    openGraph: {
      title: "FAQs | Luxury For You",
      description: "Find answers to frequently asked questions.",
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

const ContactSection = ({ contactData }: { contactData: any }) => {
  const { Title, Phone_Number, Section, Operating_Hours } =
    contactData?.data || {}

  return (
    <div className="my-10 text-center">
      <h2 className="text-3xl font-bold">{Title}</h2>
      <Separator className="my-10" />
      <div className="my-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {Section?.map((section: any) => (
          <div
            key={section.id}
            className="flex flex-col items-center gap-y-3 rounded-lg border border-gray-200 p-4"
          >
            <h4>{section.Section_Heading?.[0]?.children?.[0]?.text}</h4>
            <p className="text-gray-600">
              {section.Section_Description?.[0]?.children?.[0]?.text}
            </p>
          </div>
        ))}

        <div className="flex flex-col items-center gap-y-3 rounded-lg border border-gray-200 p-4">
          <h4>{Phone_Number}</h4>
          <div className="flex flex-col gap-y-1 text-gray-600">
            {Operating_Hours?.map((item: any) => (
              <Fragment key={item.id}>
                <p>
                  {item.Title?.[0]?.children?.[0]?.text}:{" "}
                  {item.Hours_Detail?.[0]?.children?.[0]?.text}
                </p>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function HelpPage({
  params,
}: {
  params: { countryCode: string }
}) {
  const faqData = await getFaqData({ params })

  let contactData = null
  try {
    contactData = await fetchContact({ params })
  } catch (error) {
    console.error("Failed to fetch contact data:", error)
  }
  return (
    <div className="container mx-auto py-12">
      <div className="text-center">
        <p className="text-sm">Help / FAQ</p>
        <h1 className="my-4 text-5xl font-bold">
          {faqData?.Title || "GET HELP?"}
        </h1>
        <p className="text-lg">
          {faqData?.Description ||
            "Answers to our most frequently asked questions are just one click away."}
        </p>
      </div>

      <div className="my-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        {faqData?.Sections &&
          faqData?.Sections?.map((section: any, index: number) => (
            <div key={index} className="rounded-lg border p-4">
              <h3 className="mb-4 font-semibold capitalize">
                {section.__component.replace("shared.", "").replace("-", " ")}
              </h3>
              <Accordion type="single" collapsible className="text-xs">
                {section.Questions_Answers?.map((qa: any) => (
                  <AccordionItem key={qa.id} value={`item-${qa.id}`}>
                    <AccordionTrigger className="text-sm">
                      {qa.Question}
                    </AccordionTrigger>
                    <AccordionContent>{qa?.Answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
      </div>
      {contactData && <ContactSection contactData={contactData} />}
    </div>
  )
}
