import { useMutation } from '@tanstack/react-query'
import { api } from '../..'

type EmailFormFields = {
    email: string
}

export function useSendResetPassword() {
    return useMutation({
        mutationFn: (values: EmailFormFields) =>
            api.post('/send-reset-password-email', values),
    })
}
