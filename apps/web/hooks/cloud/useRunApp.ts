import type { RunRequest } from 'm3o/app'
import type { AxiosError } from 'axios'
import { useMutation } from 'react-query'
import { useRouter } from 'next/router'
import { apiClient } from '@/lib/api-client'

export function useRunApp() {
  const router = useRouter()

  return useMutation(
    async (fields: RunRequest) => {
      try {
        await apiClient.post('app/Run', fields)
      } catch (e) {
        const error = e as AxiosError
        throw (error.response!.data as ApiError).Detail
      }
    },
    {
      onSuccess: () => {
        router.push('/cloud/apps')
      },
    },
  )
}
