import { Button } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import React from 'react'
import UserSelectCard from './user-select-card'
import CalendarCard from './calendar-card'

interface FinancialPointsManagementProps {
  onBack: () => void
}

export default function FinancialPointsManagement({
  onBack
}: FinancialPointsManagementProps): React.JSX.Element {
  return (
    <div className="min-h-full overflow-y-auto px-10 pb-20">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-3xl font-bold">财务积分管理</h2>
        <Button startIcon={<ArrowBack />} onClick={onBack} variant="outlined" size="large">
          返回
        </Button>
      </div>
      <UserSelectCard />
      <CalendarCard />
    </div>
  )
}
