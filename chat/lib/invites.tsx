import useSWR from 'swr'
import { Group } from './group'

export interface Invite {
  id: string
  code: string
  email: string
  group?: Group
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useInvites(
  groupID?: string
): { invites?: Invite[]; loading: boolean; error: Error; mutate: Function } {
  const { data, error, mutate } = useSWR(
    groupID ? `/api/groups/${groupID}/invites` : '/api/invites',
    fetcher
  )

  return {
    invites: error ? undefined : data,
    loading: !error && !data,
    error,
    mutate,
  }
}

export function createInvite(groupID: string, email: string): Promise<Invite> {
  return new Promise<Invite>((resolve: Function, reject: Function) => {
    fetch(`/api/groups/${groupID}/invites`, {
      method: 'POST',
      body: JSON.stringify({ email }),
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

export function acceptInvite(id: string): Promise<any> {
  return new Promise<any>((resolve: Function, reject: Function) => {
    fetch(`/api/invites/${id}/accept`, { method: 'POST' })
      .then(async (rsp) => {
        const body = await rsp.json()
        rsp.status === 200
          ? resolve(null)
          : reject(body.error || rsp.statusText)
      })
      .catch((err) => reject(err))
  })
}

export function rejectInvite(id: string): Promise<any> {
  return new Promise<any>((resolve: Function, reject: Function) => {
    fetch(`/api/invites/${id}/reject`, { method: 'POST' })
      .then(async (rsp) => {
        const body = await rsp.json()
        rsp.status === 200
          ? resolve(null)
          : reject(body.error || rsp.statusText)
      })
      .catch((err) => reject(err))
  })
}

export function revokeInvite(id: string): Promise<any> {
  return new Promise<any>((resolve: Function, reject: Function) => {
    fetch(`/api/invites/${id}/revoke`, { method: 'POST' })
      .then(async (rsp) => {
        const body = await rsp.json()
        rsp.status === 200
          ? resolve(null)
          : reject(body.error || rsp.statusText)
      })
      .catch((err) => reject(err))
  })
}
