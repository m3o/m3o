import React, {
  FC,
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react'
import classnames from 'classnames'
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/outline'

export interface ToastProperties {
  type: ToastTypes
  title: string
  message: string
}

interface ToastContextReturn {
  properties: ToastProperties
  show: boolean
  showToast: (properties: ToastProperties) => void
  hideToast: VoidFunction
}

type ToastState = Pick<ToastContextReturn, 'properties' | 'show'>

export enum ToastTypes {
  Error = 'error',
  Success = 'success',
}

const INITIAL_PROPERTIES: ToastProperties = {
  type: ToastTypes.Success,
  message: '',
  title: '',
}

const ToastContext = createContext({} as ToastContextReturn)

const ICONS = {
  [ToastTypes.Success]: CheckCircleIcon,
  [ToastTypes.Error]: ExclamationCircleIcon,
}

export const ToastProvider: FC = ({ children }) => {
  const [state, setState] = useState<ToastState>({
    properties: INITIAL_PROPERTIES,
    show: false,
  })

  const showToast = useCallback((properties: ToastProperties) => {
    setState(prevState => ({
      ...prevState,
      properties,
      show: true,
    }))
  }, [])

  const hideToast = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      properties: INITIAL_PROPERTIES,
      show: false,
    }))
  }, [])

  useEffect(() => {
    if (state.show) {
      setTimeout(() => {
        hideToast()
      }, 3000)
    }
  }, [state.show, hideToast])

  const Icon = ICONS[state.properties.type]

  return (
    <ToastContext.Provider
      value={{
        ...state,
        showToast,
        hideToast,
      }}>
      {children}
      <div
        className={classnames(
          'fixed z-30 left-0 bg-white dark:bg-zinc-800 py-4 px-6 flex items-start md:rounded-md shadow-sm transition-all md:left-auto border tbc',
          {
            '-top-full right-0 md:top-4 md:-right-full': !state.show,
            'bottom-0 right-0 md:bottom-4 md:right-4': state.show,
          },
        )}>
        <Icon
          className={classnames('w-6 mr-4', {
            'text-green-500': state.properties.type === ToastTypes.Success,
            'text-red-700': state.properties.type === ToastTypes.Error,
          })}
        />
        <div className="text-sm">
          <p className="font-bold">{state.properties.title}</p>
          <p className="text-zinc-500">{state.properties.message}</p>
        </div>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextReturn {
  return useContext(ToastContext)
}
