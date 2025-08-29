import React from 'react'
import { AppContext } from '@renderer/context/app-context'

interface AppContextProviderProps {
  children: React.ReactNode
}

export default function AppContextProvider({
  children
}: AppContextProviderProps): React.JSX.Element {
  const [currentUser, setCurrentUser] = React.useState('')

  return (
    <AppContext.Provider value={{ currentUser, setCurrentUser }}>{children}</AppContext.Provider>
  )
}
