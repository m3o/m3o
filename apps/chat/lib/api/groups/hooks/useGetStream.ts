import { useQuery } from '@tanstack/react-query'
import { api } from '../..'

type UseGetStreamInput = {
    contextId?: string
    groupId: string
}

type StreamItem = {
    content: string
    contextId: string
    createdAt: string
    id: string
    type: 'message'
    userId: string
}

export function useGetStream({ contextId, groupId }: UseGetStreamInput) {
    return useQuery({
        queryKey: ['groups', groupId, 'context', contextId],
        async queryFn() {
            const response = await api.get<{ stream: StreamItem[] }>(
                `/groups/${groupId}/stream/${contextId}`
            )

            return response.data.stream
        },
        enabled: Boolean(contextId),
    })
}
