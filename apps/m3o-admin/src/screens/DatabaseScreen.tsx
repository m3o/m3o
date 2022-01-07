import type { FC } from 'react'
import { DatabaseIcon } from '@heroicons/react/outline'
import { useGetDbTables } from '../hooks/db/useGetDbTables'
import { Spinner } from '../components/Spinner'
import { DatabaseTable } from '../components/DatabaseTable'
import { useDbDropTable } from '../hooks/db/useDbDropTable'

export const DatabaseScreen: FC = () => {
  const { isLoading, data = [] } = useGetDbTables()
  const { mutate } = useDbDropTable()

  const onDeleteClick = (name: string) => {
    if (
      window.confirm(
        `Are you sure you would like to drop the ${name} table? This cannot be undone.`
      )
    ) {
      mutate(name)
    }
  }

  return (
    <div className="p-6">
      <h1 className="font-bold text-5xl text-black mb-6 flex">
        <DatabaseIcon className="w-10 mr-4" />
        Db
      </h1>
      <p className="max-w-2xl">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ad, est. Et
        doloremque suscipit cum quia eius sed pariatur iste. Eveniet animi
        temporibus perferendis nam ex incidunt autem pariatur tempore provident.
      </p>
      <div className="mt-4">
        <h2 className="mb-4 font-bold text-lg">Tables</h2>
        {isLoading ? (
          <Spinner />
        ) : (
          data.map((name) => (
            <DatabaseTable
              name={name}
              key={name}
              onDeleteClick={() => onDeleteClick(name)}
            />
          ))
        )}
      </div>
    </div>
  )
}
