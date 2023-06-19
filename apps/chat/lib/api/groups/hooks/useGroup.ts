import { useQuery } from '@tanstack/react-query'
import { api } from '../..'
import type { Group } from '../../../../types/groups'

async function fetchGroup(groupId: string) {
    const response = await api.get<{ group: Group }>(`/groups/${groupId}`)
    return response.data.group
}

export function useGroup(id?: string) {
    return useQuery({
        queryKey: ['groups', id],
        queryFn: () => fetchGroup(id),
        enabled: Boolean(id),
    })
}
