import { ElectronAPI } from '@electron-toolkit/preload'
import { IcsCalendar } from 'ts-ics'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      exportFile: (startDate, endDate, data, filename) => void
    }
    darkMode: {
      toggle: () => Promise<boolean>
      system: () => Promise<void>
    }
    loadIcs: {
      read: () => Promise<IcsCalendar>
    }
  }
}
