import { useRouter } from 'next/router'
import Layout from '../components/layout'
import { logout } from '../lib/user'

export default function Logout() {
    const router = useRouter()
    const { loading } = logout()

    if (!loading) {
        router.push('/login')
    }

    return <Layout loading={true} />
}
