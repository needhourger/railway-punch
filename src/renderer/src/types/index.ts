export interface PunchRecord {
  isBusinessTrip: boolean
  isWorkOvertime: boolean
  isAnnualLeave: boolean
  extraPoints: number
}

export type AttendanceStatus = 'day' | 'night' | 'rest' | 'annual'

export interface MaterialItem {
  id: string
  department: string
  workArea: string
  instrumentName: string
  specification: string
  custodian: string
  quantity: number
  remark: string
}
