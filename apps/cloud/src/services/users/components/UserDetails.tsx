import type { FC } from 'react'
import type { Account } from 'm3o/user'
import { formatDate } from '../../../utils'
import { UserDetail } from './UserDetail'

interface Props {
  user: Account
}

export const UserDetails: FC<Props> = ({ user }) => {
  return (
    <div className="mt-10">
      <h1 className="text-white font-bold mb-6 text-2xl">Details</h1>
      <div className="border border-zinc-700 rounded-md text-white text-sm">
        <UserDetail title="Created">
          {user.created && formatDate(user.created)}
        </UserDetail>
        <UserDetail title="Updated">
          {user.updated && formatDate(user.updated)}
        </UserDetail>
        <UserDetail title="Username">{user.username}</UserDetail>
      </div>
    </div>
  )
}
