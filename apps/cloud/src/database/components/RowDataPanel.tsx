import type { FC } from 'react'
import { Fragment } from 'react'
import { ExpectedRecord } from '../types'
import { DeleteButton } from '../../components/DeleteButton'

interface Props {
  data: ExpectedRecord
  onDeleteClick: VoidFunction
}

const keysWithoutIdKey = (data: ExpectedRecord) => {
  return Object.keys(data).filter((key) => key !== 'id')
}

export const RowDataPanel: FC<Props> = ({ data, onDeleteClick }) => {
  return (
    <div>
      <h1 className="font-bold mb-6">
        <span className="block text-gray-400">ID:</span>
        {data.id}
      </h1>
      {keysWithoutIdKey(data).map((key) => (
        <Fragment key={key}>
          <h2 className="mb-1 text-sm pb-1 font-medium">{key}</h2>
          <p className="mb-6 text-gray-500 text-sm">
            {typeof data[key] === 'object'
              ? JSON.stringify(data[key])
              : data[key]}
          </p>
        </Fragment>
      ))}
      <div className="border-t border-gray-700 mt-4 pt-4 grid">
        <DeleteButton onClick={onDeleteClick} />
      </div>
    </div>
  )
}
