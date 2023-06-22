import type { Group } from '../../../types/groups'
import { tableNames } from '@/lib/constants'
import { m3o } from '@/lib/m3o'

export const groupsDb = {
    async byId(groupId: string): Promise<Group | undefined> {
        const { records = [] } = await m3o.db.read({
            table: tableNames.groups,
            query: `id == "${groupId}"`,
        })

        return (records as Group[])[0]
    },

    async getByIds(ids: string[]) {
        const { records = [] } = await m3o.db.read({
            table: tableNames.groups,
            query: `id == ${ids.map((id) => `"${id}"`).join(' or id ==')}`,
        })

        return records
    },
}
