import { useQuery } from 'react-query'
import { QueryKeys } from '@/lib/constants'
import { useM3OClient } from '@/hooks'
import { Spinner, Alert } from '@/components/ui'

type Props = {
  appName: string
}

export function Logs({ appName }: Props) {
  const m3o = useM3OClient()

  const { data, isFetching, isError, error } = useQuery(
    [QueryKeys.CloudApps, appName, 'logs'],
    async () => {
      const response = await m3o.app.logs({ name: appName, logs_type: 'build' })
      return response.logs
    },
  )

  if (isFetching) {
    return <Spinner />
  }

  return (
    <div className="pt-10">
      {isError && error ? (
        <Alert type="error">{(error as any).detail}</Alert>
      ) : (
        <textarea
          value={data}
          className="w-full p-10 text-sm bg-zinc-800 h-96"
        />
      )}
    </div>
  )
}
