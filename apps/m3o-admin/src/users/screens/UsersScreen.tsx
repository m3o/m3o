import type { FC } from 'react'
import { useState } from 'react'
import { useListUsers } from '../hooks/useListUsers'
import { Table } from '../components/Table'
import { Panel } from '../../components/Panel'

export const UsersScreen: FC = () => {
  const [openUserId, setOpenUserId] = useState('')
  const { data = [] } = useListUsers()

  return (
    <div>
      <Table data={data} tableName="Users" onRowClick={setOpenUserId} />
      <Panel open={!!openUserId} onCloseClick={() => setOpenUserId('')}>
        Panel
      </Panel>
    </div>
  )
}
