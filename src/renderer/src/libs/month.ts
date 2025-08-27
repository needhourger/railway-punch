export function getMonthDays(year: number, month: number): Date[] {
  const firstDayOfMonth = new Date(year, month, 1)
  const firstDayOfNextMonth = new Date(year, month + 1, 1)
  const lastDayOfMonth = new Date(firstDayOfNextMonth.getTime() - 1)

  const days: Date[] = []
  for (let day = firstDayOfMonth; day <= lastDayOfMonth; day.setDate(day.getDate() + 1)) {
    days.push(new Date(day))
  }
  return days
}

export function getCurrentMonthDays(): Date[] {
  const now = new Date()
  return getMonthDays(now.getFullYear(), now.getMonth())
}

export const MonthStrMap = [
  '一月',
  '二月',
  '三月',
  '四月',
  '五月',
  '六月',
  '七月',
  '八月',
  '九月',
  '十月',
  '十一月',
  '十二月'
]
