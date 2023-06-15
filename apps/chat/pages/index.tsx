import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import Layout from '../components/layout'
import { CenteredLoader } from '../components/loader'
import { MainLayout } from '../layouts/main'
import { useGroups } from '../lib/group'
import { acceptInvite, rejectInvite, Invite, useInvites } from '../lib/invites'
import { useUser } from '../lib/user'
import styles from './index.module.scss'

export default function Home() {
    const router = useRouter()
    const user = useUser()
    const groups = useGroups()
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
        <MainLayout>
            <div className="flex items-center justify-between mb-10">
                <h1 className="font-black text-2xl md:text-4xl">
                    Welcome {user.data!.profile.firstName}
                </h1>
                <Link href="/groups/new" className="btn">
                    New Community
                </Link>
            </div>
            <div>
                <h2 className="font-medium mb-4">Your Communities</h2>
                <div className="max-w-2xl">
                    {groups.data?.map((group) => (
                        <Link
                            key={group.id}
                            href={`/groups/${group.id}`}
                            className="flex justify-between items-center p-6 rounded-md border border-zinc-200 mb-4 last:mb-0 w-full hover:bg-zinc-50 text-black group"
                        >
                            <p>{group.name}</p>
                            <ArrowRightIcon className="w-4 group-hover:translate-x-2 transition" />
                        </Link>
                    ))}
                </div>
            </div>
        </MainLayout>
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
            </div>
        </Layout>
    )
}
