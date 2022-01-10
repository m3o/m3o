import type { FC } from 'react'
import { useState, useMemo } from 'react'
import { useListUsers } from '../hooks/useListUsers'
import { Table } from '../components/Table'
import { Panel } from '../../components/Panel'
import { UserPanel } from '../components/UserPanel'
import { useDeleteUser } from '../hooks/useDeleteUser'

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

  const onDeleteClick = () => {
    if (window.confirm('Are you sure you would like to delete this user?')) {
      mutate(openUserId)
    }
  }

  return (
    <div>
      <Table data={data} tableName="Users" onRowClick={setOpenUserId} />
      <Panel open={!!openUserId} onCloseClick={() => setOpenUserId('')}>
        {openPanelUserData && (
          <UserPanel data={openPanelUserData} onDeleteClick={onDeleteClick} />
        )}
      </Panel>
    </div>
  )
}
