import type { FC } from 'react'
import { useCookies } from 'react-cookie'
import { useListKeys } from '@/hooks'
import { Button } from '@/components/ui'
import { AuthCookieNames } from '@/lib/constants'
import { ApiKey } from './ApiKey'

interface Props {
  onDeleteClick: (keyId: string) => void
  onAddClick: VoidFunction
}

export const ApiKeys: FC<Props> = ({ onDeleteClick, onAddClick }) => {
  const [cookies] = useCookies()
  const listKeys = useListKeys()

  return (
    <div className="mt-8 tbgc p-6 md:p-10 rounded-lg">
      <h1 className="font-bold text-xl text-black md:text-2xl dark:text-white flex items-center justify-between">
        API Keys
        <Button className="text-sm" onClick={onAddClick}>
          Add
        </Button>
      </h1>
      {listKeys.isLoading ||
        (!listKeys.data ? (
          <p>Loading...</p>
        ) : (
          listKeys.data.map(item => (
            <ApiKey
              canDelete={cookies[AuthCookieNames.ApiTokenId] !== item.id}
              key={item.id}
              onDelete={() => onDeleteClick(item.id)}
              {...item}
            />
          ))
        ))}
    </div>
  )
}
