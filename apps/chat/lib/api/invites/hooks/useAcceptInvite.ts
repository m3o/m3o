import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../..'

export function useAcceptInvite() {
    const queryClient = useQueryClient()

    return useMutation({
        async mutationFn(inviteId: string) {
            return api.post(`/invites/${inviteId}/accept`, {})
        },
        onSuccess() {
            queryClient.invalidateQueries(['invites'])
            queryClient.invalidateQueries(['groups'])
        },
    })
}
