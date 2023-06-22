import type { Invite } from '../../../types/invites'
import { tableNames } from '@/lib/constants'
import { m3o } from '@/lib/m3o'

type SendInput = {
    email: string
    groupId: string
}

export const invitesDb = {
    async send({ email, groupId }: SendInput) {
        return m3o.db.create({
            table: tableNames.invites,
            record: {
                email,
                groupId,
            },
        })
    },

    async getByUserEmail(email: string): Promise<Invite[]> {
        const { records = [] } = await m3o.db.read({
            table: tableNames.invites,
            query: `email == "${email}"`,
        })

        return records as Invite[]
    },

    async delete(id: string) {
        return m3o.db.delete({
            table: tableNames.invites,
            id,
        })
    },

    async getById(id: string) {
        const { records } = await m3o.db.read({
            table: tableNames.invites,
            query: `id == "${id}"`,
        })

        return records[0] as Invite
    },
}
