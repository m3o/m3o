import { useLoginWithOAuth } from './useLoginWithOAuth'

interface UseGoogleLoginProps {
  onSuccess?: VoidFunction
}

const PATH = '/oauth/Oauth/GoogleURL'

export function useGoogleLogin({ onSuccess }: UseGoogleLoginProps = {}) {
  const { mutate: handleGoogleLogin } = useLoginWithOAuth({
    path: PATH,
    onSuccess,
  })

  return {
    handleGoogleLogin,
  }
}
