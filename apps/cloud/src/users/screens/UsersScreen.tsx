import type { FC } from 'react'
import type { Column, CellProps } from 'react-table'
import type { Account } from 'm3o/user'
import format from 'date-fns/format'
import { TrashIcon, PencilIcon } from '@heroicons/react/outline'
import { useState, useMemo, useCallback } from 'react'
import { useListUsers } from '../hooks/useListUsers'
import { Table } from '../../components/Table/Table'
import { Panel } from '../../components/Panel'
import { UserPanel } from '../components/UserPanel'
import { useDeleteUser } from '../hooks/useDeleteUser'
import { NoData } from '../../components/NoData'

type UserAccount = Required<Account>

export const UsersScreen: FC = () => {
  const [openUserId, setOpenUserId] = useState('')
  const { data = [] } = useListUsers()

  const { mutate } = useDeleteUser({
    onSuccess: () => {
      setOpenUserId('')
    }
  })

  const openPanelUserData = useMemo(() => {
    if (!openUserId) {
      return undefined
    }

    return data.find((item) => item.id === openUserId)
  }, [openUserId, data])

  const onDeleteClick = useCallback(
    (id: string) => {
      if (window.confirm('Are you sure you would like to delete this user?')) {
        mutate(id)
      }
    },
    [mutate]
  )

  const onDeleteMultiple = useCallback((items: UserAccount[]) => {
    const message =
      items.length === 1
        ? 'Are you sure you would like to delete this user?'
        : `Are you sure you would like to delete these ${items.length} users?`

    if (window.confirm(message)) {
      alert('DELETE THEM!')
    }
  }, [])

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
            <button onClick={() => alert(row.original.id!)} className="ml-2">
              <PencilIcon className="w-4" />
            </button>
          </div>
        )
      }
    ]
  }, [onDeleteClick])

  return (
    <div>
      {data.length ? (
        <Table<UserAccount>
          data={data as UserAccount[]}
          columns={columns}
          onDeleteMultiple={onDeleteMultiple}
        />
      ) : (
        <NoData />
      )}

      <Panel open={!!openUserId} onCloseClick={() => setOpenUserId('')}>
        {openPanelUserData && <UserPanel data={openPanelUserData} />}
      </Panel>
    </div>
  )
}
