import type { FC } from 'react'
import type { Column, CellProps } from 'react-table'
import type { Account } from 'm3o/user'
import { useNavigate } from 'react-router-dom'
import format from 'date-fns/format'
import { TrashIcon, PencilIcon } from '@heroicons/react/outline'
import { useMemo, useCallback } from 'react'
import { useListUsers } from '../hooks/useListUsers'
import { Table } from '../../components/Table/Table'
import { useDeleteUser } from '../hooks/useDeleteUser'
import { NoData } from '../../components/NoData'
import { useDeleteMultipleUsers } from '../hooks/useDeleteMultipleUsers'
import { useSelectItems } from '../../hooks/useSelectItems'
import { useUsersStateContext } from '../components/UsersStateProvider'

type UserAccount = Required<Account>

export const UsersScreen: FC = () => {
  const navigate = useNavigate()
  const { selectedItems, onSelectItem, resetSelectedItems } =
    useSelectItems<UserAccount>()
  const { data = [] } = useListUsers()
  const { setPageSize, pageSize } = useUsersStateContext()

  const { mutate: deleteMultipleUsers } = useDeleteMultipleUsers({
    onSuccess: () => {
      resetSelectedItems()
    }
  })

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

  const onDeleteMultiple = useCallback(() => {
    const message =
      selectedItems.length === 1
        ? 'Are you sure you would like to delete this user?'
        : `Are you sure you would like to delete these ${selectedItems.length} users?`

    if (window.confirm(message)) {
      deleteMultipleUsers(selectedItems)
    }
  }, [selectedItems, deleteMultipleUsers])

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
      },
      {
        id: 'actions',
        width: 100,
        Cell: ({ row }: CellProps<UserAccount>) => (
          <div className="hidden group-hover:block text-white text-right pr-4">
            <button onClick={() => onDeleteClick(row.original.id!)}>
              <TrashIcon className="w-4" />
            </button>
            <button
              onClick={() => navigate(`/users/${row.original.id!}`)}
              className="ml-3"
            >
              <PencilIcon className="w-4" />
            </button>
          </div>
        )
      }
    ]
  }, [onDeleteClick, navigate])

  return (
    <div>
      {data.length ? (
        <Table<UserAccount>
          data={data as UserAccount[]}
          columns={columns}
          onDeleteMultiple={onDeleteMultiple}
          selectedItems={selectedItems}
          setSelectedItems={onSelectItem}
          onSetPageSize={setPageSize}
          statePageSize={pageSize}
        />
      ) : (
        <NoData />
      )}
    </div>
  )
}
