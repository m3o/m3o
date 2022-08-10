import type { CreateRequest } from 'm3o/user'
import type { AxiosError } from 'axios'
import { useMutation } from 'react-query'
import { useRouter } from 'next/router'
import { useM3OClient } from '..'

export function useAddUser() {
  const m3o = useM3OClient()
  const router = useRouter()

  return useMutation(
    (fields: CreateRequest) =>
      m3o.user.create({ ...fields, username: fields.email }),
    {
      onSuccess: () => {
        router.push('/cloud/users')
      },
    },
  )
}
