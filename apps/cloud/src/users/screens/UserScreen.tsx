import type { FC } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ChevronLeftIcon } from '@heroicons/react/outline'
import { useGetUserById } from '../hooks/useGetUserById'
import { Spinner } from '../../components/Spinner'
import { UserDetails } from '../components/UserDetails'
import { UserProfile } from '../components/UserProfile'
import { DeleteButton } from '../../components/DeleteButton'
import { useDeleteUser } from '../hooks/useDeleteUser'

export const UserScreen: FC = () => {
  const params = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data, isLoading } = useGetUserById(params.id!)
  const { mutate } = useDeleteUser({
    onSuccess: () => {
      navigate('/users')
    }
  })

  if (!data || isLoading) {
    return <Spinner />
  }

  const onDeleteClick = () => {
    if (window.confirm('Are you sure you would like to delete this user?')) {
      mutate(params.id!)
    }
  }

  return (
    <div className="p-6">
      <header className="flex justify-between items-center">
        <div>
          <Link to="/users" className="flex mb-6 text-sm text-white">
            <ChevronLeftIcon className="w-4" /> Back to users
          </Link>
          <p className="text-zinc-500 text-sm">ID: {data.id}</p>
          <h1 className="mt-3 text-white font-bold text-4xl">{data.email}</h1>
        </div>
        <DeleteButton onClick={onDeleteClick} />
      </header>
      <div className="max-w-4xl">
        <UserDetails user={data} />
        {!!Object.keys(data.profile).length && (
          <UserProfile profile={data.profile} />
        )}
      </div>
    </div>
  )
}
