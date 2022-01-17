import type { FC, ChangeEventHandler } from 'react'

interface Props {
  checked: boolean
  id: string
  onChange: ChangeEventHandler
}

export const Checkbox: FC<Props> = ({ id, onChange, checked }) => {
  return (
    <div className="form-check">
      <input
        className="form-check-input h-4 w-4 border border-gray-300 rounded-sm bg-white focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
        type="checkbox"
        value=""
        id={id}
        onChange={onChange}
        checked={checked}
      />
      <label className="form-check-label inline-block " htmlFor={id} />
    </div>
  )
}
