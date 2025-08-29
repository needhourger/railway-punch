import { Close, ReportOutlined } from '@mui/icons-material'
import { Button, IconButton, Checkbox, FormControlLabel } from '@mui/material'
import useAppContext from '@renderer/context/app-context'
import useIcsCalendar from '@renderer/hooks/ics-calendar'
import { checkRestDay, getDateString } from '@renderer/libs'
import store from '@renderer/store'
import { PunchRecord } from '@renderer/types'
import React from 'react'
import { NumberInput } from './number-input'

interface PunchBoxProps {
  date: Date
}
export default function PunchBox({ date }: PunchBoxProps): React.JSX.Element {
  const { currentUser } = useAppContext()
  const [record, setRecord] = React.useState<PunchRecord | null>(null)
  const { getDateEvents } = useIcsCalendar()
  const dateStr = getDateString(date)

  React.useEffect(() => {
    refreshPunchRecord()
  }, [currentUser])

  React.useEffect(() => {
    if (record) {
      store.set(`records.${currentUser}.${dateStr}`, record)
    } else {
      store.delete(`record.${currentUser}.${dateStr}`)
    }
  }, [record, currentUser, dateStr])

  const refreshPunchRecord = async (): Promise<void> => {
    setRecord(null)
    if (!currentUser) return
    const records = (await store.get(`records.${currentUser}`)) as Record<string, PunchRecord>
    if (!records) return
    if (dateStr in records) {
      setRecord(records[dateStr])
    }
  }

  const handlePunch = async (): Promise<void> => {
    if (!currentUser) return
    const events = getDateEvents(date)
    const isRestDay = checkRestDay(date, events)

    const record: PunchRecord = {
      isBusinessTrip: false,
      isWorkOvertime: isRestDay,
      extraPoints: 0
    }
    setRecord(record)
  }

  const onBusinessTripChange = (newVal: boolean): void => {
    setRecord((preVal) => {
      if (preVal) {
        return { ...preVal, isBusinessTrip: newVal }
      }
      return preVal
    })
  }

  const onWorkOvertimeChange = (newVal: boolean): void => {
    setRecord((preVal) => {
      if (preVal) {
        return { ...preVal, isWorkOvertime: newVal }
      }
      return preVal
    })
  }

  const onExtraPointChange = (value: number | null): void => {
    setRecord((preVal) => {
      if (preVal) {
        return { ...preVal, extraPoints: value || 0 }
      }
      return preVal
    })
  }

  const handleRemoveRecord = (): void => {
    setRecord(null)
  }

  return (
    <div className="w-full p-2 h-24 flex flex-col justify-end">
      {!record ? (
        <Button
          onClick={() => handlePunch()}
          disabled={!currentUser}
          size="large"
          className="w-full"
          variant="outlined"
        >
          打卡
        </Button>
      ) : (
        <div className="flex flex-col">
          <div className="flex flex-wrap gap-0">
            <div className="absolute -right-1 -top-1 rounded-full">
              <IconButton onClick={handleRemoveRecord} size="small" color="primary">
                <Close />
              </IconButton>
            </div>
            <FormControlLabel
              control={
                <Checkbox
                  checked={record.isBusinessTrip}
                  onChange={(_, checked) => onBusinessTripChange(checked)}
                  name="isBusinessTrip"
                  color="success"
                />
              }
              label="出差"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={record.isWorkOvertime}
                  onChange={(_, checked) => onWorkOvertimeChange(checked)}
                  name="isWorkOvertime"
                  color="warning"
                />
              }
              label="加班"
            />
          </div>
          <div>
            <NumberInput
              className="w-full"
              value={record.extraPoints}
              onChange={(_, value) => onExtraPointChange(value)}
              min={-100}
              max={100}
            />
          </div>
        </div>
      )}
    </div>
  )
}
