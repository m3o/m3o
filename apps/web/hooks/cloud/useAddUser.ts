import type { CreateRequest, CreateResponse } from 'm3o/user'
import type { AxiosError } from 'axios'
import { useMutation } from 'react-query'
import { useRouter } from 'next/router'
import { apiClient } from '@/lib/api-client'

export function useAddUser() {
  const router = useRouter()

  return useMutation(
    async (fields: CreateRequest) => {
      try {
        await apiClient.post<CreateResponse>('user/create', {
          ...fields,
          username: fields.email,
        })
      } catch (e) {
        const error = e as AxiosError
        throw (error.response!.data as ApiError).Detail
      }
    },
    {
      onSuccess: () => {
        router.push('/cloud/users')
      },
    },
  )
}
