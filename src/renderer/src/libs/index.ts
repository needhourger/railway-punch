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

function hashString(str: string): number {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i)
    hash = hash & hash
  }
  return Math.abs(hash)
}

export function getTagColor(tagName: string): string {
  const hash = hashString(tagName)
  const hue = hash % 360
  const saturation = 65
  const lightness = 50
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}
