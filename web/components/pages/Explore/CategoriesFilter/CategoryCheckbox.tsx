import type { FC, ChangeEvent } from 'react'
import CheckIcon from '@heroicons/react/outline/CheckIcon'
import styles from '../styles/CategoryCheckbox.module.css'

interface Props {
  checked: boolean
  label: string
  onChange: (category: string) => void
}

export const CategoryCheckbox: FC<Props> = ({ checked, label, onChange }) => {
  return (
    <div
      className={styles.root}
      data-test={`explore-filter-${label.toLowerCase()}`}>
      <input
        type="checkbox"
        name={label}
        value={label}
        checked={checked}
        id={label}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange(event.target.value)
        }
      />
      <label htmlFor={label}>
        <div className={styles.icon}>
          <CheckIcon className="w-4 text-white" />
        </div>
        <span>{label}</span>
      </label>
    </div>
  )
}
