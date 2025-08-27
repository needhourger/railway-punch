import React from 'react'
import { IcsEvent } from 'ts-ics'

export default function useIcsCalendar(): [(Date) => IcsEvent | null] {
  const dateMapRef = React.useRef<Map<string, IcsEvent> | null>(null)

  const getDateString = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  React.useEffect(() => {
    window.loadIcs
      .read()
      .then((data) => {
        const dateMap = new Map<string, IcsEvent>()
        data?.events.forEach((event: IcsEvent) => {
          const dateStr = getDateString(event.start.date)
          dateMap.set(dateStr, event)
        })
        dateMapRef.current = dateMap
      })
      .catch((err) => {
        console.error('Failed to load ICS file:', err)
      })
  })

  const getDateType = (date: Date): IcsEvent | null => {
    if (!dateMapRef.current) return null
    const dateStr = getDateString(date)
    return dateMapRef.current.get(dateStr) || null
  }

  return [getDateType]
}
