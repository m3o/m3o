import { CogIcon, PlusCircleIcon } from '@heroicons/react/24/outline'
import { clsx } from 'clsx'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { AddTopicModal } from '../../../components/add-topic-modal'
import { Stream } from '../../../components/stream'
import { GroupLayout } from '../../../layouts/group'
import { useGroup } from '../../../lib/api/groups'
import { useGroupTopics } from '../../../lib/api/topics/hooks/useGroupTopics'
import { InviteUserModal } from 'components/invite-user-modal'

function GroupSidebarTitle({
    onButtonClick,
    title,
}: {
    onButtonClick: VoidFunction
    title: string
}) {
    return (
        <div className="flex items-center justify-between mb-2 mt-6">
            <h2 className="font-medium">{title}</h2>
            <button onClick={onButtonClick}>
                <PlusCircleIcon className="w-4" />
            </button>
        </div>
    )
}

export default function Page() {
    const [showInviteModal, setShowInviteModal] = useState(false)
    const [selectedTopic, setSelectedTopic] = useState('')
    const [showAddTopicModal, setShowAddTopicModal] = useState(false)
    const {
        query: { id },
    } = useRouter()
    const groupId = id as string

    const { data, isLoading } = useGroup(groupId)
    const { data: topics, isLoading: isLoadingTopics } = useGroupTopics(groupId)

    return (
        <GroupLayout showLoader={isLoading || isLoadingTopics}>
            {data && (
                <div className="h-full bg-zinc-50 flex-grow">
                    <div className="flex items-center justify-between px-6 py-4">
                        <h1 className="font-black text-xl">{data.name}</h1>
                        <div className="flex items-center gap-4">
                            <button className="border border-zinc-200 p-2 rounded-full hover:bg-zinc-50">
                                <CogIcon className="w-5" />
                            </button>
                            <button
                                className="btn thin"
                                onClick={() => setShowInviteModal(true)}
                            >
                                Invite
                            </button>
                        </div>
                    </div>
                    <section className="flex h-[calc(100%-79px)]">
                        <aside className="h-full w-3/12 p-4">
                            <GroupSidebarTitle
                                title="Topics"
                                onButtonClick={() => {
                                    setShowAddTopicModal(true)
                                }}
                            />
                            <div className="mb-4">
                                {topics.map((topic) => (
                                    <button
                                        className={clsx(
                                            'text-left whitespace-nowrap overflow-hidden text-ellipsis w-full text-sm p-2 rounded-md',
                                            {
                                                'bg-black text-white':
                                                    topic.id === selectedTopic,
                                                'text-zinc-600':
                                                    topic.id !== selectedTopic,
                                            }
                                        )}
                                        key={topic.id}
                                        onClick={() => {
                                            setSelectedTopic(topic.id)
                                        }}
                                    >
                                        {topic.name}
                                    </button>
                                ))}
                            </div>
                            {/* <GroupSidebarTitle
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
                            /> */}
                        </aside>
                        <Stream topicId={selectedTopic} />
                    </section>
                </div>
            )}
            {showAddTopicModal && (
                <AddTopicModal
                    open={true}
                    onClose={() => {
                        setShowAddTopicModal(false)
                    }}
                    groupId={id as string}
                />
            )}
            {showInviteModal && (
                <InviteUserModal
                    open={true}
                    onClose={() => {
                        setShowInviteModal(false)
                    }}
                    groupId={id as string}
                />
            )}
        </GroupLayout>
    )
}
