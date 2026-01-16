import React from 'react'
import { AppContext, Page } from '@renderer/context/app-context'
import store from '@renderer/store'

interface AppContextProviderProps {
  children: React.ReactNode
  currentPage?: Page
  setCurrentPage?: (page: Page) => void
}

export default function AppContextProvider({
  children,
  currentPage: externalCurrentPage,
  setCurrentPage: externalSetCurrentPage
}: AppContextProviderProps): React.JSX.Element {
  const [users, setUsers] = React.useState<string[]>([])
  const [currentUser, setCurrentUser] = React.useState('')
  const [currentYear, setCurrentYear] = React.useState<number>(new Date().getFullYear())
  const [currentMonth, setCurrentMonth] = React.useState<number>(new Date().getMonth())
  const [internalCurrentPage, setInternalCurrentPage] = React.useState<Page>('home')

  const currentPage = externalCurrentPage ?? internalCurrentPage
  const setCurrentPage = externalSetCurrentPage ?? setInternalCurrentPage

  React.useEffect(() => {
    refreshUsers()
  }, [])

  const refreshUsers = async (): Promise<void> => {
    const tmp = await store.get('users')
    console.log('refresh users', tmp)
    if (tmp) {
      setUsers(tmp as string[])
    }
  }

  const setStoreUsers = async (users: string[]): Promise<void> => {
    setUsers(users)
    await store.set('users', users)
    console.log('New users', users)
  }

  const addStoreUser = async (username: string): Promise<void> => {
    const newUsers = [...users, username]
    await setStoreUsers(newUsers)
    await store.set(`records.${username}`, {})
    console.log('Add user', username)
  }

  const deleteStoreUser = async (username: string): Promise<void> => {
    const newUsers = users.filter((item) => item !== username)
    await store.delete(`records.${username}`)
    await setStoreUsers(newUsers)
    if (username === currentUser) setCurrentUser('')
    console.log('remove user', username)
  }

  return (
    <AppContext.Provider
      value={{
        users,
        setStoreUsers,
        addStoreUser,
        deleteStoreUser,
        currentUser,
        setCurrentUser,
        currentYear,
        setCurrentYear,
        currentMonth,
        setCurrentMonth,
        currentPage,
        setCurrentPage
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
