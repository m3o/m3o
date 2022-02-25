import type { UseMutateFunction } from 'react-query'
import type { DeleteResponse } from 'm3o/function'
import { useMutation, useQueryClient } from 'react-query'
import { useToast } from '../../../providers/ToastProvider'
import { functions } from '../functions.service'

interface UseDeleteFunction {
  deleteFunction: UseMutateFunction<DeleteResponse, unknown, string, unknown>
  isLoading: boolean
}

export function useDeleteFunction(): UseDeleteFunction {
  const { showToast } = useToast()
  const queryClient = useQueryClient()

  const { mutate, isLoading } = useMutation(
    (name: string) => functions.delete({ name }),
    {
      onSuccess: (response) => {
        console.log(response)
        queryClient.invalidateQueries('functions')
        showToast({
          type: 'Success',
          message: 'Successfully initialized deletion'
        })
      }
    }
  )

  return {
    deleteFunction: mutate,
    isLoading
  }
}
