import { useRouter } from 'next/router'
import { useState } from 'react'
import Layout from '../../../../components/layout'
import { useGroup } from '../../../../lib/group'
import { createInvite } from '../../../../lib/invites'
import styles from './new.module.scss'

export default function Home() {
    const router = useRouter()
    const groupLoader = useGroup(router.query.id as string)

    const [email, setEmail] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    // todo: improve error handling
    if (groupLoader.error) {
        router.push('/error')
        return <div />
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            await createInvite(router.query.id as string, email)
            router.push(`/groups/${router.query.id}`)
        } catch ({ error, code }) {
            console.warn(error)
            setLoading(false)
        }
    }

    return (
        <Layout className={styles.container} loading={groupLoader.loading}>
            <h1 className={styles.title}>
                Invite someone to {groupLoader.group?.name}
            </h1>

            <form onSubmit={onSubmit}>
                <label>Email</label>
                <input
                    required
                    type="text"
                    value={email}
                    minLength={1}
                    maxLength={100}
                    disabled={loading}
                    onChange={(e) => setEmail(e.target.value || '')}
                />

                <input
                    type="submit"
                    value="Send invite"
                    disabled={loading || email.length === 0}
                />
            </form>
        </Layout>
    )
}
