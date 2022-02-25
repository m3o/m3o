import type { UseMutateFunction } from 'react-query'
import type { UpdateResponse } from 'm3o/function'
import { useMutation, useQueryClient } from 'react-query'
import { functions } from '../functions.service'
import { useToast } from '../../../providers/ToastProvider'

interface UseUpdateFunction {
  update: UseMutateFunction<UpdateResponse, unknown, string, unknown>
  isLoading: boolean
}

interface UseUpdateFunctionProps {
  onSuccess: VoidFunction
}

export function useUpdateFunction({ onSuccess }: UseUpdateFunctionProps): UseUpdateFunction {
  const { showToast } = useToast()
  const queryClient = useQueryClient()

  const { mutate, isLoading } = useMutation(
    (name: string) => functions.update({ name }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('functions')
        showToast({ type: 'Success', message: 'Started function update' })
        onSuccess()
      }
    }
  )

  return {
    update: mutate,
    isLoading
  }
}
