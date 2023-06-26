import { useLoginWithOAuth } from './useLoginWithOAuth'

interface UseGithubLoginProps {
  onSuccess?: VoidFunction
}

export const PATH = '/oauth/Oauth/GithubURL'

export function useGithubLogin({ onSuccess }: UseGithubLoginProps = {}) {
  const { mutate: handleGithubLogin } = useLoginWithOAuth({
    path: PATH,
    onSuccess,
  })

  return {
    handleGithubLogin,
  }
}
