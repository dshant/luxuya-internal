import { acceptTransferRequest } from "@lib/data/orders"
import { Heading, Text } from "@medusajs/ui"
import { TranslatedTextServer } from "@modules/common/components/translation/translatest-text-server";
import TransferImage from "@modules/order/components/transfer-image"

export default async function TransferPage({
  params,
}: {
  params: { id: string; token: string }
}) {
  const { id, token } = params

  const { success, error } = await acceptTransferRequest(id, token)

  return (
    <div className="flex flex-col gap-y-4 items-start w-2/5 mx-auto mt-10 mb-20">
      <TransferImage />
      <div className="flex flex-col gap-y-6">
        {success && (
          <>
            <Heading level="h1" className="text-xl text-zinc-900">
              <TranslatedTextServer text="Order transfered!" />
            </Heading>
            <Text className="text-zinc-600">
              <TranslatedTextServer text={`Order ${id} has been successfully transfered to the new owner.`} />
            </Text>
          </>
        )}
        {!success && (
          <>
            <Text className="text-zinc-600">
              <TranslatedTextServer text="There was an error accepting the transfer. Please try again." />
            </Text>
            {error && (
              <Text className="text-red-500"><TranslatedTextServer text={`Error message: ${error}`} /></Text>
            )}
          </>
        )}
      </div>
    </div>
  )
}
