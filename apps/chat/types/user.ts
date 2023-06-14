export type RegisterFields = {
    firstName: string
    lastName: string
    email: string
    password: string
    passwordConfirmation: string
}

export type LoginFields = {
    email: string
    password: string
}

export type Profile = {
    firstName: string
    lastName: string
}

export type UserAccount = {
    created: string
    email: string
    id: string
    profile: Profile
    updated: string
    username: string
    verification_date: string
    verified: boolean
}
