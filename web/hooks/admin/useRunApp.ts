import type { RunRequest } from 'm3o/app'
import type { AxiosError } from 'axios'
import { useMutation } from 'react-query'
import { useRouter } from 'next/router'
import { useM3OClient } from '..'

export function useRunApp() {
  const m3o = useM3OClient()
  const router = useRouter()

  return useMutation((fields: RunRequest) => m3o.app.run(fields), {
    onSuccess: () => {
      router.push('/admin/apps')
    },
  })
}
