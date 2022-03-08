import { useMutation, useQueryClient } from 'react-query'
import { useRouter } from 'next/router'
import { useM3OClient } from '..'

export function useDeleteApp(name: string) {
  const router = useRouter()
  const m3o = useM3OClient()
  const queryClient = useQueryClient()

  return useMutation(() => m3o.app.delete({ name }), {
    onSuccess: () => {
      queryClient.invalidateQueries(['apps', name])
      router.push('/cloud/apps')
    },
  })
}
