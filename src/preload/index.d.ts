import { ElectronAPI } from '@electron-toolkit/preload'
import { IcsCalendar } from 'ts-ics'
import { AttendanceStatus } from '@renderer/types'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      exportFinancialPoints: (startDate: Date, endDate: Date, data: Record<string, number[]>, filename: string) => Promise<any>
      exportAttendanceData: (startDate: Date, endDate: Date, data: Record<string, Record<string, AttendanceStatus>>, filename: string) => Promise<any>
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
