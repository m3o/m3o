import classNames from 'classnames'
import { Spinner } from '@/components/ui'
import { returnFormattedEndpointName } from '@/utils/api'

type Props = {
  description?: string
  name: string
  isSelected: boolean
  onClick: VoidFunction
}

export function Endpoint({ description, name, isSelected, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={classNames(
        'block p-4 text-left text-sm font-light rounded-md flex-1 endpoint',
        {
          ' text-white bg-zinc-600': isSelected,
          'text-zinc-600': !isSelected,
        },
      )}>
      <span className="font-bold block mb-1 font-mono">
        {returnFormattedEndpointName(name)}
      </span>
      {!description ? (
        <Spinner />
      ) : (
        <span className="block text-xs leading-5 overflow-hidden text-ellipsis whitespace-nowrap">
          {description}
        </span>
      )}
    </button>
  )
}
