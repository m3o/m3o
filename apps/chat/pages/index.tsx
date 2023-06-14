import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Layout from '../components/layout'
import { CenteredLoader } from '../components/loader'
import { useGroups } from '../lib/group'
import { acceptInvite, rejectInvite, Invite, useInvites } from '../lib/invites'
import { useUser } from '../lib/user'
import styles from './index.module.scss'

export default function Home() {
    const router = useRouter()
    const user = useUser()
    const groupsLoader = useGroups()
    const invitesLoader = useInvites()

    useEffect(() => {
        if (user.isError) {
            router.push('/login')
        }
    }, [user.isError, router])

    if (user.isLoading || !user.data) {
        return <CenteredLoader />
    }

    return (
        <>
            <header className="py-2 px-4 flex justify-between">
                <Link href="/">
                    <img
                        src="/logo.png"
                        height="35px"
                        width="35px"
                        alt="Logo"
                    />
                </Link>
                <Link
                    href="/logout"
                    className="text-sm text-black hover:underline"
                >
                    Logout
                </Link>
            </header>
            <h1>Welcome {user.data!.profile.firstName}</h1>
            <Link href="/groups/new">New group</Link>
        </>
    )

    function accept(invite: Invite) {
        acceptInvite(invite.id)
            .then(() => router.push(`/groups/${invite.group.id}`))
            .catch((error: string) => {
                alert(`Error accepting invite: ${error}`)
            })
    }

    function reject(invite: Invite) {
        invitesLoader.mutate(
            invitesLoader.invites?.filter((i) => i.id !== invite.id),
            false
        )
        rejectInvite(invite.id).catch((error: string) =>
            alert(`Error rejecting invite: ${error}`)
        )
    }

    return (
        <Layout>
            <div className={styles.inner}>
                <div className={styles.titleContainer}>
                    <h1>Welcome {userLoader.user?.first_name}</h1>
                </div>

                <div className={styles.titleContainer}>
                    <Link href="/groups/new">
                        <button>New Group</button>
                    </Link>
                </div>

                {invitesLoader.invites?.length ? (
                    <div>
                        <h2 className={styles.h2}>Invites:</h2>
                        {invitesLoader.invites?.map((i) => (
                            <div key={i.id} className={styles.group}>
                                <p>{i.group.name}</p>
                                <button
                                    onClick={() => accept(i)}
                                    className={styles.accept}
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => reject(i)}
                                    className={styles.reject}
                                >
                                    Reject
                                </button>
                            </div>
                        ))}
                    </div>
                ) : null}

                {groupsLoader.groups?.length ? (
                    <div>
                        <h2 className={styles.h2}>Your Groups</h2>
                        <div className={styles.groups}>
                            {groupsLoader.groups?.map((g) => (
                                <div key={g.id} className={styles.group}>
                                    <p>{g.name}</p>
                                    <Link href={`/groups/${g.id}`}>
                                        <button>Enter</button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : null}
            </div>
        </Layout>
    )
}
