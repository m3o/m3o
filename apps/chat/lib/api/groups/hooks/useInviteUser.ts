import { useMutation } from '@tanstack/react-query'
import { api } from '../..'

export function useInviteUser(groupId: string) {
    return useMutation({
        async mutationFn(payload: { email: string }) {
            const response = await api.post(
                `/groups/${groupId}/invite`,
                payload
            )
            console.log(response)
        },
    })
}
