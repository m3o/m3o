import type { FC } from 'react'
import { useContext, createContext, useState, useEffect } from 'react'
import { Toast } from '../components/Toast'

interface ToastState {
  open: boolean
  type: 'Success' | 'Error'
  message: string
}

interface ToastContextValue {
  showToast: (props: Omit<ToastState, 'open'>) => void
}

const ToastContext = createContext({} as ToastContextValue)

export const ToastProvider: FC = ({ children }) => {
  const [state, setState] = useState<ToastState>({
    type: 'Success',
    message: '',
    open: false
  })

  const showToast = (props: Omit<ToastState, 'open'>) => {
    setState((prevState) => ({
      ...prevState,
      type: props.type,
      message: props.message,
      open: true
    }))
  }

  useEffect(() => {
    setTimeout(() => {
      setState((prevState) => ({ ...prevState, open: false }))
    }, 4000)
  }, [state.open])

  return (
    <ToastContext.Provider
      value={{
        showToast
      }}
    >
      {children}
      <Toast {...state} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
