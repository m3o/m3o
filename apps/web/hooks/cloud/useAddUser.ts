import type { CreateRequest } from 'm3o/user'
import type { AxiosError } from 'axios'
import { useMutation } from 'react-query'
import { useRouter } from 'next/router'
import { useM3OClient } from '..'

export function useAddUser() {
  const m3o = useM3OClient()
  const router = useRouter()

  return useMutation(
    async (fields: CreateRequest) => {
      try {
        await m3o.user.create({ ...fields, username: fields.email })
      } catch (e) {
        const error = e as AxiosError
        throw (error.response!.data as ApiError).detail
      }
    },
    {
      onSuccess: () => {
        router.push('/cloud/users')
      },
    },
  )
}
