import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../..'

type NewGroupFields = {
    name: string
    paid: boolean
}

export function useCreateGroup() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (values: NewGroupFields) =>
            api.post<{ group: { id: string } }>('/groups', values),
        onSuccess() {},
    })
}
