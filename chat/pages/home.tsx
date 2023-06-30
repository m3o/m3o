import Link from 'next/link'
import { useRouter } from 'next/router'
import Layout from '../components/layout'
import { useGroups } from '../lib/group'
import { acceptInvite, rejectInvite, Invite, useInvites } from '../lib/invites'
import { useUser } from '../lib/user'
import styles from './index.module.scss'

export default function Home() {
    const router = useRouter()
    const userLoader = useUser()
    const groupsLoader = useGroups()
    const invitesLoader = useInvites()

    process.on('uncaughtException', function (err) {
        console.log(err)
        console.error(err.stack)
    })

    if (userLoader.error || groupsLoader.error || invitesLoader.error) {
        router.push('/login')
        return <div />
    }

    if (userLoader.loading || groupsLoader.loading || invitesLoader.loading) {
        return <Layout loading={true} />
    }

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
                        <button>Create a Group</button>
                    </Link>
                    <Link href="/discover">
                        <button>Join a Group</button>
                    </Link>
                </div>

                {invitesLoader.invites?.length ? (
                    <div>
                        <h2 className={styles.h2}>Invites:</h2>
                        {invitesLoader.invites?.sort((a, b) => a.group.name > b.group.name ? 1 : -1, ).map((i) => (
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
                            {groupsLoader.groups?.sort((a, b) => a.name > b.name ? 1 : -1, ).map((g) => (
                                <div key={g.id} className={styles.group}>
                                    <p>{g.name}</p>
                                    <small>{g.description}</small>
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
