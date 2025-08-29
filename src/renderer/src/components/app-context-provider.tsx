import React from 'react'
import { AppContext } from '@renderer/context/app-context'
import store from '@renderer/store'

interface AppContextProviderProps {
  children: React.ReactNode
}

export default function AppContextProvider({
  children
}: AppContextProviderProps): React.JSX.Element {
  const [users, setUsers] = React.useState<string[]>([])
  const [currentUser, setCurrentUser] = React.useState('')
  const [currentYear, setCurrentYear] = React.useState<number>(new Date().getFullYear())
  const [currentMonth, setCurrentMonth] = React.useState<number>(new Date().getMonth())

  React.useEffect(() => {
    refreshUsers()
  }, [])

  React.useEffect(() => {
    updateUsersInStore(users)
  }, [users])

  const updateUsersInStore = async (users): Promise<void> => {
    await store.set('users', users)
  }

  const refreshUsers = async (): Promise<void> => {
    const tmp = await store.get('users')
    if (tmp) {
      setUsers(tmp as string[])
    } else {
      setUsers([])
    }
  }

  return (
    <AppContext.Provider
      value={{
        users,
        setUsers,
        currentUser,
        setCurrentUser,
        currentYear,
        setCurrentYear,
        currentMonth,
        setCurrentMonth
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
