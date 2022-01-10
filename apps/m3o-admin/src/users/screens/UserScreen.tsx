import type { FC } from 'react'
import { useParams } from 'react-router-dom'
import { useGetUserById } from '../hooks/useGetUserById'

export const UserScreen: FC = () => {
  const params = useParams<{ id: string }>()
  const { data } = useGetUserById(params.id!)

  console.log(data)

  return (
    <div className="p-6">
      <h1 className="font-bold text-4xl text-black mb-6 flex">User</h1>
    </div>
  )
}
