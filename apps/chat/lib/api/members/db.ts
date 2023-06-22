import { tableNames } from '@/lib/constants'
import { m3o } from '@/lib/m3o'

type AddToGroupInput = {
    groupId: string
    userId: string
}

export const membersDb = {
    async getMembersOfGroup(groupId: string) {
        const { records = [] } = await m3o.db.read({
            table: tableNames.members,
            query: `groupId == "${groupId}"`,
        })

        return records
    },

    async addToGroup(input: AddToGroupInput) {
        return m3o.db.create({
            table: tableNames.members,
            record: input,
        })
    },
}
