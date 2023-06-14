import { authenticatedHandler } from '../../lib/authentication'

export default authenticatedHandler(async function handler(_, res, user) {
    try {
        res.json({ user })
    } catch (error) {
        console.error(error)
    }

    // let user: any
    // try {
    //     const rsp = await call('/users/validate', { token })
    //     user = rsp.user
    // } catch ({ error, code }) {
    //     const statusCode = code === 400 ? 401 : code
    //     res.status(statusCode).json({ error })
    //     return
    // }

    // if (req.method === 'GET') {
    //     res.status(200).json({ user })
    //     return
    // }

    // if (req.method === 'PATCH') {
    //     let body = {}
    //     try {
    //         body = JSON.parse(req.body)
    //     } catch {
    //         res.status(400).json({ error: 'Error parsing request body' })
    //         return
    //     }

    //     try {
    //         await call('/users/update', { ...body, id: user.id })
    //         res.status(200).json({})
    //     } catch ({ error, code }) {
    //         console.error(`Error updating user: ${error}`)
    //         res.status(code).json({ error })
    //     }
    //     return
    // }

    // if (req.method !== 'DELETE') {
    //     res.status(405).json({})
    //     return
    // }

    // // load the groups
    // let groups = []
    // try {
    //     const rsp = await call('/groups/List', { member_id: user.id })
    //     groups = rsp.groups
    // } catch ({ error, code }) {
    //     console.error(`Error loading groups: ${error}. code: ${code}`)
    //     res.status(500).json({ error })
    //     return
    // }

    // // leave each group
    // try {
    //     await groups.forEach(
    //         async (g) =>
    //             await call('/groups/RemoveMember', {
    //                 group_id: g.id,
    //                 member_id: user.id,
    //             })
    //     )
    // } catch ({ error, code }) {
    //     res.status(500).json({ error })
    //     return
    // }

    // // delete the user
    // await call('/users/delete', { id: user.id })
    // res.status(200).json({})
})
