import type { FC } from 'react'
import type { Account } from 'm3o/user'
import { UserDetail } from './UserDetail'

interface Props {
  profile: Account['profile']
}

export const UserProfile: FC<Props> = ({ profile = {} }) => {
  return (
    <section className="mt-10">
      <h1 className="text-white font-bold mb-6 text-2xl">Profile</h1>
      <div className="border border-zinc-700 rounded-md text-white text-sm">
        {Object.keys(profile).map((key) => (
          <UserDetail title={key}>{profile[key]}</UserDetail>
        ))}
      </div>
    </section>
  )
}
