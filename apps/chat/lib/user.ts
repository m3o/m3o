import { useQuery } from '@tanstack/react-query'
import useSWR from 'swr'
import type { UserAccount } from '../types/user'
import { api } from './api'

async function getUser() {
    try {
        const response = await api.get<{ user: UserAccount }>('/profile')
        return response.data.user
    } catch (error) {
        console.log(error)
    }
}

const fetcher = (url: string) =>
    fetch(url).then((res) => {
        if (res.status === 200 || res.status === 201) {
            return res.json()
        } else {
            throw `Error: ${res.statusText}`
        }
    })

export function useUser() {
    return useQuery({
        queryKey: ['user'],
        queryFn: getUser,
    })
}

export function updateUser(user: UserAccount): Promise<null> {
    return new Promise<null>((resolve: Function, reject: Function) => {
        const params = {
            first_name: user.profile.firstName,
            last_name: user.profile.lastName,
            email: user.email,
        }
        fetch('/api/profile', { method: 'PATCH', body: JSON.stringify(params) })
            .then(async (rsp) => {
                const body = await rsp.json()
                rsp.status === 200
                    ? resolve(null)
                    : reject(body.error || rsp.statusText)
            })
            .catch((err) => reject(err))
    })
}

export function logout(): { loading: boolean; error: Error } {
    // TODO: fix
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data, error } = useSWR('/api/logout', fetcher)

    return {
        loading: !error && !data,
        error: error,
    }
}

export function deleteProfile(): Promise<null> {
    return new Promise<null>((resolve: Function, reject: Function) => {
        fetch('/api/profile', { method: 'DELETE' })
            .then(async (rsp) => {
                try {
                    const body = await rsp.json()
                    rsp.status === 200
                        ? resolve(null)
                        : reject(body.error || rsp.statusText)
                } catch {
                    rsp.status === 200 ? resolve(null) : reject(rsp.statusText)
                }
            })
            .catch((err) => reject(err))
    })
}

export function sendPasswordReset(email: string): Promise<null> {
    return new Promise<null>((resolve: Function, reject: Function) => {
        fetch('/api/sendPasswordReset', {
            method: 'POST',
            body: JSON.stringify({ email }),
        })
            .then(async (rsp) => {
                try {
                    const body = await rsp.json()
                    rsp.status === 200
                        ? resolve(null)
                        : reject(body.error || rsp.statusText)
                } catch {
                    rsp.status === 200 ? resolve(null) : reject(rsp.statusText)
                }
            })
            .catch((err) => reject(err))
    })
}

export function verifyPasswordReset(
    email: string,
    code: string,
    password: string
): Promise<null> {
    return new Promise<null>((resolve: Function, reject: Function) => {
        fetch('/api/verifyPasswordReset', {
            method: 'POST',
            body: JSON.stringify({ email, code, password }),
        })
            .then(async (rsp) => {
                try {
                    const body = await rsp.json()
                    rsp.status === 200
                        ? resolve(null)
                        : reject(body.error || rsp.statusText)
                } catch {
                    rsp.status === 200 ? resolve(null) : reject(rsp.statusText)
                }
            })
            .catch((err) => reject(err))
    })
}
