import { useMutation } from 'react-query'
import { fetchOAuthRedirectUrl } from '@/lib/api/m3o/auth'

interface UseGoogleLoginProps {
  path: string
  onSuccess?: VoidFunction
}

const PATH = '/oauth/Oauth/GoogleURL'

export function useLoginWithOAuth({ path, onSuccess }: UseGoogleLoginProps) {
  return useMutation(() => fetchOAuthRedirectUrl(path), {
    onSuccess: url => {
      if (onSuccess) {
        onSuccess()
      }

      window.location.href = url
    },
  })
}
