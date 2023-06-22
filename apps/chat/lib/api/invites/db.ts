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
}
