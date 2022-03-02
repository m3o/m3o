import type { FC } from 'react'
import type { Column, CellProps } from 'react-table'
import type { Account } from 'm3o/user'
import { useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import format from 'date-fns/format'
import { UserAddIcon } from '@heroicons/react/outline'
import { useMemo, useCallback } from 'react'
import { Spinner } from '../../../components/Spinner'
import { useListUsers } from '../hooks/useListUsers'
import { Table } from '../../../components/Table/Table'
import { useDeleteUser } from '../hooks/useDeleteUser'
import { NoData } from '../../../components/NoData'
import { useDeleteMultipleUsers } from '../hooks/useDeleteMultipleUsers'
import { useSelectItems } from '../../../hooks/useSelectItems'
import { useUsersStateContext } from '../components/UsersStateProvider'

type UserAccount = Required<Account>

export const UsersScreen: FC = () => {
  const currentPageRef = useRef<UserAccount[]>([])
  const navigate = useNavigate()
  const { data = [], isFetching } = useListUsers()
  const { setPageSize, pageSize } = useUsersStateContext()

  const { mutate: deleteMultipleUsers } = useDeleteMultipleUsers()

  const { mutate } = useDeleteUser({
    onSuccess: () => {}
  })

  const onDeleteClick = useCallback(
    (id: string) => {
      if (window.confirm('Are you sure you would like to delete this user?')) {
        mutate(id)
      }
    },
    [mutate]
  )

  const handleDeleteClick = useCallback(
    (items: string[]) => {
      const message =
        items.length === 1
          ? 'Are you sure you would like to delete this user?'
          : `Are you sure you would like to delete these ${items.length} users?`

      if (window.confirm(message)) {
        deleteMultipleUsers(items)
      }
    },
    [deleteMultipleUsers]
  )

  let onPageChange = (items: UserAccount[]) => {
    currentPageRef.current = items
  }

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
          return format(new Date(Number(value) * 1000), 'hh:mm do LLL yy')
        }
      },
      {
        Header: 'Verified',
        accessor: 'verified',
        Cell: ({ value }) => {
          return value ? '✅' : '❌'
        }
      }
    ]
  }, [onDeleteClick, navigate])

  if (isFetching) {
    return <Spinner />
  }

  return (
    <div>
      <div className="p-4 border-b border-zinc-600 flex items-center justify-between">
        <h1 className="font-bold text-white">Users</h1>
        <Link className="btn flex items-center" to="/users/add">
          <UserAddIcon className="w-4 mr-2" /> Add
        </Link>
      </div>
      {data.length ? (
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
    </div>
  )
}
