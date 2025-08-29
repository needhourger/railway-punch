import { createTheme, ThemeProvider } from '@mui/material'
import BrandTitle from './components/brand-title'
import UserSelectCard from './components/user-select-card'
import React from 'react'
import CalendarCard from './components/calendar-card'
import AppContextProvider from './components/app-context-provider'

const theme = createTheme({
  colorSchemes: {
    dark: true
  }
})

export default function App(): React.JSX.Element {
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
