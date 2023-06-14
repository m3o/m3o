import { useRouter } from 'next/router'
import { useState } from 'react'
import { MainLayout } from '../../layouts/main'
import { useGroups, createGroup } from '../../lib/group'
import styles from './new.module.scss'
import { useMutation } from '@tanstack/react-query'
import { api } from '../../lib/api'

export default function Home() {
    const router = useRouter()
    const groupsLoader = useGroups()

    const [name, setName] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    const { mutate } = useMutation({
        mutationFn: (values: { name: string }) => {
            return api.post('/groups', values)
        },
    })

    // todo: improve error handling
    if (groupsLoader.error) {
        router.push('/error')
        return <div />
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            mutate({ name })
            // router.push('/')
        } catch ({ error, code }) {
            console.warn(error)
            setLoading(false)
        }
    }

    return (
        <MainLayout>
            <h1 className={styles.title}>
                {groupsLoader.groups?.length
                    ? 'Create a group'
                    : 'Create your first group'}
            </h1>

            <form onSubmit={onSubmit}>
                <label>Name</label>
                <input
                    required
                    type="text"
                    value={name}
                    minLength={1}
                    maxLength={100}
                    disabled={loading}
                    onChange={(e) => setName(e.target.value || '')}
                />

                <input
                    type="submit"
                    value="Create group"
                    disabled={loading || name.length === 0}
                />
            </form>
        </MainLayout>
    )
}
