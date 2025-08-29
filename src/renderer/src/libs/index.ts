import { IcsEvent } from 'ts-ics'

export function getDateString(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function checkRestDay(date: Date, events: IcsEvent[] | null): boolean {
  console.log(date, events)
  if (events) {
    if (events.some((item) => item.summary.includes('班'))) {
      return false
    } else if (events.some((item) => item.summary.includes('休'))) {
      return true
    }
  }
  return date.getDay() === 6 || date.getDay() === 7
}
