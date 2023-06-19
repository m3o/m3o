import type { NextApiRequest, NextApiResponse } from 'next'
import topicsDb from '@/lib/api/topics/db'
import { authenticatedHandler } from '@/lib/authentication'

async function createTopic(req: NextApiRequest, res: NextApiResponse) {
    const id = req.query.group_id as string
    const { name } = req.body

    if (!name) {
        res.status(422).json({
            message: 'No name provided',
        })

        return
    }

    try {
        const alreadyExists = await topicsDb.checkTopicAlreadyExistsOnGroup({
            groupId: id,
            name,
        })

        if (alreadyExists) {
            res.status(403).json({
                message: 'A topic with this name already exists',
            })

            return
        }

        const response = await topicsDb.create({
            name,
            groupId: id,
        })

        const topic = await topicsDb.getById(response.id)

        res.json({ topic })
        return
    } catch (error) {
        console.log(error)
    }
}

export async function getGroupTopics(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const id = req.query.group_id as string

    try {
        const response = await topicsDb.getGroupTopics(id)
        res.json({ topics: response })
    } catch (error) {
        console.log(error)
    }
}

export default authenticatedHandler(async function handler(req, res) {
    if (req.method === 'POST') {
        createTopic(req, res)
        return
    }

    if (req.method === 'GET') {
        getGroupTopics(req, res)
        return
    }

    res.status(405).json({
        message: 'Method not allowed',
    })
})
