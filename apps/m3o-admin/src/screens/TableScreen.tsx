/* eslint react/jsx-key: 0,react/display-name:0 */
import type { FC } from 'react'
import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/outline'
import { Link } from 'react-router-dom'
import { Table } from '../components/Table'
import { useFetchTableData } from '../hooks/db/useFetchTableData'
import { useDeleteTableRow } from '../hooks/db/useDeleteTableRow'

export const TableScreen: FC = () => {
  const { tableName } = useParams<{ tableName: string }>()
  const { data = [], isLoading } = useFetchTableData(tableName!)
  const { mutate } = useDeleteTableRow(tableName!)

  const onDeleteClick = useCallback(
    (id: string) => {
      if (window.confirm('Are you sure you would like to delete this item')) {
        mutate(id)
      }
    },
    [mutate]
  )

  return (
    <>
      <header className="p-6">
        <h1 className="font-bold text-black flex items-center">
          <Link to="/database" className="border-r mr-4">
            <ArrowLeftIcon className="w-4 mr-4" />
          </Link>
          {tableName}
        </h1>
      </header>
      {isLoading ? (
        <div className="flex items-center  h-full justify-center">
          <p>Loading...</p>
          {/* <Spinner /> */}
        </div>
      ) : (
        <Table tableName={tableName!} data={data} onRowDelete={onDeleteClick} />
      )}
    </>
  )
}
