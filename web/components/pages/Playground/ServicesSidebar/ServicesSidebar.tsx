import classNames from 'classnames'

type Props = {
  data: ExploreAPI[]
  onSelectService: (apiName: string) => void
  selectedService: string
}

export function ServicesSidebar({
  data,
  onSelectService,
  selectedService,
}: Props) {
  return (
    <div className="overflow-y-scroll border-r border-zinc-800">
      {data.map(item => (
        <div key={item.name} className="px-2">
          <button
            className={classNames(
              'block p-4 px-8 text-sm w-full text-left rounded-md font-light',
              {
                'bg-zinc-600 text-white': item.name === selectedService,
                'text-zinc-600': item.name !== selectedService,
              },
            )}
            onClick={() => onSelectService(item.name)}>
            {item.display_name}
          </button>
        </div>
      ))}
    </div>
  )
}
