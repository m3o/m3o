import Link from 'next/link'
import { useRouter } from 'next/router'
import Layout from '../components/layout'
import { useDiscover } from '../lib/group'
import { requestInvite } from '../lib/invites'
import styles from './index.module.scss'

export default function Home() {
    const router = useRouter()
    const groupsLoader = useDiscover()

    process.on('uncaughtException', function (err) {
        console.log(err)
        console.error(err.stack)
    })

    if (groupsLoader.error) {
        router.push('/login')
        return <div />
    }

    if (groupsLoader.loading) {
        return <Layout loading={true} />
    }

    function request(group_id: string) {
        requestInvite(group_id)
            .then(() => router.push(`/groups/${group_id}`))
            .catch((error: string) => {
                alert(`Error requesting invite: ${error}`)
            })
    }

    return (
        <Layout>
            <div className={styles.inner}>
                <div className={styles.titleContainer}>
                    <h1>Discover Groups</h1>
                </div>

                <div className={styles.titleContainer}>
                    <Link href="/groups/new">
                        <button>Create a Group</button>
                    </Link>
                </div>

                {groupsLoader.groups?.length ? (
                    <div>
                        <h2 className={styles.h2}>All Groups</h2>
                        <div className={styles.groups}>
                            {groupsLoader.groups?.sort((a, b) => a.name > b.name ? 1 : -1, ).map((g) => (
                                <div key={g.id} className={styles.group}>
                                    <p>{g.name}</p>
                                    <button
                                      onClick={() => request(g.id)}>
                                       Join
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : null}
            </div>
        </Layout>
    )
}
