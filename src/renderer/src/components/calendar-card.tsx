import { CalendarMonth } from '@mui/icons-material'
import { Card, CardActionArea, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import useIcsCalendar from '@renderer/hooks/ics-calendar'
import { getMonthDays } from '@renderer/libs/month'
import React from 'react'
import { IcsEvent } from 'ts-ics'

export default function CalendarCard(): React.JSX.Element {
  const [year, setYear] = React.useState<number>(new Date().getFullYear())
  const [month, setMonth] = React.useState<number>(new Date().getMonth())
  const [yearOptions, setYearOptions] = React.useState<number[]>([])
  const dayOfWeek = ['日', '一', '二', '三', '四', '五', '六']
  const [dayOfMonth, setDayOfMonth] = React.useState<Date[]>([])
  const [emptyDays, setEmptyDays] = React.useState<number>(0)
  const [getDateType] = useIcsCalendar()

  React.useEffect(() => {
    const currentYear = new Date().getFullYear()
    const years: number[] = []
    for (let y = currentYear - 50; y <= currentYear; y++) {
      years.push(y)
    }
    setYearOptions(years)
  }, [])

  React.useEffect(() => {
    const days = getMonthDays(year, month)
    const firstDay = days[0]
    setEmptyDays(firstDay.getDay())
    setDayOfMonth(days)
  }, [year, month])

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

  const DayEventLabel: React.FC<{ date: Date }> = ({ date }) => {
    const dayEvents = React.useRef<IcsEvent[] | null>(getDateType(date))
    const isRestDay =
      dayEvents.current?.some((v) => v.summary.includes('休')) ||
      date.getDay() === 0 ||
      date.getDay() === 6
    if (dayEvents.current === null)
      return (
        <div className="flex items-start justify-between px-2 py-4 h-32">
          <div className={`text-xl font-extrabold ${isRestDay ? 'text-red-400' : ''}`}>
            {date.getDate()}
          </div>
        </div>
      )

    const getEventClass = (summary: string): string => {
      if (summary.includes('休')) return 'text-red-400'
      if (summary.includes('班')) return 'text-yellow-300'
      return 'text-green-300'
    }
    return (
      <div className="flex items-start justify-between px-2 py-4 h-32">
        <div className={`text-xl font-extrabold ${isRestDay ? 'text-red-400' : ''}`}>
          {date.getDate()}
        </div>
        <div className="font-bold text-sm flex flex-col">
          {dayEvents.current.map((event, index) => (
            <span key={index} className={`${getEventClass(event.summary)}`}>
              {event.summary}
            </span>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Card className="p-8 mb-10">
      <div className="w-full flex justify-between mb-4">
        <div className="flex items-center mb-4">
          <CalendarMonth fontSize="large" />
          <span className="text-2xl font-bold ml-2">日历</span>
        </div>
        <div className="flex items-baseline">
          <FormControl>
            <InputLabel id="year-select-label">年份</InputLabel>
            <Select
              onChange={(e) => setYear(e.target.value as number)}
              value={year}
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
              onChange={(e) => setMonth(e.target.value as number)}
              value={month}
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
        {[...Array(emptyDays)].map((day, index) => (
          <div key={index}></div>
        ))}
        {dayOfMonth.map((day, index) => (
          <Card key={index} className="border flex flex-col items-center justify-center">
            <CardActionArea>
              <div className={`${isToday(day) ? 'bg-blue-400/50' : ''}`}>
                <DayEventLabel date={day} />
              </div>
            </CardActionArea>
          </Card>
        ))}
      </div>
    </Card>
  )
}
