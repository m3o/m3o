import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { Button } from '../components/button'
import { Input } from '../components/form/input'
import { PublicLayout } from '../layouts/public'
import { api } from '../lib/api'
import type { RegisterFields } from '../types/user'

export default function Page() {
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm<RegisterFields>()

    const { mutate, isLoading } = useMutation({
        async mutationFn(fields: RegisterFields) {
            await api.post('/signup', fields)
            router.push('/login')
        },
    })

    return (
        <PublicLayout>
            <form onSubmit={handleSubmit((values) => mutate(values))}>
                <Input
                    label="First name"
                    {...register('firstName', {
                        required: 'Please provide your first name',
                    })}
                    autoFocus
                    placeholder="John"
                    error={errors.firstName?.message}
                />
                <Input
                    label="Last name"
                    {...register('lastName', {
                        required: 'Please provide your last name',
                    })}
                    placeholder="Doe"
                    error={errors.lastName?.message}
                />
                <Input
                    label="Email address"
                    {...register('email', {
                        required: 'Please provide your email address',
                    })}
                    placeholder="johndoe@chat.app"
                    error={errors.email?.message}
                />
                <Input
                    label="Password"
                    {...register('password', {
                        required: 'Please provide your password',
                    })}
                    type="password"
                    error={errors.password?.message}
                />
                <Input
                    label="Confirm password"
                    {...register('passwordConfirmation', {
                        required: 'Please confirm your password',
                        validate: (value) => {
                            const values = getValues()

                            return values.password !== value
                                ? 'Your passwords do not match'
                                : null
                        },
                    })}
                    type="password"
                    error={errors.passwordConfirmation?.message}
                />
                <Button type="submit" showLoader={isLoading} className="w-full">
                    Submit
                </Button>
            </form>
        </PublicLayout>
    )
}
