import type { FC, ComponentProps } from 'react'

interface Props extends ComponentProps<'button'> {
  isLoading?: boolean
}

export const SubmitButton: FC<Props> = ({
  isLoading = false,
  children,
  ...buttonProps
}) => {
  return (
    <button {...buttonProps} type="submit" className="btn">
      {children}
    </button>
  )
}
