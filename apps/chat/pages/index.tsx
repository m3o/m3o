import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { AuthenticatedLayout } from '@/layouts/authenticated'
import { useAcceptInvite, useInvites } from '@/lib/api/invites'
import Layout from '../components/layout'
import { Button } from '@/components/button'
import { CenteredLoader } from '@/components/loader'
import { MainLayout } from '@/layouts/main'
import { rejectInvite, Invite } from '../lib/invites'
import { useGroups } from '@/lib/api/groups'
import { useUser } from '../lib/user'
import styles from './index.module.scss'

export default function Home() {
    const user = useUser()
    const groups = useGroups()
    const invites = useInvites()
    const acceptInvite = useAcceptInvite()

    if (user.isLoading) {
        return <CenteredLoader />
    }

    return (
        <AuthenticatedLayout>
            <MainLayout>
                <div className="flex items-center justify-between mb-10">
                    <h1 className="font-black text-2xl md:text-4xl">
                        Welcome {user.data!.profile.firstName}
                    </h1>
                    <Link href="/groups/new" className="btn">
                        New Community
                    </Link>
                </div>
                <h2 className="font-medium mb-4">Your Communities</h2>
                <div className="max-w-2xl">
                    {groups.data.map((group) => (
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
                <h2 className="font-medium my-4">Your Invites</h2>
                <div className="max-w-2xl">
                    {invites.data.map((invite) => (
                        <div
                            key={invite.id}
                            className="flex justify-between items-center p-6 rounded-md border border-zinc-200 mb-4 last:mb-0 w-full"
                        >
                            <p>{invite.groupName}</p>
                            <div className="flex gap-2">
                                <button className="text-sm">Decline</button>
                                <Button
                                    className="thin"
                                    showLoader={acceptInvite.isLoading}
                                    onClick={() => {
                                        acceptInvite.mutate(invite.id)
                                    }}
                                >
                                    Accept
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </MainLayout>
        </AuthenticatedLayout>
    )

    function reject(invite: Invite) {
        invitesLoader.mutate(
            invitesLoader.invites?.filter((i) => i.id !== invite.id),
            false
        )
        rejectInvite(invite.id).catch((error: string) =>
            alert(`Error rejecting invite: ${error}`)
        )
    }
}
