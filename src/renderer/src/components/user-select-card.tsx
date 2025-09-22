import { Card, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material'
import { AccountBox } from '@mui/icons-material'
import React from 'react'
import store from '@renderer/store'
import AddUserButton from './add-user-button'
import { ManageUserButton } from './manage-user-button'
import useAppContext from '@renderer/context/app-context'
import { getMonthDays } from '@renderer/libs/month'
import { getDateString } from '@renderer/libs'
import { PunchRecord } from '@renderer/types'

export default function UserSelectCard(): React.JSX.Element {
  const { users, currentUser, setCurrentUser, currentYear, currentMonth } = useAppContext()

  const getSingleUserOutput = async (username: string): Promise<number[]> => {
    const data = (await store.get(`records.${username}`)) as Record<string, PunchRecord>
    const monthDays = getMonthDays(currentYear, currentMonth)
    const outputData: number[] = []
    for (const date of monthDays) {
      const dateStr = getDateString(date)
      const punchRecord = data[dateStr] as PunchRecord
      if (punchRecord) {
        const attendancePoints = punchRecord.isAnnualLeave ? 0 : 5
        const qualityPoints = punchRecord.isBusinessTrip ? 50 : 30
        outputData.push(attendancePoints, qualityPoints, punchRecord.extraPoints)
      } else {
        outputData.push(0, 0, 0)
      }
    }
    return outputData
  }

  const handleOutput = async (): Promise<void> => {
    const outputData: Record<string, number[]> = {}
    for (const username of users) {
      const singleUserData = await getSingleUserOutput(username)
      outputData[username] = singleUserData
    }
    const outputFileName = `${currentYear}-${currentMonth}.xlsx`
    window.api.exportFile(outputData, outputFileName)
  }

  return (
    <Card className="w-full p-8 mb-4">
      <div className="flex items-center mb-8">
        <AccountBox fontSize="large" className="" />
        <span className="text-2xl font-bold  ml-2">用户选择</span>
      </div>
      <div className="flex gap-4">
        <FormControl className="w-1/3">
          <InputLabel id="user-select-label">选择用户</InputLabel>
          <Select
            value={currentUser}
            onChange={(e) => setCurrentUser(e.target.value)}
            labelId="user-select-label"
            label="选择用户"
            defaultValue=""
          >
            {users &&
              users.map((username, index) => (
                <MenuItem key={index} value={username}>
                  {username}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <AddUserButton />
        <ManageUserButton />
        <div className="ms-auto">
          <Button onClick={() => handleOutput()} size="large">
            导出本月记录
          </Button>
        </div>
      </div>
    </Card>
  )
}
