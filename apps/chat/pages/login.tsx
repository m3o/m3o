import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { Button } from '../components/button'
import { Input } from '../components/form/input'
import { PublicLayout } from '../layouts/public'
import { api } from '../lib/api'
import type { LoginFields, UserAccount } from '../types/user'

const login = async (values: LoginFields) => {
    try {
        const response = await api.post<{ user: UserAccount }>('/login', values)
        return response.data.user
    } catch (error) {
        const _error = error as AxiosError
        throw (_error.response?.data as { message: string }).message
    }
}

export default function Login() {
    const router = useRouter()
    const { register, handleSubmit } = useForm<LoginFields>()

    const { mutate, isLoading, error } = useMutation({
        async mutationFn(values: LoginFields) {
            return login(values)
        },
        onSuccess() {
            router.push('/')
        },
    })

    return (
        <PublicLayout>
            <Head>
                <title>Login | Micro</title>
            </Head>
            <form onSubmit={handleSubmit((values) => mutate(values))}>
                {error && (
                    <p className="text-red-600 text-sm mb-6">
                        {error as string}
                    </p>
                )}
                <Input
                    type="email"
                    label="Email"
                    {...register('email', {
                        required: 'Please provide your email',
                    })}
                />
                <Input
                    type="password"
                    label="Password"
                    {...register('password', {
                        required: 'Please provide your password',
                    })}
                />
                <Button type="submit" className="w-full" showLoader={isLoading}>
                    Submit
                </Button>
            </form>
            <p className="mt-4 mb-2">
                <Link href="/forgot-password" className="text-sm">
                    Forgot password?
                </Link>
            </p>
            <p>
                <Link href="/signup" className="text-sm">
                    Don&apos;t have an account? Click here to sign up
                </Link>
            </p>
        </PublicLayout>
    )
}
