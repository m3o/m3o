import type { UseMutateFunction } from 'react-query'
import type { RunResponse, RunRequest } from 'm3o/app'
import { useNavigate } from 'react-router-dom'
import { useMutation } from 'react-query'
import { apps } from '../apps.service'
import { useToast } from '../../../providers/ToastProvider'

interface UseRunApp {
  run: UseMutateFunction<RunResponse, unknown, RunRequest, unknown>
  isLoading: boolean
}

export function useRunApp(): UseRunApp {
  const navigate = useNavigate()
  const { showToast } = useToast()

  const { mutate, isLoading } = useMutation((values: any) => apps.run(values), {
    onSuccess: () => {
      navigate('/apps')
      showToast({ type: 'Success', message: 'App successfully created' })
    }
  })

  return {
    run: mutate,
    isLoading
  }
}
