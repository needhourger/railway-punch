import { getDateString } from '@renderer/libs'
import React from 'react'
import { IcsEvent } from 'ts-ics'

export default function useIcsCalendar(): {
  getDateEvents: (date: Date) => IcsEvent[] | null
} {
  const dateMapRef = React.useRef<Map<string, IcsEvent[]> | null>(null)

  React.useEffect(() => {
    window.loadIcs
      .read()
      .then((data) => {
        const dateMap = new Map<string, IcsEvent[]>()
        data?.events.forEach((event: IcsEvent) => {
          if (event.end?.date) {
            const currentDate = new Date(event.start.date)
            while (currentDate <= event.end.date) {
              const key = getDateString(currentDate)
              if (dateMap.has(key)) {
                const events = dateMap.get(key)
                if (events) {
                  events?.push(event)
                  dateMap.set(key, events)
                }
              } else {
                dateMap.set(key, [event])
              }
              currentDate.setDate(currentDate.getDate() + 1)
            }
          } else {
            const key = getDateString(event.start.date)
            if (dateMap.has(key)) {
              const events = dateMap.get(key)
              if (events) {
                events?.push(event)
                dateMap.set(key, events)
              }
            } else {
              dateMap.set(key, [event])
            }
          }
        })
        dateMapRef.current = dateMap
      })
      .catch((err) => {
        console.error('Failed to load ICS file:', err)
      })
  })

  const getDateEvents = (date: Date): IcsEvent[] | null => {
    if (!dateMapRef.current) return null
    const dateStr = getDateString(date)
    return dateMapRef.current.get(dateStr) || null
  }

  return { getDateEvents }
}
