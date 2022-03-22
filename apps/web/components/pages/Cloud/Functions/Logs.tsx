import { useQuery } from 'react-query'
import { useRouter } from 'next/router'
import { useM3OClient } from '@/hooks'
import { QueryKeys } from '@/lib/constants'
import { Alert } from '@/components/ui'

export function FunctionLogs() {
  const m3o = useM3OClient()
  const router = useRouter()

  const { data, isError, error } = useQuery(
    [QueryKeys.CloudFunctions, router.query.id, 'logs'],
    async () => {
      const response = await m3o.function.logs({
        name: router.query.id as string,
        logs_type: 'build',
      })
      return response.logs
    },
  )

  console.log(data)

  return (
    <div className="pt-10">
      {isError && error ? (
        <Alert type="error">{(error as any).detail}</Alert>
      ) : (
        <textarea
          value={data}
          className="w-full p-10 text-xs bg-zinc-800 h-96"
        />
      )}
    </div>
  )
}
