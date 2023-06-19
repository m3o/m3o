import { useMutation } from '@tanstack/react-query'
import { api } from '../..'

type UseSendMessageInput = {
    groupId: string
    contextId: string
}

type MessageItem = {
    content: string
    contextId: string
    groupId: string
    type: 'message'
}

export function useSendMessageStreamItem({
    groupId,
    contextId,
}: UseSendMessageInput) {
    return useMutation({
        mutationFn: (payload: { content: string }) => {
            return api.post(`/groups/${groupId}/stream`, {
                content: payload.content,
                groupId,
                contextId,
                type: 'message',
            } as MessageItem)
        },
    })
}
