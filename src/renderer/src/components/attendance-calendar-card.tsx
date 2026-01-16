import { CalendarMonth } from '@mui/icons-material'
import {
  Button,
  Card,
  CardActionArea,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from '@mui/material'
import { getMonthDays } from '@renderer/libs/month'
import React from 'react'
import AttendanceStatusSelector from './attendance-status-selector'
import useAppContext from '@renderer/context/app-context'
import { getDateString } from '@renderer/libs'
import store from '@renderer/store'
import { AttendanceStatus } from '@renderer/types'

export default function AttendanceCalendarCard(): React.JSX.Element {
  const { currentYear, setCurrentYear, currentMonth, setCurrentMonth, currentUser } =
    useAppContext()
  const [yearOptions, setYearOptions] = React.useState<number[]>([])
  const dayOfWeek = ['日', '一', '二', '三', '四', '五', '六']
  const [dayOfMonth, setDayOfMonth] = React.useState<Date[]>([])
  const [emptyDays, setEmptyDays] = React.useState<number>(0)
  const [attendanceData, setAttendanceData] = React.useState<
    Record<string, AttendanceStatus>
  >({})
  const [refreshKey, setRefreshKey] = React.useState(0)

  React.useEffect(() => {
    const currentYear = new Date().getFullYear()
    const years: number[] = []
    for (let y = currentYear - 50; y <= currentYear; y++) {
      years.push(y)
    }
    setYearOptions(years)
  }, [])

  React.useEffect(() => {
    const days = getMonthDays(currentYear, currentMonth)
    const firstDay = days[0]
    setEmptyDays(firstDay.getDay())
    setDayOfMonth(days)
  }, [currentYear, currentMonth])

  const loadAttendanceData = React.useCallback(async (): Promise<void> => {
    if (!currentUser) {
      setAttendanceData({})
      return
    }
    const data = (await store.get(`attendance.${currentUser}`)) as
      | Record<string, AttendanceStatus>
      | undefined
    setAttendanceData(data || {})
  }, [currentUser])

  React.useEffect(() => {
    loadAttendanceData()
  }, [currentUser, currentYear, currentMonth, refreshKey, loadAttendanceData])

  React.useEffect(() => {
    const handleAttendanceUpdate = (): void => {
      loadAttendanceData()
    }
    window.addEventListener('attendance-updated', handleAttendanceUpdate)
    return () => {
      window.removeEventListener('attendance-updated', handleAttendanceUpdate)
    }
  }, [loadAttendanceData])

  const locateCurrentMonth = (): void => {
    const today = new Date()
    setCurrentYear(today.getFullYear())
    setCurrentMonth(today.getMonth())
  }

  const getDayLabelClass = (day: string): string => {
    const isWeekEnd = day === '日' || day === '六'
    return (
      'font-bold text-xl flex items-center justify-center w-full' +
      ` ${isWeekEnd ? 'text-red-400' : ''}`
    )
  }

  const isToday = (date: Date): boolean => {
    const today = new Date()
    return (
      today.getFullYear() === date.getFullYear() &&
      today.getMonth() === date.getMonth() &&
      today.getDate() === date.getDate()
    )
  }

  const getStatusDisplay = (date: Date): { bgClass: string; text: string } | null => {
    const dateStr = getDateString(date)
    const status = attendanceData[dateStr]
    if (!status) return null

    switch (status) {
      case 'day':
        return { bgClass: 'bg-white text-gray-900', text: '日' }
      case 'night':
        return { bgClass: 'bg-orange-500 text-white', text: '夜' }
      case 'rest':
        return { bgClass: 'bg-green-500 text-white', text: '休' }
      case 'annual':
        return { bgClass: 'bg-red-500 text-white', text: '年' }
    }
  }

  const DayStatusLabel: React.FC<{ date: Date }> = ({ date }) => {
    const statusDisplay = getStatusDisplay(date)
    const dateStr = getDateString(date)
    const status = attendanceData[dateStr]

    return (
      <div className="flex items-start justify-between px-2 py-4 h-24">
        <div className={`text-xl font-extrabold ${isToday(date) ? 'text-blue-500' : ''}`}>
          {date.getDate()}
        </div>
        {statusDisplay && (
          <div
            className={`font-bold text-sm px-2 py-1 rounded ${statusDisplay.bgClass} mt-2`}
          >
            {statusDisplay.text}
          </div>
        )}
      </div>
    )
  }

  return (
    <Card className="p-8 mb-10">
      <div className="w-full flex justify-between mb-4">
        <div className="flex items-center mb-4">
          <CalendarMonth fontSize="large" />
          <span className="text-2xl font-bold ml-2">考勤日历</span>
        </div>
        <div className="flex items-baseline gap-2">
          <Button onClick={() => locateCurrentMonth()} size="large" variant="contained">
            跳转当月
          </Button>
          <FormControl>
            <InputLabel id="year-select-label">年份</InputLabel>
            <Select
              onChange={(e) => setCurrentYear(e.target.value as number)}
              value={currentYear}
              labelId="year-select-label"
              label="年份"
              className="w-36 mr-4"
            >
              {yearOptions.map((y) => (
                <MenuItem key={y} value={y}>
                  {y}年
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel id="month-select-label">月份</InputLabel>
            <Select
              onChange={(e) => setCurrentMonth(e.target.value as number)}
              value={currentMonth}
              labelId="month-select-label"
              label="月份"
              className="w-36"
            >
              {Array.from({ length: 12 }, (_, i) => i).map((m) => (
                <MenuItem key={m} value={m}>
                  {m + 1}月
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {dayOfWeek.map((day, index) => (
          <div key={index} className={getDayLabelClass(day)}>
            {day}
          </div>
        ))}
        {[...Array(emptyDays)].map((_, index) => (
          <div key={index}></div>
        ))}
        {dayOfMonth.map((day, index) => {
          const statusDisplay = getStatusDisplay(day)
          return (
            <Card
              key={index}
              className={`border flex flex-col items-center justify-center ${
                statusDisplay ? statusDisplay.bgClass : ''
              }`}
            >
              <CardActionArea className="w-full">
                <div className={`w-full ${isToday(day) ? 'bg-blue-400/50' : ''}`}>
                  <DayStatusLabel date={day} />
                  <AttendanceStatusSelector date={day} />
                </div>
              </CardActionArea>
            </Card>
          )
        })}
      </div>
    </Card>
  )
}
