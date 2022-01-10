import type { FC } from 'react'
import type { Account } from 'm3o/user'
import { Fragment } from 'react'
import { PanelRow } from '../../components/PanelRow'
import { DeleteButton } from '../../components/DeleteButton'

interface Props {
  data: Account
  onDeleteClick: VoidFunction
}

export const UserPanel: FC<Props> = ({ data, onDeleteClick }) => {
  return (
    <>
      <h1 className="mb-4">{data.username}</h1>
      <PanelRow title="ID" value={data.id} />
      <PanelRow title="Email" value={data.email} />
      <PanelRow title="Username" value={data.username} />
      <PanelRow title="Verified" value={data.verified ? 'Yes' : 'No'} />
      {data.profile && !!Object.keys(data.profile).length && (
        <>
          <h2 className="font-bold mb-4">Profile</h2>
          {Object.keys(data.profile).map((key) => (
            <PanelRow
              title={key}
              value={data.profile![key] as string}
              key={key}
            />
          ))}
        </>
      )}
      <div>
        <DeleteButton onClick={onDeleteClick} />
      </div>
    </>
  )
}
