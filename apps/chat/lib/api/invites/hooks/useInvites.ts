import { useQuery } from '@tanstack/react-query'
import { api } from '../..'
import type { InviteWithGroup } from '../../../../types/invites'

export function useInvites() {
    return useQuery({
        queryKey: ['invites'],
        async queryFn() {
            const response = await api.get<{ invites: InviteWithGroup[] }>(
                '/invites'
            )
            return response.data.invites
        },
        initialData: [],
    })
}
