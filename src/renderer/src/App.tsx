import { createTheme, ThemeProvider } from '@mui/material'
import BrandTitle from './components/brand-title'
import UserSelectCard from './components/user-select-card'
import React, { useState } from 'react'
import CalendarCard from './components/calendar-card'
import AppContextProvider from './components/app-context-provider'
import Login from './components/login'

const theme = createTheme({
  colorSchemes: {
    dark: true
  }
})

export default function App(): React.JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLogin = (username: string, password: string): boolean => {
    if (username === 'admin' && password === 'railway') {
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={theme}>
        <div className="h-screen w-screen flex items-center justify-center">
          <Login onLogin={handleLogin} />
        </div>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <AppContextProvider>
        <div className="h-screen w-screen flex flex-col py-8">
          <BrandTitle />
          <div className="min-h-full overflow-y-auto px-10 pb-20">
            <UserSelectCard />
            <CalendarCard />
          </div>
        </div>
      </AppContextProvider>
    </ThemeProvider>
  )
}
