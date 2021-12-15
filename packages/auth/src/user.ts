import { UserService } from 'm3o/user'

const M3O_KEY = process.env.M3O_KEY as string

export const user = new UserService(M3O_KEY)
