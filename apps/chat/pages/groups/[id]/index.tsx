import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { MainLayout } from '../../../layouts/main'
import { api } from '../../../lib/api'
import type { Group } from '../../../types/groups'
import { CenteredLoader } from '../../../components/loader'
import Link from 'next/link'
import {
    ArrowLeftIcon,
    CogIcon,
    PlusCircleIcon,
} from '@heroicons/react/24/outline'
import { GroupLayout } from '../../../layouts/group'

async function fetchGroup(groupId: string) {
    const response = await api.get<{ group: Group }>(`/groups/${groupId}`)
    return response.data.group
}

function GroupSidebarTitle({
    onButtonClick,
    title,
}: {
    onButtonClick: VoidFunction
    title: string
}) {
    return (
        <div className="flex items-center justify-between">
            <h2 className="font-medium">{title}</h2>
            <button onClick={onButtonClick}>
                <PlusCircleIcon className="w-6" />
            </button>
        </div>
    )
}

export default function Page() {
    const {
        query: { id },
    } = useRouter()

    const { data, isLoading } = useQuery({
        queryKey: ['groups', id],
        queryFn: () => {
            return fetchGroup(id.toString())
        },
        enabled: Boolean(id),
    })

    return (
        <GroupLayout showLoader={isLoading}>
            {data && (
                <div className="p-4 h-full">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="font-black text-2xl flex items-center  gap-3">
                            <Link
                                href="/"
                                className="text-sm flex items-center gap-2 text-black"
                            >
                                <ArrowLeftIcon className="w-4" />
                            </Link>
                            {data.name}
                        </h1>
                        <button className="border border-zinc-200 p-2 rounded-full hover:bg-zinc-50 ">
                            <CogIcon className="w-5" />
                        </button>
                    </div>

                    <section className="flex gap-6 h-full">
                        <aside className="bg-red-100 h-full w-3/12">
                            <button>Stream</button>
                            <GroupSidebarTitle
                                title="Topics"
                                onButtonClick={() => {
                                    console.log(1)
                                }}
                            />
                            <GroupSidebarTitle
                                title="Events"
                                onButtonClick={() => {
                                    console.log('events')
                                }}
                            />
                            <GroupSidebarTitle
                                title="Lists"
                                onButtonClick={() => {
                                    console.log('lists')
                                }}
                            />
                        </aside>
                        <div className="w-9/12 bg-red-200 h-full">Content</div>
                    </section>
                </div>
            )}
        </GroupLayout>
    )
}
