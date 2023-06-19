import { useQuery } from '@tanstack/react-query'
import { api } from '../..'

type UseGetStreamItemsFromContextInput = {
    groupId: string
    contextId: string
}

export function useGetStreamItemsFromContext({
    groupId,
    contextId,
}: UseGetStreamItemsFromContextInput) {
    return useQuery({
        queryKey: ['groups', groupId, 'context', contextId],
        queryFn: () => api.get(`/groups/${groupId}/stream/${contextId}`),
        enabled: Boolean(groupId) && Boolean(contextId),
    })
}
