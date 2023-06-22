import { useQuery } from '@tanstack/react-query'
import { api } from '../..'
import type { Group } from '@/types/groups'

async function fetchAllUsersGroups() {
    const response = await api.get<{ groups: Group[] }>('/groups')
    return response.data.groups
}

export function useGroups() {
    return useQuery({
        queryKey: ['groups'],
        queryFn: fetchAllUsersGroups,
        initialData: [],
    })
}
