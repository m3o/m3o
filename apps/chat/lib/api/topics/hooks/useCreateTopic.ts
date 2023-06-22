import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../..'

export function useCreateTopic(groupId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        async mutationFn(values: { name: string }) {
            return api.post(`/groups/${groupId}/topics`, values)
        },
        onSuccess() {
            queryClient.invalidateQueries(['groups', groupId, 'topics'])
            // rest.onClose()
        },
    })
}
