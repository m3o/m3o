import type { FC } from 'react'
import React, { useContext, createContext } from 'react'

interface UserProviderProps {
  user: Account | null
}

export const UserContext = createContext<Account | null>(null)

export const UserProvider: FC<UserProviderProps> = ({ children, user }) => {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

export function useUser() {
  return useContext(UserContext)
}
