import { createTheme, ThemeProvider } from '@mui/material'
import BrandTitle from './components/brand-title'
import React, { useState } from 'react'
import AppContextProvider from './components/app-context-provider'
import Login from './components/login'
import HomePage from './components/home-page'
import FinancialPointsManagement from './components/financial-points-management'
import AttendanceAnalysis from './components/attendance-analysis'
import MaterialManagement from './components/material-management'
import AnnualReport from './components/annual-report'
import { Page } from './context/app-context'
import StationArchivePage from './components/station-archive-page'
import StationArchiveDetailPage from './components/station-archive-detail-page'

const theme = createTheme({
  colorSchemes: {
    dark: true
  }
})

export default function App(): React.JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentPage, setCurrentPage] = useState<Page>('home')

  const handleLogin = (username: string, password: string): boolean => {
    if (username === 'admin' && password === 'railway') {
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  const handleNavigate = (page: string): void => {
    setCurrentPage(page as Page)
  }

  const handleBack = (): void => {
    setCurrentPage('home')
  }

  const handleBackToStationArchive = (): void => {
    setCurrentPage('station-archive')
  }

  const handleNavigateStation = (stationName: string): void => {
    setCurrentPage(`station-archive-detail:${stationName}`)
  }

  const renderPage = (): React.JSX.Element => {
    if (currentPage.startsWith('station-archive-detail:')) {
      const stationName = currentPage.replace('station-archive-detail:', '')
      return <StationArchiveDetailPage stationName={stationName} onBack={handleBackToStationArchive} />
    }

    switch (currentPage) {
      case 'financial-points':
        return <FinancialPointsManagement onBack={handleBack} />
      case 'attendance-analysis':
        return <AttendanceAnalysis onBack={handleBack} />
      case 'annual-report':
        return <AnnualReport onBack={handleBack} />
      case 'material-management':
        return <MaterialManagement onBack={handleBack} />
      case 'station-archive':
        return <StationArchivePage onBack={handleBack} onNavigateStation={handleNavigateStation} />
      case 'home':
      default:
        return <HomePage onNavigate={handleNavigate} />
    }
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
      <AppContextProvider currentPage={currentPage} setCurrentPage={setCurrentPage}>
        <div className="h-screen w-screen flex flex-col py-8">
          <BrandTitle />
          <div className="flex-1 w-full overflow-hidden">
            {renderPage()}
          </div>
        </div>
      </AppContextProvider>
    </ThemeProvider>
  )
}
