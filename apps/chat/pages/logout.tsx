import { useMutation } from '@tanstack/react-query'
import { useEffect } from 'react'
import { api } from '@/lib/api'
import { CenteredLoader } from '../components/loader'

export default function Logout() {
    const { isLoading, mutate } = useMutation({
        async mutationFn() {
            return api.post('/logout')
        },
    })

    useEffect(() => {
        mutate()
    }, [mutate])

    useEffect(() => {
        if (!isLoading) {
            window.location.href = '/login'
        }
    }, [isLoading])

    if (isLoading) {
        return <CenteredLoader />
    }

    return null
}
