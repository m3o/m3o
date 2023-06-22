import { type PropsWithChildren, useEffect, type ReactElement } from 'react'
import { useUser } from '@/lib/user'
import { CenteredLoader } from 'components/loader'
import { useRouter } from 'next/router'

export function AuthenticatedLayout({ children }: PropsWithChildren) {
    const { isError, isLoading } = useUser()
    const router = useRouter()

    useEffect(() => {
        if (isError) {
            router.push('/login')
        }
    }, [isError, router])

    if (isLoading) {
        return <CenteredLoader />
    }

    return children as ReactElement
}
