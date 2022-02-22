import type { ComponentPropsWithoutRef, FC } from 'react'
import classnames from 'classnames'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { FormField, FormFieldProps } from './FormField'

export interface SelectOption {
  name: string
  value: string
}

type Props = FormFieldProps &
  ComponentPropsWithoutRef<'select'> & {
    options: SelectOption[]
    showPleaseSelect?: boolean
  }

export const Select: FC<Props> = ({
  name,
  error,
  label,
  required,
  options,
  showPleaseSelect = true,
  ...props
}) => {
  const classes = classnames(
    'border block py-4 px-6 w-full rounded-lg text-sm focus:border-indigo-800 transition-colors appearance-none dark:border-zinc-600 dark:bg-transparent',
    {
      'border-zinc-300': !error,
      'border-red-700': error,
    },
  )
  return (
    <FormField name={name} label={label} error={error}>
      <div className="relative">
        <select {...props} className={classes}>
          {showPleaseSelect && <option value="">Please select</option>}
          {options.map(option => (
            <option value={option.value} key={option.value}>
              {option.name}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <ChevronDownIcon className="w-4" />
        </div>
      </div>
    </FormField>
  )
}
