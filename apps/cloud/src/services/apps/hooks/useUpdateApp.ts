import type { UseMutateFunction } from 'react-query'
import type { UpdateResponse } from 'm3o/app'
import { useMutation, useQueryClient } from 'react-query'
import { apps } from '../apps.service'
import { useToast } from '../../../providers/ToastProvider'

interface UseUpdateApp {
  update: UseMutateFunction<UpdateResponse, unknown, string, unknown>
  isLoading: boolean
}

interface UseUpdateAppProps {
  onSuccess: VoidFunction
}

export function useUpdateApp({ onSuccess }: UseUpdateAppProps): UseUpdateApp {
  const { showToast } = useToast()
  const queryClient = useQueryClient()

  const { mutate, isLoading } = useMutation(
    (name: string) => apps.update({ name }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('apps')
        showToast({ type: 'Success', message: 'Started app update' })
        onSuccess()
      }
    }
  )

  return {
    update: mutate,
    isLoading
  }
}
