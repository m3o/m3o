import type { FC } from 'react'
import type { Column } from 'react-table'
import type { Account } from 'm3o/user'
import { useNavigate, Link } from 'react-router-dom'
import format from 'date-fns/format'
import { UserAddIcon } from '@heroicons/react/outline'
import { useMemo, useCallback } from 'react'
import { Spinner } from '../../../components/Spinner'
import { useListUsers } from '../hooks/useListUsers'
import { Table } from '../../../components/Table/Table'
import { NoData } from '../../../components/NoData'
import { useDeleteUsers } from '../hooks/useDeleteUsers'
import { useUsersStateContext } from '../components/UsersStateProvider'

type UserAccount = Required<Account>

export const UsersScreen: FC = () => {
  const navigate = useNavigate()
  const { data, isFetching } = useListUsers()
  const { setPageSize, pageSize } = useUsersStateContext()
  const deleteUsersMutation = useDeleteUsers()

  const handleDeleteClick = useCallback(
    (items: string[]) => {
      const message =
        items.length === 1
          ? 'Are you sure you would like to delete this user?'
          : `Are you sure you would like to delete these ${items.length} users?`

      if (window.confirm(message)) {
        deleteUsersMutation.mutate(items)
      }
    },
    [deleteUsersMutation]
  )

  const columns = useMemo<Column<UserAccount>[]>(() => {
    return [
      {
        Header: 'Email',
        accessor: 'email'
      },
      {
        Header: 'Username',
        accessor: 'username'
      },
      {
        Header: 'ID',
        accessor: 'id'
      },
      {
        Header: 'Created',
        accessor: 'created',
        Cell: ({ value }) => {
          return format(new Date(Number(value) * 1000), 'PPpp')
        }
      },
      {
        Header: 'Verified',
        accessor: 'verified',
        Cell: ({ value }) => {
          return value ? 'true' : 'false'
        }
      }
    ]
  }, [navigate])

  if (isFetching) {
    return <Spinner />
  }

  return (
    <>
      <div className="p-4 border-b border-zinc-600 flex items-center justify-between">
        <h1 className="font-bold text-white">Users</h1>
        <Link className="btn flex items-center" to="/users/add">
          <UserAddIcon className="w-4 mr-2" /> Add
        </Link>
      </div>
      {data!.length ? (
        <Table<UserAccount>
          data={data as UserAccount[]}
          columns={columns}
          onTrashClick={handleDeleteClick}
          onSetPageSize={setPageSize}
          statePageSize={pageSize}
          rowClickPath="/users"
        />
      ) : (
        <NoData />
      )}
    </>
  )
}
