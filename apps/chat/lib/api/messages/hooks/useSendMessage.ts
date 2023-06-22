import { useMutation } from '@tanstack/react-query'
import { api } from '../..'

type UseSendMessageInput = {
    groupId: string
    topicId: string
}

export function useSendMessage({ groupId, topicId }: UseSendMessageInput) {
    return useMutation({
        async mutationFn(values: { message: string }) {
            const response = await api.post(
                `/groups/${groupId}/topics/${topicId}/message`,
                values
            )

            console.log(response)
        },
    })
}
