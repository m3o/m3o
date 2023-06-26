import { User } from './user'

export interface Message {
    id: string
    text: string
    sent_at?: string | number
    author?: User
}

export interface Resource {
    type: string
    id: string
}

export function createMessage(
    resource: Resource,
    msg: Message
): Promise<Message> {
    return new Promise<Message>((resolve: Function, reject: Function) => {
        fetch(`/api/${resource.type}s/${resource.id}/messages`, {
            method: 'POST',
            body: JSON.stringify(msg),
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

export function fetchMessage(
    resourceType: string,
    resourceID: string
): Promise<Message[]> {
    return new Promise<Message[]>((resolve: Function, reject: Function) => {
        fetch(`/api/${resourceType}s/${resourceID}/messages`, { method: 'GET' })
            .then(async (rsp) => {
                const body = await rsp.json()
                rsp.status === 200
                    ? resolve(body)
                    : reject(body.error || rsp.statusText)
            })
            .catch((err) => reject(err))
    })
}
