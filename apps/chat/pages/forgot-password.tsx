import type { ResetPasswordRequest } from 'm3o/user'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/button'
import { Input } from '@/components/form/input'
import { PublicLayout } from '@/layouts/public'
import { useResetPassword, useSendResetPassword } from '@/lib/api/users'

type EmailFormFields = {
    email: string
}

/* eslint-disable no-unused-vars */
type EmailFormProps = {
    onSubmit: (values: EmailFormFields) => void
    isSubmitting: boolean
}

type ResetPasswordFormProps = {
    onSubmit: (values: ResetPasswordRequest) => void
    isSubmitting: boolean
}
/* eslint-enable */

function EmailForm({ onSubmit, isSubmitting }: EmailFormProps) {
    const { register, handleSubmit } = useForm<EmailFormFields>()

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Input {...register('email', { required: true })} label="Email" />
            <Button showLoader={isSubmitting}>Submit</Button>
        </form>
    )
}

function ResetPasswordForm({ onSubmit, isSubmitting }: ResetPasswordFormProps) {
    const { register, handleSubmit } = useForm<ResetPasswordRequest>()

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Input {...register('code', { required: true })} label="Code" />
                <Input
                    {...register('new_password', { required: true })}
                    label="New Password"
                    type="password"
                />
                <Input
                    {...register('confirm_password', { required: true })}
                    label="Confirm Password"
                    type="password"
                />
                <Button showLoader={isSubmitting}>Submit</Button>
            </form>
        </>
    )
}

export default function ForgotPassword() {
    const sendResetPasswordEmail = useSendResetPassword()

    const resetPassword = useResetPassword(
        sendResetPasswordEmail.variables?.email
    )

    return (
        <PublicLayout>
            {sendResetPasswordEmail.isSuccess ? (
                <ResetPasswordForm
                    onSubmit={resetPassword.mutate}
                    isSubmitting={resetPassword.isLoading}
                />
            ) : (
                <EmailForm
                    onSubmit={sendResetPasswordEmail.mutate}
                    isSubmitting={sendResetPasswordEmail.isLoading}
                />
            )}
        </PublicLayout>
    )
}
