import React, { createContext } from 'react'

export type Page = 'home' | 'financial-points' | 'attendance-analysis' | 'annual-report' | 'material-management'

interface AppContextType {
  users: string[]
  setStoreUsers: (users: string[]) => void
  addStoreUser: (username: string) => void
  deleteStoreUser: (username: string) => void
  currentUser: string
  setCurrentUser: (username: string) => void
  currentYear: number
  setCurrentYear: (year: number) => void
  currentMonth: number
  setCurrentMonth: (month: number) => void
  currentPage: Page
  setCurrentPage: (page: Page) => void
}
export const AppContext = createContext<AppContextType | undefined>(undefined)

export default function useAppContext(): AppContextType {
  const context = React.useContext(AppContext)
  if (!context) {
    throw new Error('Must use in AppContext')
  }
  return context
}
