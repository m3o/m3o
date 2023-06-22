export type Invite = {
    email: string
    groupId: string
    id: string
}

export type InviteWithGroup = Invite & {
    groupName: string
}
