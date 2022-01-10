import type { FC } from 'react'
import { useListUsers } from '../hooks/useListUsers'
import { Table } from '../components/Table'

export const UsersScreen: FC = () => {
  const { data = [] } = useListUsers()

  return (
    <div className="p-6">
      <h1 className="font-bold text-4xl text-black mb-6 flex">Users</h1>
      <p className="max-w-2xl">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ad, est. Et
        doloremque suscipit cum quia eius sed pariatur iste. Eveniet animi
        temporibus perferendis nam ex incidunt autem pariatur tempore provident.
      </p>
      <Table data={data} tableName="Users" onRowDelete={() => console.log(1)} />
    </div>
  )
}
