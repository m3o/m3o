import type { FC } from 'react'
import { useGetDbTables } from '../hooks/useGetDbTables'
import { Spinner } from '../../../components/Spinner'
import { NoDbTables } from '../components/NoDbTables'
import { AddButton } from '../../../components/Buttons/AddButton'
import { TableItem } from '../components/TableItem'

export const DbScreen: FC = () => {
  const { isLoading, data = [] } = useGetDbTables()

  if (isLoading) {
    return (
      <div className="flex items-center w-full justify-center">
        <Spinner />
      </div>
    )
  }

  if (!data.length) {
    return <NoDbTables />
  }

  return (
    <section className="p-10">
      <header className="flex items-center justify-between mb-10">
        <h1 className="font-bold text-4xl">DB</h1>
        <AddButton name="DB" to="/database/add" />
      </header>
      <div className="grid grid-cols-4 gap-4">
        {data.map((item) => (
          <TableItem key={item} name={item} />
        ))}
      </div>
    </section>
  )
}
