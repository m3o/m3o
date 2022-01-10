/* eslint react/jsx-key: 0,react/display-name:0 */
import type { FC } from 'react'
import { useCallback, useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Table } from '../../components/Table'
import { Spinner } from '../../components/Spinner'
import { useFetchTableData } from '../../hooks/db/useFetchTableData'
import { useDeleteTableRow } from '../../hooks/db/useDeleteTableRow'
import { useDbDropTable } from '../../hooks/db/useDbDropTable'
import { Panel } from '../../components/Panel'
import { RowDataPanel } from '../../database/components/RowDataPanel'
import { DeleteButton } from '../../components/DeleteButton'

export const TableScreen: FC = () => {
  const [openRowDataId, setOpenRowDataId] = useState('')
  const { tableName } = useParams<{ tableName: string }>()
  const { data = [], isLoading } = useFetchTableData(tableName!)
  const { mutate } = useDeleteTableRow(tableName!, setOpenRowDataId)
  const { mutate: dropTableMutate } = useDbDropTable()

  const onDeleteClick = useCallback(() => {
    if (window.confirm('Are you sure you would like to delete this item')) {
      mutate(openRowDataId)
    }
  }, [mutate, openRowDataId])

  const onDropTableClick = useCallback(() => {
    if (window.confirm('Are you sure you would like to drop this table?')) {
      dropTableMutate(tableName as string)
    }
  }, [dropTableMutate, tableName])

  const openRowData = useMemo(() => {
    if (openRowDataId) {
      return data.find((item) => item.id === openRowDataId)
    }

    return undefined
  }, [openRowDataId, data])

  return (
    <>
      <header className="p-4 border-b border-gray-700 flex justify-between w-full items-center">
        <h1 className="font-bold text-white">{tableName}</h1>
        <div className="">
          <DeleteButton onClick={onDropTableClick}>Drop Table</DeleteButton>
        </div>
      </header>
      {isLoading ? (
        <div className="flex items-center  h-full justify-center">
          <Spinner />
        </div>
      ) : (
        <Table
          tableName={tableName!}
          data={data}
          onRowClick={(id: string) => setOpenRowDataId(id)}
        />
      )}
      <Panel open={!!openRowDataId} onCloseClick={() => setOpenRowDataId('')}>
        {openRowData && (
          <RowDataPanel data={openRowData} onDeleteClick={onDeleteClick} />
        )}
      </Panel>
    </>
  )
}
