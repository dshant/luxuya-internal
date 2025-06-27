"use client"

import { Button, Heading, Text } from "@medusajs/ui"
import { TranslatedTextServer } from "@modules/common/components/translation/translatest-text-server"
import { useAuthModal } from "@modules/layout/components/new-side-menu/shared-auth-modal"

const SignInPrompt = () => {
  const { openAuthModal } = useAuthModal()

  return (
    <div className="bg-white flex items-center justify-between">
      <div>
        <Heading level="h2" className="txt-xlarge ltr">
          <TranslatedTextServer text="Already have an account?" />
        </Heading>
        <Text className="txt-medium text-ui-fg-subtle mt-2 ltr">
          <TranslatedTextServer text="Sign in for a better experience." />
        </Text>
      </div>
      <div>
        <Button
          variant="secondary"
          className="h-10"
          data-testid="sign-in-button"
          onClick={openAuthModal}
        >
          <TranslatedTextServer text="Sign in" />
        </Button>
      </div>
    </div>
  )
}

export default SignInPrompt
