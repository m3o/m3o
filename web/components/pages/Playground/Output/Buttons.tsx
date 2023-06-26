import classNames from 'classnames'
import { OutputTypes } from './Output.constants'

type Props = {
  currentTab: OutputTypes
  onButtonClick: (tab: OutputTypes) => void
}

export function Buttons({ currentTab, onButtonClick }: Props) {
  return (
    <>
      {Object.values(OutputTypes).map(item => (
        <button
          className={classNames(
            'bg-zinc-600 p-4 text-xs mr-2 border-b-2 border-transparent',
            {
              'border-indigo-600': currentTab === item,
            },
          )}
          onClick={() => onButtonClick(item)}
          key={item}>
          {item}
        </button>
      ))}
    </>
  )
}
