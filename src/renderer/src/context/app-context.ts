import React, { createContext } from 'react'

interface AppContextType {
  users: string[]
  setUsers: (users: string[]) => void
  currentUser: string
  setCurrentUser: (username: string) => void
  currentYear: number
  setCurrentYear: (year: number) => void
  currentMonth: number
  setCurrentMonth: (month: number) => void
}
export const AppContext = createContext<AppContextType | undefined>(undefined)

export default function useAppContext(): AppContextType {
  const context = React.useContext(AppContext)
  if (!context) {
    throw new Error('Must use in AppContext')
  }
  return context
}
