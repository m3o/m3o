import { useQuery } from 'react-query'
import { useRouter } from 'next/router'
import format from 'date-fns/format'
import { QueryKeys } from '@/lib/constants'
import { FullSpinner, BackButtonLink } from '@/components/ui'
import { useM3OClient } from '@/hooks'
import { DashboardLayout } from '@/components/layouts'
import { UserDetailRow } from '@/components/pages/Cloud'

type UserAccount = {
  created: string
  email?: string
  username?: string
  id: string
  profile: Record<string, number | string>
  updated: string
  verificationDate: string
  verified: boolean
}

export default function UserPage() {
  const router = useRouter()
  const userId = router.query.id as string
  const m3o = useM3OClient()

  const { data } = useQuery([QueryKeys.CloudUsers, userId], async () => {
    const response = await m3o.user.read({ id: userId })
    return response.account as UserAccount
  })

  console.log(data)

  return (
    <DashboardLayout>
      {!data ? (
        <FullSpinner />
      ) : (
        <div className="p-6 md:p-10">
          <BackButtonLink href="/cloud/users">Back to users</BackButtonLink>
          <h1 className="text-3xl font-medium mb-6 gradient-text">
            {data.email || data.username}
          </h1>
          <div className="max-w-2xl mt-10">
            <UserDetailRow label="Created">
              {format(parseInt(data.created, 10) * 1000, 'PPpp')}
            </UserDetailRow>
            <UserDetailRow label="Updated">
              {format(parseInt(data.updated, 10) * 1000, 'PPpp')}
            </UserDetailRow>
            <UserDetailRow label="ID">{data.id}</UserDetailRow>
            <UserDetailRow label="Email">{data.email}</UserDetailRow>
            <UserDetailRow label="Username">{data.username}</UserDetailRow>
            <h3 className="font-medium my-10">Profile</h3>
            {Object.keys(data.profile).map(key => (
              <UserDetailRow label={key}>{data.profile[key]}</UserDetailRow>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
