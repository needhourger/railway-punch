export interface PunchRecord {
  isBusinessTrip: boolean
  isWorkOvertime: boolean
  isAnnualLeave: boolean
  extraPoints: number
}

export type AttendanceStatus = 'day' | 'night' | 'rest' | 'annual'
