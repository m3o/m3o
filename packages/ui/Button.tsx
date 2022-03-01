import type { ComponentProps, ReactElement, PropsWithChildren } from 'react'
import PulseLoader from 'react-spinners/PulseLoader'
import classnames from 'classnames'

interface Props extends ComponentProps<'button'> {
  variant?: ButtonVariants
  loading?: boolean
  inverse?: boolean
}

export enum ButtonVariants {
  primary = 'primary',
  ghost = 'ghost'
}

export function Button({
  children,
  className,
  loading = false,
  inverse = false,
  variant = ButtonVariants.primary,
  ...props
}: PropsWithChildren<Props>): ReactElement {
  const classes = classnames('bg-red-50 px-6 py-4', className)

  return (
    <button className={classes} {...props}>
      {loading ? <PulseLoader size={6} color="#fff" /> : children}
    </button>
  )
}
