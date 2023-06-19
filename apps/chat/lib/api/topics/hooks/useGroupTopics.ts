import { useQuery } from '@tanstack/react-query'
import { api } from '../..'
import type { Topics } from '../../../../types/topics'

async function fetchTopics(groupId: string) {
    const response = await api.get<{ topics: Topics }>(
        `/groups/${groupId}/topics`
    )
    return response.data.topics
}

export function useGroupTopics(id?: string) {
    return useQuery({
        queryKey: ['groups', id, 'topics'],
        queryFn: () => fetchTopics(id),
        enabled: Boolean(id),
    })
}
