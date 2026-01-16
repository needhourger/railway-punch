import { Close } from '@mui/icons-material'
import { Button, IconButton } from '@mui/material'
import useAppContext from '@renderer/context/app-context'
import { getDateString } from '@renderer/libs'
import store from '@renderer/store'
import { AttendanceStatus } from '@renderer/types'
import React from 'react'

interface AttendanceStatusSelectorProps {
  date: Date
}

export default function AttendanceStatusSelector({
  date
}: AttendanceStatusSelectorProps): React.JSX.Element {
  const { currentUser } = useAppContext()
  const [status, setStatus] = React.useState<AttendanceStatus | null>(null)
  const [dateStr, setDateStr] = React.useState<string>(getDateString(date))

  React.useEffect(() => {
    setDateStr(getDateString(date))
  }, [date])

  React.useEffect(() => {
    const loadStatus = async (): Promise<void> => {
      setStatus(null)
      if (!currentUser) return
      const attendance = (await store.get(`attendance.${currentUser}`)) as
        | Record<string, AttendanceStatus>
        | undefined
      if (!attendance) return
      if (dateStr in attendance) {
        setStatus(attendance[dateStr])
      }
    }
    loadStatus()
  }, [currentUser, dateStr])

  React.useEffect(() => {
    if (status && currentUser) {
      store.set(`attendance.${currentUser}.${dateStr}`, status).then(() => {
        window.dispatchEvent(new Event('attendance-updated'))
      })
    } else if (!status && currentUser) {
      store.delete(`attendance.${currentUser}.${dateStr}`).then(() => {
        window.dispatchEvent(new Event('attendance-updated'))
      })
    }
  }, [status, currentUser, dateStr])

  const handleStatusChange = (newStatus: AttendanceStatus): void => {
    setStatus(newStatus)
  }

  const handleRemoveStatus = (): void => {
    setStatus(null)
  }

  const getStatusButtonClass = (btnStatus: AttendanceStatus): string => {
    const baseClass = 'w-full text-sm font-bold'
    if (status === btnStatus) {
      switch (btnStatus) {
        case 'day':
          return `${baseClass} bg-white text-gray-900 border-2 border-gray-300`
        case 'night':
          return `${baseClass} bg-orange-500 text-white border-2 border-orange-600`
        case 'rest':
          return `${baseClass} bg-green-500 text-white border-2 border-green-600`
        case 'annual':
          return `${baseClass} bg-red-500 text-white border-2 border-red-600`
      }
    }
    return `${baseClass} border border-gray-400`
  }

  return (
    <div className="w-full p-2 h-26 flex flex-col justify-end">
      {!status ? (
        <div className="flex flex-col gap-1">
          <Button
            onClick={() => handleStatusChange('day')}
            disabled={!currentUser}
            size="small"
            className="w-full bg-white text-gray-900 border border-gray-400"
            variant="outlined"
          >
            日
          </Button>
          <Button
            onClick={() => handleStatusChange('night')}
            disabled={!currentUser}
            size="small"
            className="w-full bg-orange-500 text-white border border-orange-600"
            variant="outlined"
          >
            夜
          </Button>
          <Button
            onClick={() => handleStatusChange('rest')}
            disabled={!currentUser}
            size="small"
            className="w-full bg-green-500 text-white border border-green-600"
            variant="outlined"
          >
            休
          </Button>
          <Button
            onClick={() => handleStatusChange('annual')}
            disabled={!currentUser}
            size="small"
            className="w-full bg-red-500 text-white border border-red-600"
            variant="outlined"
          >
            年
          </Button>
        </div>
      ) : (
        <div className="flex flex-col relative">
          <div className="absolute -right-1 -top-1 rounded-full z-10">
            <IconButton onClick={handleRemoveStatus} size="small" color="primary">
              <Close />
            </IconButton>
          </div>
          <div className="flex flex-col gap-1">
            <Button
              onClick={() => handleStatusChange('day')}
              disabled={!currentUser}
              size="small"
              className={getStatusButtonClass('day')}
              variant="outlined"
            >
              日
            </Button>
            <Button
              onClick={() => handleStatusChange('night')}
              disabled={!currentUser}
              size="small"
              className={getStatusButtonClass('night')}
              variant="outlined"
            >
              夜
            </Button>
            <Button
              onClick={() => handleStatusChange('rest')}
              disabled={!currentUser}
              size="small"
              className={getStatusButtonClass('rest')}
              variant="outlined"
            >
              休
            </Button>
            <Button
              onClick={() => handleStatusChange('annual')}
              disabled={!currentUser}
              size="small"
              className={getStatusButtonClass('annual')}
              variant="outlined"
            >
              年
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
