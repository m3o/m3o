import { useRouter } from 'next/router'
import Layout from '../components/layout'
import { useGroups } from '../lib/group'
import { useInvites } from '../lib/invites'
import { useUser } from '../lib/user'

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

    router.push("/home")
}
