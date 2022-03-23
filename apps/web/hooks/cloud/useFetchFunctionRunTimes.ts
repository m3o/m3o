import { useQuery } from 'react-query'
import { QueryKeys } from '@/lib/constants'
import { useM3OClient } from '..'

export function useFetchFunctionRunTimes() {
  const m3o = useM3OClient()

  const { data, isLoading } = useQuery(
    [QueryKeys.CloudFunctions, 'runtimes'],
    async () => {
      const { runtimes = [] } = await m3o.function.runtimes({})
      return runtimes
    },
  )

  return {
    runTimes: data || [],
    isLoadingRunTimes: isLoading,
  }
}
