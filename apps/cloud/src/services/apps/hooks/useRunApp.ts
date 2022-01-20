import type { UseMutateFunction } from 'react-query'
import type { RunResponse, RunRequest } from 'm3o/app'
import { useMutation } from 'react-query'
import { useAppsInstance } from './useAppsInstance'

interface UseRunApp {
  run: UseMutateFunction<RunResponse, unknown, RunRequest, unknown>
  isLoading: boolean
}

export function useRunApp(): UseRunApp {
  const app = useAppsInstance()

  const { mutate, isLoading } = useMutation((values: any) => app.run(values), {
    onSuccess: () => {
      alert('app runnning')
    }
  })

  return {
    run: mutate,
    isLoading
  }
}
