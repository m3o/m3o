import { useMutation, useQueryClient } from 'react-query'
import { QueryKeys } from '@/lib/constants'
import { useM3OClient } from '..'

export function useDeleteUsers() {
  const m3o = useM3OClient()
  const queryClient = useQueryClient()

  return useMutation(
    (items: string[]) =>
      Promise.all(items.map(item => m3o.user.delete({ id: item }))),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKeys.CloudUsers)
      },
    },
  )
}
