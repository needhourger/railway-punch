import React from 'react'
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import dayjs from 'dayjs'
import { getDateString } from '@renderer/libs'
import useAppContext from '@renderer/context/app-context'
import store from '@renderer/store'
import { PunchRecord } from '@renderer/types'

export default function ExportRecordButton(): React.JSX.Element {
  const { users, currentYear, currentMonth } = useAppContext()

  const [open, setOpen] = React.useState(false)
  const [startDate, setStartDate] = React.useState<Date | null>(null)
  const [endDate, setEndDate] = React.useState<Date | null>(null)

  React.useEffect(() => {
    const lastMonth = dayjs(`${currentYear}-${currentMonth + 1}`)
      .subtract(1, 'month')
      .date(25)
      .toDate()
    setStartDate(lastMonth)
    const thisMonth = dayjs(`${currentYear}-${currentMonth + 1}`)
      .date(25)
      .toDate()
    setEndDate(thisMonth)
  }, [currentYear, currentMonth])

  const handleExportBtnClick = (): void => {
    setOpen(true)
  }

  const getSingleUserOutput = async (
    username: string,
    startDate: Date,
    endDate: Date
  ): Promise<number[]> => {
    const data = (await store.get(`records.${username}`)) as Record<string, PunchRecord>
    const outputData: number[] = []
    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
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

  const handleOutput = async (startDate: Date | null, endDate: Date | null): Promise<void> => {
    if (!startDate || !endDate) return
    if (startDate > endDate) return

    const outputData: Record<string, number[]> = {}
    for (const username of users) {
      const singleUserData = await getSingleUserOutput(username, startDate, endDate)
      outputData[username] = singleUserData
    }
    const outputFileName = `${currentYear}-${currentMonth}.xlsx`
    window.api.exportFile(outputData, outputFileName)
  }

  const handleExport = (): void => {
    setOpen(false)
    handleOutput(startDate, endDate)
  }

  return (
    <React.Fragment>
      <Button onClick={handleExportBtnClick}>导出记录</Button>
      <Dialog open={open}>
        <DialogTitle>选择导出日期范围</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DateRangePicker']}>
              <DatePicker
                label="开始日期"
                value={startDate ? dayjs(startDate) : null}
                onChange={(value) => setStartDate(value ? value.toDate() : null)}
              />
              <DatePicker
                label="结束日期"
                value={endDate ? dayjs(endDate) : null}
                onChange={(value) => setEndDate(value ? value.toDate() : null)}
              />
            </DemoContainer>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>取消</Button>
          <Button onClick={() => handleExport()}>导出</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}
