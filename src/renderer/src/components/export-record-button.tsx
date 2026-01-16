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
import { Page } from '@renderer/context/app-context'

interface ExportParams {
  startDate?: Date | null
  endDate?: Date | null
}

type ExportHandler = (params: ExportParams) => Promise<void>

interface ExportConfig {
  handler: ExportHandler
  requiresDateRange: boolean
  dialogTitle: string
}

export default function ExportRecordButton(): React.JSX.Element {
  const { users, currentYear, currentMonth, currentPage } = useAppContext()

  const [open, setOpen] = React.useState(false)
  const [startDate, setStartDate] = React.useState<Date | null>(null)
  const [endDate, setEndDate] = React.useState<Date | null>(null)

  const getSingleUserOutput = async (
    username: string,
    startDate: Date,
    endDate: Date
  ): Promise<number[]> => {
    const data = (await store.get(`records.${username}`)) as Record<string, PunchRecord>
    const outputData: number[] = []
    const currentDate = new Date(startDate)
    for (let date = currentDate; date <= endDate; date.setDate(date.getDate() + 1)) {
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

  const handleFinancialPointsExport = async (params: ExportParams): Promise<void> => {
    const { startDate: start, endDate: end } = params
    if (!start || !end) return
    if (start > end) return

    const outputData: Record<string, number[]> = {}
    for (const username of users) {
      const singleUserData = await getSingleUserOutput(username, start, end)
      outputData[username] = singleUserData
    }
    const outputFileName = `${currentYear}-${currentMonth + 1}.xlsx`
    console.log('start date', start)
    console.log('end date', end)
    window.api.exportFinancialPoints(start, end, outputData, outputFileName)
  }

  const handleAttendanceAnalysisExport = async (_params: ExportParams): Promise<void> => {
    // TODO: 实现考勤分析导出功能
  }

  const handleAnnualReportExport = async (_params: ExportParams): Promise<void> => {
    // TODO: 实现年度报表导出功能
  }

  const handleMaterialManagementExport = async (_params: ExportParams): Promise<void> => {
    // TODO: 实现物资管理导出功能
  }

  const exportConfigs: Record<Page, ExportConfig> = {
    'financial-points': {
      handler: handleFinancialPointsExport,
      requiresDateRange: true,
      dialogTitle: '选择导出日期范围'
    },
    'attendance-analysis': {
      handler: handleAttendanceAnalysisExport,
      requiresDateRange: false,
      dialogTitle: '导出考勤分析数据'
    },
    'annual-report': {
      handler: handleAnnualReportExport,
      requiresDateRange: false,
      dialogTitle: '导出年度报表'
    },
    'material-management': {
      handler: handleMaterialManagementExport,
      requiresDateRange: false,
      dialogTitle: '导出物资管理数据'
    },
    home: {
      handler: async () => {},
      requiresDateRange: false,
      dialogTitle: '导出'
    }
  }

  const currentConfig = exportConfigs[currentPage]

  React.useEffect(() => {
    if (currentConfig.requiresDateRange) {
      const lastMonth = dayjs(`${currentYear}-${currentMonth + 1}`)
        .subtract(1, 'month')
        .date(26)
        .toDate()
      setStartDate(lastMonth)
      const thisMonth = dayjs(`${currentYear}-${currentMonth + 1}`)
        .date(25)
        .toDate()
      setEndDate(thisMonth)
    } else {
      setStartDate(null)
      setEndDate(null)
    }
  }, [currentYear, currentMonth, currentConfig.requiresDateRange])

  const handleExportBtnClick = (): void => {
    setOpen(true)
  }

  const handleExport = async (): Promise<void> => {
    if (currentConfig.requiresDateRange) {
      if (!startDate || !endDate) return
    }
    await currentConfig.handler({ startDate, endDate })
    setOpen(false)
  }

  return (
    <React.Fragment>
      <Button onClick={handleExportBtnClick}>导出记录</Button>
      <Dialog open={open}>
        <DialogTitle>{currentConfig.dialogTitle}</DialogTitle>
        <DialogContent>
          {currentConfig.requiresDateRange ? (
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
          ) : (
            <div>导出功能开发中...</div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>取消</Button>
          <Button onClick={() => handleExport()}>导出</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}
