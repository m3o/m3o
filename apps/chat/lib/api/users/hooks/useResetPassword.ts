import { useMutation } from '@tanstack/react-query'
import type { ResetPasswordRequest } from 'm3o/user'
import { useRouter } from 'next/router'
import { api } from '../..'

export function useResetPassword(email: string) {
    const router = useRouter()

    return useMutation({
        async mutationFn(values: Omit<ResetPasswordRequest, 'email'>) {
            return api.post('/reset-password', { ...values, email })
        },
        onSuccess() {
            router.push('/login')
        },
    })
}
