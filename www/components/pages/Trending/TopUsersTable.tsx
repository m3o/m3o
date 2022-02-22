import type { FC } from 'react'
import type { RankUser } from '@/types'
import FireIcon from '@heroicons/react/outline/FireIcon'

interface TopUsersTableProps {
  users: RankUser[]
}

export const TopUsersTable: FC<TopUsersTableProps> = ({ users }) => {
  return (
    <div>
      {users.map(user => (
        <div
          key={user.user_name}
          className="flex items-center bg-white p-6 rounded-md mb-4 shadow dark:bg-zinc-900 dark:border dark:border-zinc-700">
          <span className="bg-zinc-100 w-10 h-10 flex items-center justify-center rounded-md mr-4 dark:bg-zinc-800">
            {user.position === 1 ? <FireIcon className="w-6" /> : user.position}
          </span>
          {user.user_name}
        </div>
      ))}
    </div>
  )
}
