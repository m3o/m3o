import type { FC } from 'react'
import '../styles/Spinner.css'

export const Spinner: FC = () => {
  return (
    <div className="loader-wrapper">
      <div className="loader">Loading...</div>
    </div>
  )
}
