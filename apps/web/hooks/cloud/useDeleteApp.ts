import { useMutation, useQueryClient } from 'react-query'
import { useM3OClient } from '..'

export function useDeleteApp(name: string) {
  const m3o = useM3OClient()
  const queryClient = useQueryClient()

  return useMutation(() => m3o.app.delete({ name }), {
    onSuccess: () => {
      queryClient.invalidateQueries(['apps', name])
    },
  })
}
