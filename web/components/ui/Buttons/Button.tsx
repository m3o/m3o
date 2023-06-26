import { ComponentPropsWithoutRef, FC } from 'react'
import PulseLoader from 'react-spinners/PulseLoader'
import classnames from 'classnames'

interface Props extends ComponentPropsWithoutRef<'button'> {
  variant?: ButtonVariants
  loading?: boolean
  inverse?: boolean
}

export enum ButtonVariants {
  primary = 'primary',
  ghost = 'ghost',
}

export const Button: FC<Props> = ({
  children,
  className,
  loading = false,
  inverse = false,
  variant = ButtonVariants.primary,
  ...props
}) => {
  const classes = classnames('btn', className, {
    'text-white bg-indigo-600': variant === ButtonVariants.primary,
    'text-zinc-400 border-zinc-300': variant === ButtonVariants.ghost,
    'inverse-btn': inverse,
  })

  return (
    <button className={classes} {...props}>
      {loading ? <PulseLoader size={6} color="#fff" /> : children}
    </button>
  )
}
