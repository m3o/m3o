import { tableNames } from '@/lib/constants'
import { m3o } from '@/lib/m3o'

export const membersDb = {
    async getMembersOfGroup(groupId: string) {
        const { records = [] } = await m3o.db.read({
            table: tableNames.members,
            query: `groupId == "${groupId}"`,
        })

        return records
    },
}
