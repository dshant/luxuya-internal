import { Separator } from "@modules/common/components/ui/separator"
import { TranslatedText } from "@modules/common/components/translation/translated-text"
import ContactForm from "@modules/layout/components/ContactForm/ContactForm"
interface Props {
  countryCode: string
}

// async function getContactData(countryCode: string) {
//   try {
//     const res = await fetch(`/api/contact?countryCode=${countryCode}`)

//     if (!res.ok) {
//       console.error("Failed to fetch contact data")
//       return null
//     }
//     const final = await res.json()

//     return final
//   } catch (error) {
//     console.error("Error fetching contact data:", error)
//     return error
//   }
// }

export default async function ContactPage({ countryCode }: Props) {
  // const contactData = await getContactData(countryCode)

  // const { Title, Phone_Number, Section, Operating_Hours } =
  //   contactData?.data || {}

  // console.log(await getContactData(countryCode))

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="my-10 grid w-full grid-cols-1 rounded-xl border border-gray-200/50 p-10 md:grid-cols-2">
        <div className="flex items-center justify-center overflow-hidden">
          <img
            src="https://plus.unsplash.com/premium_photo-1682125235036-d1ab54136ff4?q=80&w=2970&auto=format&fit=crop"
            alt="Contact Us"
            className="h-full w-full rounded-xl object-cover"
          />
        </div>
        <div className="max-w-lg w-full mx-auto my-10 flex flex-col gap-y-4">
          <h1>
            <TranslatedText text="Contact Us" />
            <span className="text-[0px]">Luxury for you</span>
          </h1>
          <div className="flex flex-col gap-y-1">
            <p>
              <TranslatedText text="Questions about our products, service or order? We want to hear from" />
            </p>
            <p>
              <TranslatedText text="Email us at care@luxuryforyou.com, Call: +1 (220) 235-4544 or fill out the form below." />
            </p>
          </div>
          <ContactForm />
        </div>
      </div>

      {/* {contactData && Section && Title && Operating_Hours && (
        <div className="w-full my-10 px-4 xl:px-20">
          <h2 className="text-3xl font-bold text-center">
            <TranslatedText text={Title || ""} />
          </h2>
          <Separator className="my-10" />
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            {((Section as any[]) || []).map((section: any) => (
              <div
                key={section.id}
                className="flex flex-col items-center gap-y-3 rounded-lg border border-gray-200 p-4"
              >
                <h4>
                  <TranslatedText
                    text={section.Section_Heading?.[0]?.children?.[0]?.text}
                  />
                </h4>
                <p className="text-gray-600 items-center">
                  <TranslatedText
                    text={section.Section_Description?.[0]?.children?.[0]?.text}
                  />
                </p>
              </div>
            ))}
            <div className="flex flex-col items-center gap-y-3 rounded-lg border border-gray-200 p-4">
              <h4>{Phone_Number}</h4>
              <div className="flex flex-col gap-y-1 text-gray-600">
                {Operating_Hours &&
                  ((Operating_Hours as any) || []).map((item: any) => (
                    <p key={item.id}>
                      <TranslatedText
                        text={item.Title?.[0]?.children?.[0]?.text}
                      />
                      :{" "}
                      <TranslatedText
                        text={item.Hours_Detail?.[0]?.children?.[0]?.text}
                      />
                    </p>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )} */}
    </div>
  )
}
