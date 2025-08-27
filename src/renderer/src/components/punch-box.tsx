import { Button } from '@mui/material'
import React from 'react'

interface PunchBoxProps {
  date: Date
}
export default function PunchBox({ date }: PunchBoxProps): React.JSX.Element {
  console.log(date)
  return (
    <div className="w-full p-2">
      <Button size="large" className="w-full" variant="outlined">
        打卡
      </Button>
    </div>
  )
}
