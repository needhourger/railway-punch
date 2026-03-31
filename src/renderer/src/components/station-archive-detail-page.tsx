import { ArrowBack, Insights } from '@mui/icons-material'
import { Button, Card, Typography } from '@mui/material'
import React from 'react'

interface StationArchiveDetailPageProps {
  stationName: string
  onBack: () => void
}

export default function StationArchiveDetailPage({
  stationName,
  onBack
}: StationArchiveDetailPageProps): React.JSX.Element {
  return (
    <div className="w-full max-w-4xl mx-auto px-10">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-3xl font-bold">{stationName}</h2>
        <Button startIcon={<ArrowBack />} onClick={onBack} variant="outlined" size="large">
          返回站点列表
        </Button>
      </div>
      <Card className="p-12">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Insights fontSize="large" style={{ fontSize: 80 }} className="mb-6" />
          <Typography variant="h6" className="mb-2">
            {stationName} 详细数据
          </Typography>
          <Typography variant="body1" color="text.secondary" className="text-center">
            该页面用于展示站点详细数据，后续可接入指标、图表与台账信息。
          </Typography>
        </div>
      </Card>
    </div>
  )
}
