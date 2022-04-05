import { useState } from 'react'
import { useMutation } from 'react-query'
import { useM3OClient } from '..'
import { lowercaseFirstLetter } from '@/utils/helpers'

type RequestPayload = Record<string, unknown>

export function usePlaygroundService() {
  const m3o = useM3OClient()
  const [selectedEndpoint, setSelectedEndpoint] = useState('')
  const [requestPayload, setRequestPayload] = useState<RequestPayload>({})

  const run = useMutation(async (apiName?: string) => {
    if (!apiName) return Promise.reject('No API name')
    const endpoint = selectedEndpoint.split('.')[1]

    // @ts-ignore: This is blocking and useless
    const response = await m3o[apiName as any][
      lowercaseFirstLetter(endpoint) as any
    ](requestPayload)

    return response
  })

  return {
    setRequestPayload,
    setSelectedEndpoint,
    selectedEndpoint,
    run,
  }
}
