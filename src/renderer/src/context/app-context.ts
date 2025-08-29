import React, { createContext } from 'react'

interface AppContextType {
  currentUser: string
  setCurrentUser: (username: string) => void
}
export const AppContext = createContext<AppContextType | undefined>(undefined)

export default function useAppContext(): AppContextType {
  const context = React.useContext(AppContext)
  if (!context) {
    throw new Error('Must use in AppContext')
  }
  return context
}
