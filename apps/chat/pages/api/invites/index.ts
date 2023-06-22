import type { InviteWithGroup } from '../../../types/invites'
import { groupsDb } from '@/lib/api/groups/db'
import { invitesDb } from '@/lib/api/invites/db'
import { authenticatedHandler } from '@/lib/authentication'

export default authenticatedHandler(async function handler(req, res, user) {
    try {
        const invites = await invitesDb.getByUserEmail(user.email)
        const ids = invites.map((item) => item.groupId)
        const groups = await groupsDb.getByIds(ids)

        const invitesWithGroups: InviteWithGroup[] = invites.map((item) => ({
            ...item,
            groupName: groups.find((group) => item.groupId === group.id).name,
        }))

        console.log(groups)

        res.json({ invites: invitesWithGroups })
    } catch (error) {
        console.error(error)
    }
})

// export default async function handler(
//     req: NextApiRequest,
//     res: NextApiResponse
// ) {
//     if (req.method !== 'GET') {
//         res.status(405)
//         return
//     }

//     // get the token from cookies
//     const token = TokenFromReq(req)
//     if (!token) {
//         res.status(401).json({ error: 'No token cookie set' })
//         return
//     }

//     // authenticate the request
//     let user: any
//     try {
//         const rsp = await call('/users/validate', { token })
//         user = rsp.user
//     } catch ({ error, code }) {
//         const statusCode = code === 400 ? 401 : code
//         res.status(statusCode).json({ error })
//         return
//     }

//     // load the invites
//     let invites: any
//     try {
//         const rsp = await call('/invites/List', { email: user.email })
//         invites = rsp.invites || []
//     } catch ({ error, code }) {
//         console.error(`Error loading invites: ${error}, code: ${code}`)
//         res.status(500).json({ error: 'Error loading invites' })
//         return
//     }
//     if (invites.length === 0) {
//         res.json([])
//         return
//     }

//     // load the details for the groups
//     let groups: any
//     try {
//         const rsp = await call('/groups/Read', {
//             ids: invites.map((i) => i.group_id),
//         })
//         groups = rsp.groups
//     } catch ({ error, code }) {
//         console.error(`Error loading groups: ${error}, code: ${code}`)
//         res.status(500).json({ error: 'Error loading groups' })
//         return
//     }

//     // return the response
//     res.json(
//         invites.map((i) => {
//             const group = groups[i.group_id]

//             return {
//                 id: i.id,
//                 code: i.code,
//                 group: {
//                     id: group.id,
//                     name: group.name,
//                 },
//             }
//         })
//     )
// }
