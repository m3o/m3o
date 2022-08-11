import { useMutation, useQueryClient } from 'react-query'
import { useM3OClient } from '..'
import { QueryKeys } from '@/lib/constants'

export function useUpdateApp(name: string) {
  const m3o = useM3OClient()
  const queryClient = useQueryClient()

  return useMutation(() => m3o.app.update({ name }), {
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.CloudApps, name])
    },
  })
}
