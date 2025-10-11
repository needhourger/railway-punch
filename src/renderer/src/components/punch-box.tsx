import { Close } from '@mui/icons-material'
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
  const [dateStr, setDateStr] = React.useState<string>(getDateString(date))

  React.useEffect(() => {
    setDateStr(getDateString(date))
  }, [date])

  React.useEffect(() => {
    const loadRecord = async (): Promise<void> => {
      setRecord(null)
      if (!currentUser) return
      const records = (await store.get(`records.${currentUser}`)) as
        | Record<string, PunchRecord>
        | undefined
      if (!records) return
      if (dateStr in records) {
        setRecord(records[dateStr])
      }
    }
    loadRecord()
  }, [currentUser, dateStr])

  React.useEffect(() => {
    if (record) {
      store.set(`records.${currentUser}.${dateStr}`, record)
    } else {
      store.delete(`records.${currentUser}.${dateStr}`)
    }
  }, [record, currentUser, dateStr])

  const handlePunch = async (): Promise<void> => {
    if (!currentUser) return
    const events = getDateEvents(date)
    const isRestDay = checkRestDay(date, events)

    const record: PunchRecord = {
      isBusinessTrip: false,
      isWorkOvertime: isRestDay,
      isAnnualLeave: false,
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

  const onAnnualLeaveChange = (newVal: boolean): void => {
    setRecord((preVal) => {
      if (preVal) {
        const ret = {
          ...preVal,
          isAnnualLeave: newVal
        }
        if (newVal) {
          ret.isBusinessTrip = false
          ret.isWorkOvertime = false
        }
        return ret
      }
      return preVal
    })
  }
  const handleRemoveRecord = (): void => {
    setRecord(null)
  }

  return (
    <div className="w-full p-2 h-26 flex flex-col justify-end">
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
                  checked={record.isAnnualLeave}
                  onChange={(_, checked) => onAnnualLeaveChange(checked)}
                  name="isAnnualLeave"
                  color="primary"
                  size="small"
                />
              }
              label="年假"
              className="text-xs text-red-500"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={record.isBusinessTrip}
                  onChange={(_, checked) => onBusinessTripChange(checked)}
                  name="isBusinessTrip"
                  disabled={record.isAnnualLeave}
                  color="success"
                  size="small"
                />
              }
              label="出差"
              className="text-xs"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={record.isWorkOvertime}
                  onChange={(_, checked) => onWorkOvertimeChange(checked)}
                  name="isWorkOvertime"
                  color="warning"
                  disabled={record.isAnnualLeave}
                  size="small"
                />
              }
              label="加班"
              className="text-xs"
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
