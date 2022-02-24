import type { FC } from 'react'
import { GoogleButton, GithubButton } from './Buttons'
import { useGoogleLogin, useGithubLogin } from '@/hooks'

interface OAuthSignInButtonsProps {
  footerText: string
}

export const OAuthSignInButtons: FC<OAuthSignInButtonsProps> = ({
  footerText,
}) => {
  const { handleGoogleLogin } = useGoogleLogin()
  const { handleGithubLogin } = useGithubLogin()

  return (
    <div className="my-8 pb-8 border-b border-solid relative tbc">
      <div className="grid grid-cols-2 gap-4 w-full">
        <GoogleButton onClick={handleGoogleLogin} />
        <GithubButton onClick={handleGithubLogin} />
      </div>
      <p className="text-center inline-block tbgc absolute transform -translate-x-1/2 left-1/2 -bottom-6 md:-bottom-2.5 px-2 ttc text-sm dark:bg-zinc-800">
        {footerText}
      </p>
    </div>
  )
}
