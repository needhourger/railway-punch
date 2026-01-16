import { Card, Button, Typography } from '@mui/material'
import { ArrowBack, Construction } from '@mui/icons-material'
import React from 'react'

interface PlaceholderPageProps {
  title: string
  onBack: () => void
}

export default function PlaceholderPage({
  title,
  onBack
}: PlaceholderPageProps): React.JSX.Element {
  return (
    <div className="w-full max-w-4xl mx-auto px-10">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-3xl font-bold">{title}</h2>
        <Button startIcon={<ArrowBack />} onClick={onBack} variant="outlined" size="large">
          返回
        </Button>
      </div>
      <Card className="p-12">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Construction fontSize="large" style={{ fontSize: 80 }} className="mb-6" />
          <Typography variant="body1" color="text.secondary" className="text-center">
            功能开发中，敬请期待...
          </Typography>
        </div>
      </Card>
    </div>
  )
}
