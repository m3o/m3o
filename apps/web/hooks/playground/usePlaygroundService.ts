import { useState } from 'react'
import { useMutation } from 'react-query'
import { useM3OClient } from '..'

type RequestPayload = Record<string, unknown>

export function usePlaygroundService(apiName?: string) {
  const m3o = useM3OClient()
  const [selectedEndpoint, setSelectedEndpoint] = useState('')
  const [requestPayload, setRequestPayload] = useState<RequestPayload>({})

  const run = useMutation(async () => {
    if (apiName) return Promise.reject('No API name')
    const endpoint = selectedEndpoint.split('.')[1]
    const response = await m3o[apiName as any][endpoint](requestPayload)
    return response
  })

  return {
    setRequestPayload,
    setSelectedEndpoint,
    selectedEndpoint,
    run,
  }
}
