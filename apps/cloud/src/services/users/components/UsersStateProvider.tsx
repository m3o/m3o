import type { FC } from 'react'
import { createContext, useState, useContext } from 'react'
import { Outlet } from 'react-router-dom'

interface UsersStateContextValue {
  setPageSize: (pageSize: number) => void
  pageSize: number
}

type UsersState = Pick<UsersStateContextValue, 'pageSize'>

const UsersStateContext = createContext({} as UsersStateContextValue)

export const UsersStateProvider: FC = () => {
  const [state, setState] = useState<UsersState>({
    pageSize: 20
  })

  const setPageSize = (pageSize: number) => {
    setState((prevState) => ({ ...prevState, pageSize }))
  }

  return (
    <UsersStateContext.Provider value={{ setPageSize, ...state }}>
      <Outlet />
    </UsersStateContext.Provider>
  )
}

export function useUsersStateContext() {
  return useContext(UsersStateContext)
}
