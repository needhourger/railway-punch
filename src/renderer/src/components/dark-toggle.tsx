import React from 'react'
import { IconButton } from '@mui/material'
import { DarkMode, LightMode } from '@mui/icons-material'

export function DarkToggle(): React.JSX.Element {
  const [isDarkMode, setIsDarkMode] = React.useState<boolean>(false)
  const handleToggle = (): void => {
    setIsDarkMode(!isDarkMode)
    window.electron.ipcRenderer.send('dark-mode:toggle')
  }
  React.useEffect(() => {
    window.darkMode.toggle().then((isDarkMode) => {
      setIsDarkMode(isDarkMode)
    })
  }, [])
  return (
    <IconButton onClick={handleToggle} color="primary">
      {isDarkMode ? <DarkMode fontSize="large" /> : <LightMode fontSize="large" />}
    </IconButton>
  )
}
