import type { FC } from 'react'
import { useGetDbTables } from '../../hooks/db/useGetDbTables'
import { Spinner } from '../../components/Spinner'
import { DatabaseTableItem } from '../../components/DatabaseTableItem'

export const DatabaseScreen: FC = () => {
  const { isLoading, data = [] } = useGetDbTables()

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div>
      {data.map((name) => (
        <DatabaseTableItem name={name} key={name} />
      ))}
    </div>
  )
}
