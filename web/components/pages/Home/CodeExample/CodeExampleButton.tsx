import type { FC, ComponentProps } from 'react'
import classnames from 'classnames'

interface Props extends ComponentProps<'button'> {
  isSelected: boolean
}

export const CodeExampleButton: FC<Props> = ({
  children,
  className,
  isSelected,
  ...props
}) => {
  return (
    <button
      className={classnames(
        'text-left p-4 bg-zinc-800 mb-2 rounded-lg text-sm w-full',
        className,
        { 'text-pink-500 font-bold': isSelected },
      )}
      {...props}>
      {children}
    </button>
  )
}
