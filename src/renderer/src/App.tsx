import { createTheme, ThemeProvider } from '@mui/material'
import BrandTitle from './components/brand-title'
import UserSelectCard from './components/user-select-card'
import React from 'react'

const theme = createTheme({
  colorSchemes: {
    dark: true
  }
})

export default function App(): React.JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <div className="h-screen w-screen flex flex-col px-10 py-8">
        <BrandTitle />
        <UserSelectCard />
      </div>
    </ThemeProvider>
  )
}
