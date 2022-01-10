import type { FC } from 'react'
import { DatabaseIcon } from '@heroicons/react/outline'
import { useGetDbTables } from '../../hooks/db/useGetDbTables'
import { Spinner } from '../../components/Spinner'
import { DatabaseTableItem } from '../../components/DatabaseTableItem'

export const DatabaseScreen: FC = () => {
  const { isLoading, data = [] } = useGetDbTables()

  return (
    <div className="p-6">
      <h1 className="font-bold text-4xl text-black mb-6 flex">
        <DatabaseIcon className="w-10 mr-4" />
        DB
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
          <div className="grid grid-cols-3 gap-4">
            {data.map((name) => (
              <DatabaseTableItem name={name} key={name} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
