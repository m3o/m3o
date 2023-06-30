import { useRouter } from 'next/router'
import { createRef, useState } from 'react'
import ChatUI from '../../../components/chat'
import Layout from '../../../components/layout'
import {
    createThread,
    deleteThread,
    leaveGroup,
    removeMember,
    renameGroup,
    updateThread,
    useGroup,
} from '../../../lib/group'
import {
    createInvite,
    Invite,
    revokeInvite,
    useInvites,
} from '../../../lib/invites'
import { Message } from '../../../lib/message'
import { deleteProfile, updateUser, User } from '../../../lib/user'
import styles from './index.module.scss'

interface Chat {
    type: string
    id: string
}

export default function Group() {
    const router = useRouter()
    const groupId: string = (router.query?.id || '').toString()
    const groupLoader = useGroup(groupId)
    const inviteLoader = useInvites(groupId)
    const [chat, setChat] = useState<Chat>()
    const [connected, setConnected] = useState<boolean>(false)
    const [showSidebar, setShowSidebar] = useState<boolean>(false)
    const [subview, setSubview] = useState<
        'settings' | 'chat-settings' | 'edit-profile' | 'manage-invites'
    >(undefined)
    const [user, setUser] = useState<User>()
    const chatUI = createRef<ChatUI>()

    // todo: improve error handling
    if (groupLoader.error || inviteLoader.error) {
        router.push('/error')
        return <div />
    }

    if (!connected && groupLoader.group) {
        setConnected(true)
        const w = groupLoader.group.websocket
        const ws = new WebSocket(w.url)

        ws.onopen = function () {
            console.log('Websocket opened')
            ws.send(JSON.stringify({ token: w.token, topic: w.topic }))
        }

        ws.onmessage = function ({ data }) {
            console.log(data)
            if (data) {
                // todo: fix duplicate encoding?!
                const event = JSON.parse(data)
                const message = JSON.parse(JSON.parse(event.message))

                if (message.group_id && message.group_id !== groupId) {
                    console.log('Ignoring message: ', message)
                    return
                }

                switch (message.type) {
                    case 'group.updated':
                        console.log('Group updated:', message)
                        groupLoader.mutate({ ...groupLoader.group, ...message })
                        break
                    case 'group.user.left':
                        console.log('User left group:', message)
                        if (message.payload.current_user) {
                            alert('You have been removed from the group')
                            window.location.href = '/'
                            return
                        }
                        groupLoader.mutate(
                            {
                                ...groupLoader.group,
                                members: groupLoader.group.members?.filter(
                                    (m) => m.id !== message.payload.id
                                ),
                            },
                            false
                        )
                        break
                    case 'group.user.joined':
                        console.log('User joined group:', message)
                        groupLoader.mutate({
                            ...groupLoader.group,
                            members: [
                                ...groupLoader.group.members,
                                message.payload,
                            ],
                        })
                        break
                    case 'thread.created':
                        console.log('Thread created: ', message)
                        groupLoader.mutate({
                            ...groupLoader.group,
                            threads: [
                                ...groupLoader.group.threads,
                                message.payload,
                            ],
                        })
                        break
                    case 'thread.updated':
                        console.log('Thread updated: ', message)
                        groupLoader.mutate({
                            ...groupLoader.group,
                            threads: [
                                ...groupLoader.group.threads.filter(
                                    (t) => t.id !== message.payload.id
                                ),
                                {
                                    ...groupLoader.group.threads.find(
                                        (t) => t.id === message.payload.id
                                    ),
                                    ...message.payload,
                                },
                            ],
                        })
                        break
                    case 'thread.deleted':
                        console.log('Thread deleted: ', message)
                        groupLoader.mutate(
                            {
                                ...groupLoader.group,
                                threads: groupLoader.group.threads?.filter(
                                    (m) => m.id !== message.payload.id
                                ),
                            },
                            false
                        )
                        if (
                            chat?.type === 'thread' &&
                            chat?.id === message.payload.id
                        )
                            setChat(undefined)
                        break
                    case 'message.created': {
                        console.log('New message: ', message)
                        const group = { ...groupLoader.group }
                        if (message.payload.chat.type === 'chat') {
                            group.members
                                .find((m) => m.id === message.payload.chat.id)
                                .chat.messages.push(message.payload.message)
                        } else if (message.payload.chat.type === 'thread') {
                            const messages =
                                group.threads.find(
                                    (m) => m.id === message.payload.chat.id
                                )?.messages || []
                            group.threads.find(
                                (m) => m.id === message.payload.chat.id
                            ).messages = [...messages, message.payload.message]
                        }
                        groupLoader.mutate(group)
                        break
                    }
                }
            }
        }

        ws.onclose = () => {
            console.log('Websocket closed')
            setConnected(false)
        }

        ws.onerror = (ev) => {
            console.log('Websocket errored ' + JSON.stringify(ev))
        }
    }

    function setChatWrapped(type: string, id: string) {
        const group = { ...groupLoader.group }

        if (
            chat &&
            (chat.type !== type || chat.id !== id) &&
            (window.audioEnabled || window.videoEnabled)
        ) {
            if (
                !confirm(
                    'Are you sure you want to switch rooms? You will be disconnected from audio and video'
                )
            )
                return
        }

        if (chat?.type === 'thread') {
            const threads = [...groupLoader.group.threads]
            if (!threads) {
                console.log('No threads loaded')
                return
            }
            const thr = threads.find((t) => t.id === chat.id)
            if (thr) {
                thr.last_seen = Date.now().toString()
            }

            groupLoader.mutate({ ...group, threads }, false)
        } else if (chat?.type === 'chat') {
            const members = [...group.members]
            const thr = members.find((t) => t.id === chat.id)
            if (thr) {
                thr.chat = {
                    ...(members.find((t) => t.id === chat.id).chat || {}),
                    last_seen: Date.now().toString(),
                }
            }
            groupLoader.mutate({ ...group, members }, false)
        }

        localStorage.setItem(
            `group/${groupId}/chat`,
            JSON.stringify({ type, id })
        )
        setChat({ type, id })
        if (showSidebar) setShowSidebar(false)
    }

    function clearChatWrapped() {
        localStorage.removeItem(`group/${groupId}/chat`)
        setChat(undefined)
    }

    // default to the last opened chat, or the first
    if (chat === undefined && (groupLoader.group?.threads?.length || 0) > 0) {
        const chatStr = localStorage.getItem(`group/${groupId}/chat`)

        if (chatStr) {
            const { type, id } = JSON.parse(chatStr)
            setChatWrapped(type, id)
        } else if (groupLoader.group.threads?.length) {
            setChatWrapped('thread', groupLoader.group.threads[0].id)
        }
    }

    let messages = []
    let participants = []
    if (chat?.type === 'thread') {
        const thread = groupLoader?.group?.threads?.find(
            (s) => s.id === chat.id
        )
        if (!thread) clearChatWrapped()
        messages = thread?.messages || []
        participants = groupLoader?.group?.members || []
    } else if (chat?.type === 'chat') {
        const member = groupLoader?.group?.members?.find(
            (s) => s.id === chat.id
        )
        if (!member) clearChatWrapped()
        messages = member?.chat?.messages || []
        participants = groupLoader.group.members.filter(
            (m) => m.id === chat.id || m.current_user
        )
    }

    async function createChannel() {
        const channel = window.prompt('Enter a new room name')
        if (!channel?.length) return

        try {
            const thread = await createThread(groupId, channel)
            groupLoader.mutate({
                ...groupLoader.group!,
                threads: [...groupLoader.group!.threads, thread],
            })
            setChat({ type: 'thread', id: thread.id })
        } catch (error) {
            alert(`Error creating channel ${channel}: ${error}`)
        }
    }

    async function sendInvite() {
        const email = window.prompt(
            'Enter the email address of the user you want to invite'
        )
        if (!email?.length) return

        try {
            const invite = await createInvite(groupId, email)
            const url = `${window.location.protocol}//${
                window.location.host
            }/login?code=${invite.code}&email=${encodeURI(invite.email)}`
            alert(`Invite created. Copy link: ${url}`)
        } catch (error) {
            alert(`Error sending invite to ${email}: ${error}`)
        }
    }

    async function renameGroupPopup() {
        const name = window.prompt('Enter the new name of the group')
        if (!name?.length) return

        try {
            await renameGroup(groupId, name)
            groupLoader.mutate({ ...groupLoader.group, name })
        } catch (error) {
            alert(`Error renaming group: ${error}`)
        }
    }

    async function logoutPopup() {
        if (!window.confirm('Are you sure you want to logout?')) return
        router.push('/logout')
    }

    async function deleteProfilePopup() {
        if (!window.confirm('Are you sure you want to delete your profile?'))
            return

        try {
            await deleteProfile()
            router.push('/logout')
        } catch (error) {
            alert(`Error deleting profile: ${error}`)
        }
    }

    async function leaveGroupPopup() {
        if (!window.confirm('Are you sure you want to leave this group')) return

        try {
            await leaveGroup(groupId)
            window.location.href = '/'
        } catch (error) {
            alert(`Error leaving group: ${error}`)
        }
    }

    async function deleteThreadPopup() {
        if (!window.confirm('Are you sure you want to delete this room')) return

        try {
            await deleteThread(chat.id)
            groupLoader.mutate({
                ...groupLoader.group,
                threads: groupLoader.group.threads?.filter(
                    (t) => t.id !== chat.id
                ),
            })
        } catch (error) {
            alert(`Error deleting room: ${error}`)
        }
    }

    async function removeUserPopuop() {
        if (
            !window.confirm(
                'Are you sure you want to remove this user from the group?'
            )
        )
            return

        try {
            await removeMember(groupId, chat.id)
            groupLoader.mutate({
                ...groupLoader.group,
                threads: groupLoader.group.members?.filter(
                    (t) => t.id !== chat.id
                ),
            })
        } catch (error) {
            alert(`Error removing user: ${error}`)
        }
    }

    async function renameThreadPopup() {
        const name = window.prompt('Enter the new name of the room')
        if (!name?.length) return

        try {
            await updateThread(chat.id, name)
        } catch (error) {
            alert(`Error renaming thread: ${error}`)
        }
    }

    function showMsgIndicator(type: string, id: string): boolean {
        let resource: { messages?: Message[]; last_seen?: string | number }

        if (type === 'chat') {
            resource = groupLoader.group.members.find((t) => t.id === id)?.chat
        } else if (type === 'thread') {
            resource = groupLoader.group.threads.find((t) => t.id === id)
        }

        if (chat?.type === type && chat?.id === id) return false
        if (!resource?.messages?.length) return false
        if (!resource.last_seen) return true

        const lastSeen = Date.parse(resource.last_seen as string)
        let showIndicator = false
        resource.messages
            .filter((m) => !m.author?.current_user)
            .forEach((msg) => {
                const sentAt = Date.parse(msg.sent_at as string)
                if (sentAt > lastSeen) showIndicator = true
            })
        return showIndicator
    }

    function renderSettings(): JSX.Element {
        return (
            <div className={styles.settingsContainer}>
                <div
                    className={styles.background}
                    onClick={() => setSubview(undefined)}
                />
                <div className={styles.settings}>
                    <h1>Settings</h1>
                    <div
                        className={styles.dismiss}
                        onClick={() => setSubview(undefined)}
                    >
                        <p>🔙</p>
                    </div>

                    <section>
                        <h2>Group</h2>
                        <ul>
                            <li onClick={() => router.push('/')}>
                                Switch group
                            </li>
                            <li onClick={() => leaveGroupPopup()}>
                                Leave group
                            </li>
                            <li onClick={() => renameGroupPopup()}>
                                Rename group
                            </li>
                            <li onClick={() => setSubview('manage-invites')}>
                                Manage invites
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2>Profile</h2>
                        <ul>
                            <li onClick={() => setSubview('edit-profile')}>
                                Edit profile
                            </li>
                            <li onClick={() => deleteProfilePopup()}>
                                Delete profile
                            </li>
                            <li onClick={() => logoutPopup()}>Logout</li>
                        </ul>
                    </section>
                </div>
            </div>
        )
    }

    function renderChatSettings(): JSX.Element {
        return (
            <div className={styles.settingsContainer}>
                <div
                    className={styles.background}
                    onClick={() => setSubview(undefined)}
                />
                <div className={styles.settings}>
                    <h1>
                        {chat.type === 'thread' ? 'Topic' : 'User'} Settings
                    </h1>
                    <div
                        className={styles.dismiss}
                        onClick={() => setSubview(undefined)}
                    >
                        <p>🔙</p>
                    </div>

                    <section>
                        <ul>
                            {chat.type === 'thread' ? (
                                <li
                                    onClick={() =>
                                        renameThreadPopup() &&
                                        setSubview(undefined)
                                    }
                                >
                                    Rename room
                                </li>
                            ) : null}
                            {chat.type === 'thread' ? (
                                <li
                                    onClick={() =>
                                        deleteThreadPopup() &&
                                        setSubview(undefined)
                                    }
                                >
                                    Delete room
                                </li>
                            ) : null}
                            {chat.type === 'thread' ? null : (
                                <li
                                    onClick={() =>
                                        removeUserPopuop() &&
                                        setSubview(undefined)
                                    }
                                >
                                    Remove user from group
                                </li>
                            )}
                        </ul>
                    </section>
                </div>
            </div>
        )
    }

    function deleteInvite(i: Invite) {
        const invites = [...inviteLoader.invites]
        if (
            !confirm(
                `Are you sure you want to delete the invite for ${i.email}?`
            )
        )
            return

        revokeInvite(i.id)
            .then(() =>
                inviteLoader.mutate(invites.filter((x) => i.id !== x.id))
            )
            .catch((err) => alert(`Erorr revoking invite: ${err}`))
    }

    function renderInvites(): JSX.Element {
        return (
            <div className={styles.settingsContainer}>
                <div
                    className={styles.background}
                    onClick={() => setSubview(undefined)}
                />
                <div className={styles.settings}>
                    <h1>Manage Invites</h1>
                    <div
                        className={styles.dismiss}
                        onClick={() => setSubview('settings')}
                    >
                        <p>🔙</p>
                    </div>

                    <section>
                        {inviteLoader.invites?.length ? null : (
                            <p className={styles.emptyState}>
                                There are no pending invites
                            </p>
                        )}
                        <ul>
                            {inviteLoader.invites?.map((i) => (
                                <li key={i.id} onClick={() => deleteInvite(i)}>
                                    <p>{i.email}</p>
                                    <p>Click to delete</p>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>
            </div>
        )
    }

    let initials = ''
    if (user) {
        initials = user.first_name.slice(0, 1) + user.last_name.slice(0, 1)
    } else if (groupLoader.group?.members?.find((m) => m.current_user)) {
        setUser(groupLoader.group?.members?.find((m) => m.current_user))
    }

    function renderEditProfile(): JSX.Element {
        const onSubmit = (e: React.FormEvent) => {
            e.preventDefault()
            setSubview(undefined)
            updateUser(user).catch((err) =>
                alert(`Error updating profile: ${err}`)
            )
        }

        return (
            <div className={styles.settingsContainer}>
                <div
                    className={styles.background}
                    onClick={() => setSubview(undefined)}
                />
                <div className={styles.settings}>
                    <h1>Edit Profile</h1>
                    <div
                        className={styles.dismiss}
                        onClick={() => setSubview('settings')}
                    >
                        <p>🔙</p>
                    </div>

                    <form onSubmit={onSubmit}>
                        <input
                            required
                            placeholder="First name"
                            value={user.first_name}
                            onChange={(e) =>
                                setUser({
                                    ...user,
                                    first_name: e.target.value || '',
                                })
                            }
                        />

                        <input
                            required
                            placeholder="Last name"
                            value={user.last_name}
                            onChange={(e) =>
                                setUser({
                                    ...user,
                                    last_name: e.target.value || '',
                                })
                            }
                        />

                        <input
                            required
                            placeholder="Email"
                            value={user.email}
                            onChange={(e) =>
                                setUser({
                                    ...user,
                                    email: e.target.value || '',
                                })
                            }
                        />

                        <input type="submit" value="Save changes" />
                    </form>
                </div>
            </div>
        )
    }

    function dismissMenu(e: React.MouseEvent<HTMLDivElement>): void {
        setShowSidebar(false)
        setSubview(undefined)
        e.stopPropagation()
    }

    return (
        <Layout
            overrideClassName={styles.container}
            loading={groupLoader.loading}
        >
            {subview === 'settings' ? renderSettings() : null}
            {subview === 'chat-settings' ? renderChatSettings() : null}
            {subview === 'edit-profile' ? renderEditProfile() : null}
            {subview === 'manage-invites' ? renderInvites() : null}

            <div
                className={[
                    styles.sidebar,
                    showSidebar ? styles.show : '',
                ].join(' ')}
            >
                <div
                    className={styles.upper}
                    onClick={() => setSubview('settings')}
                >
                    <h1>{groupLoader.group?.name}
                      <br />
                      <small>{groupLoader.group?.description}</small>
                    </h1>
                    <div className={styles.initials}>
                        <p>{initials}</p>
                    </div>

                    <div className={styles.dismiss} onClick={dismissMenu}>
                        <p>🔙</p>
                    </div>

                    <div className={styles.settingsIcon}>
                        <p>⚙️</p>
                    </div>
                </div>

                <div className={styles.section}>
                    <h3>
                        <span>💬</span> Topics
                    </h3>
                    <ul>
                        {uniqueByID(groupLoader.group?.threads || []).map(
                            (s) => {
                                const onClick = () =>
                                    setChatWrapped('thread', s.id)
                                const className =
                                    chat?.type === 'thread' && chat?.id === s.id
                                        ? styles.linkActive
                                        : null
                                return (
                                    <li
                                        className={className}
                                        onClick={onClick}
                                        key={s.id}
                                    >
                                        <p>{s.topic}</p>
                                        {showMsgIndicator('thread', s.id) ? (
                                            <div
                                                className={styles.msgIndicator}
                                            />
                                        ) : null}
                                    </li>
                                )
                            }
                        )}
                        <li
                            className={styles.gray}
                            key="room"
                            onClick={createChannel}
                        >
                            New Topic
                        </li>
                    </ul>
                </div>

                <div className={styles.section}>
                    <h3>
                        <span>👨‍👩‍👦</span> People
                    </h3>
                    <ul>
                        {groupLoader.group?.members
                            ?.filter((u) => !u.current_user)
                            ?.map((m) => {
                                const onClick = () =>
                                    setChatWrapped('chat', m.id)
                                const className =
                                    chat?.type === 'chat' && chat?.id === m.id
                                        ? styles.linkActive
                                        : null
                                return (
                                    <li
                                        key={m.id}
                                        className={className}
                                        onClick={onClick}
                                    >
                                        <p>
                                            {m.first_name} {m.last_name}
                                        </p>
                                        {showMsgIndicator('chat', m.id) ? (
                                            <div
                                                className={styles.msgIndicator}
                                            />
                                        ) : null}
                                    </li>
                                )
                            })}
                        <li
                            className={styles.gray}
                            key="invite"
                            onClick={sendInvite}
                        >
                            Send Invite
                        </li>
                    </ul>
                </div>
            </div>

            <div className={styles.main}>
                <div className={styles.actionButtons}>
                    <p
                        className={styles.burgerIcon}
                        onClick={() => setShowSidebar(!showSidebar)}
                    >
                        <span>🍔</span>
                    </p>
                    {chat ? (
                        <p onClick={() => setSubview('chat-settings')}>
                            <span>⚙️</span>
                        </p>
                    ) : null}
                </div>

                {chat ? (
                    <ChatUI
                        key={chat.id}
                        chatType={chat.type}
                        chatID={chat.id}
                        ref={chatUI}
                        messages={messages}
                        participants={participants}
                    />
                ) : null}
            </div>
        </Layout>
    )
}

function uniqueByID(array) {
    return array.filter(
        (x, xi) => !array.slice(xi + 1).some((y) => y.id === x.id)
    )
}
