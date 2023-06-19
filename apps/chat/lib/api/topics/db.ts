import type { Topics } from '../../../types/topics'
import { tableNames } from '../../constants'
import { m3o } from '../../m3o'

type CreateTopicInput = { name: string; groupId: string }
type CheckTopicAlreadyExistsOnGroup = { groupId: string; name: string }

async function create(record: CreateTopicInput) {
    return m3o.db.create({
        table: tableNames.topics,
        record,
    })
}

async function getById(id: string) {
    const { records = [] } = await m3o.db.read({
        table: tableNames.topics,
        query: `id == "${id}"`,
    })

    return records[0]
}

async function checkTopicAlreadyExistsOnGroup({
    groupId,
    name,
}: CheckTopicAlreadyExistsOnGroup): Promise<boolean> {
    const { records = [] } = await m3o.db.read({
        table: tableNames.topics,
        query: `groupId == "${groupId}" and name == "${name}"`,
    })

    return records.length > 0
}

async function getGroupTopics(groupId: string): Promise<Topics> {
    const { records = [] } = await m3o.db.read({
        table: tableNames.topics,
        query: `groupId == "${groupId}"`,
    })

    return records as Topics
}

export default {
    checkTopicAlreadyExistsOnGroup,
    create,
    getById,
    getGroupTopics,
}
