import type { SchemaObject } from 'openapi3-ts'
import type { FC } from 'react'

interface Props {
  description: SchemaObject['description']
  title: string
  type: SchemaObject['type']
}

export const Property: FC<Props> = ({ description = '', title, type }) => {
  return (
    <div className="my-6 last:mb-0">
      <p className="text-black font-medium mb-1 text-sm dark:text-white">
        {title}
        <span className="ml-1 inline-block text-zinc-500 font-light text-xs">
          {/* {type === 'array' ? item.value.items.type : '' }} */}
          {type}
        </span>
      </p>
      <p className="mb-4 font-light text-sm max-w-md text-zinc-500 dark:text-zinc-400">
        {description}
      </p>
    </div>
  )
}
