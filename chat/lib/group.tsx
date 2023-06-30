import useSWR from 'swr'
import { Message } from './message'
import { User } from './user'

export interface Group {
    id: string
    name: string
    members?: User[]
    threads?: Thread[]
    websocket?: Websocket
    description: string
}

export interface Websocket {
    topic: string
    token: string
    url: string
}

export interface Thread {
    id: string
    topic: string
    messages?: Message[]
    last_seen?: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function joinGroup(groupID: string): Promise<Group> {
  return new Promise<Group>((resolve: Function, reject: Function) => {
    fetch(`/api/groups/${groupID}/join`, {
      method: 'POST',
      body: JSON.stringify({}),
    })
      .then(async (rsp) => {
        const body = await rsp.json()
        rsp.status === 200
          ? resolve(body)
          : reject(body.error || rsp.statusText)
      })
      .catch((err) => reject(err))
  })
}

export function useGroups(): {
    groups?: Group[]
    loading: boolean
    error: Error
} {
    const { data, error } = useSWR('/api/groups', fetcher)

    return {
        groups: error ? undefined : data,
        loading: !error && !data,
        error: error,
    }
}

export function useDiscover(): {
    groups?: Group[]
    loading: boolean
    error: Error
} {
    const { data, error } = useSWR('/api/discover', fetcher)

    return {
        groups: error ? undefined : data,
        loading: !error && !data,
        error: error,
    }
}

export function useGroup(
    id: string
): { group?: Group; loading: boolean; error: Error; mutate: Function } {
    const { data, error, mutate } = useSWR('/api/groups/' + id, fetcher)

    return {
        group: error ? undefined : data,
        loading: !error && !data,
        error: error,
        mutate,
    }
}

export function createGroup(name: string, description: string): Promise<Group> {
    return new Promise<Group>((resolve: Function, reject: Function) => {
        fetch('/api/groups', { method: 'POST', body: JSON.stringify({ name, description }) })
            .then(async (rsp) => {
                const body = await rsp.json()
                rsp.status === 201
                    ? resolve(body)
                    : reject(body.error || rsp.statusText)
            })
            .catch((err) => reject(err))
    })
}

export function renameGroup(id: string, name: string): Promise<null> {
    return new Promise<null>((resolve: Function, reject: Function) => {
        fetch('/api/groups/' + id, {
            method: 'PATCH',
            body: JSON.stringify({ name }),
        })
            .then(async (rsp) => {
                const body = await rsp.json()
                rsp.status === 200
                    ? resolve(null)
                    : reject(body.error || rsp.statusText)
            })
            .catch((err) => reject(err))
    })
}

export function leaveGroup(id: string): Promise<null> {
    return new Promise<null>((resolve: Function, reject: Function) => {
        fetch(`/api/groups/${id}/leave`, { method: 'POST' })
            .then(async (rsp) => {
                const body = await rsp.json()
                rsp.status === 200
                    ? resolve(null)
                    : reject(body.error || rsp.statusText)
            })
            .catch((err) => reject(err))
    })
}

export function removeMember(id: string, userID: string): Promise<null> {
    return new Promise<null>((resolve: Function, reject: Function) => {
        fetch(`/api/groups/${id}/removeMember`, {
            method: 'POST',
            body: JSON.stringify({ id: userID }),
        })
            .then(async (rsp) => {
                const body = await rsp.json()
                rsp.status === 200
                    ? resolve(null)
                    : reject(body.error || rsp.statusText)
            })
            .catch((err) => reject(err))
    })
}

export function createThread(groupID: string, topic: string): Promise<Thread> {
    return new Promise<Thread>((resolve: Function, reject: Function) => {
        fetch(`/api/groups/${groupID}/threads`, {
            method: 'POST',
            body: JSON.stringify({ topic }),
        })
            .then(async (rsp) => {
                const body = await rsp.json()
                rsp.status === 201
                    ? resolve(body)
                    : reject(body.error || rsp.statusText)
            })
            .catch((err) => reject(err))
    })
}

export function deleteThread(id: string): Promise<null> {
    return new Promise<null>((resolve: Function, reject: Function) => {
        fetch(`/api/threads/${id}`, { method: 'DELETE' })
            .then(async (rsp) =>
                rsp.status === 200 ? resolve(null) : reject(rsp.statusText)
            )
            .catch((err) => reject(err))
    })
}

export function updateThread(id: string, topic: string): Promise<null> {
    return new Promise<null>((resolve: Function, reject: Function) => {
        fetch(`/api/threads/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ topic }),
        })
            .then(async (rsp) =>
                rsp.status === 200 ? resolve(null) : reject(rsp.statusText)
            )
            .catch((err) => reject(err))
    })
}
