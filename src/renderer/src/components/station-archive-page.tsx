import { ArrowBack } from '@mui/icons-material'
import { Button, Card, CardActionArea, CardContent, TextField, Typography } from '@mui/material'
import React from 'react'

interface StationArchivePageProps {
  onBack: () => void
  onNavigateStation: (stationName: string) => void
}

const stationNames = [
  '芜湖宁安场（临时限速）',
  '马鞍山东',
  '新河镇',
  '当涂东',
  '池州宁安场',
  '宁安中继5',
  '宁安中继6',
  '芜湖合杭场',
  '湾址南',
  '宣城高速场',
  '郎溪南',
  '广德南',
  '安吉',
  '商合杭中继5',
  '商合杭中继6',
  '商合杭中继7',
  '商合杭中继8',
  '商合杭中继9',
  '商合杭中继10',
  '商合杭中继11',
  '商合杭中继12',
  '合福中继8',
  '合福中继10',
  '合福中继9',
  '合福南陵',
  '合福铜陵北'
]

export default function StationArchivePage({
  onBack,
  onNavigateStation
}: StationArchivePageProps): React.JSX.Element {
  const [keyword, setKeyword] = React.useState('')

  const filteredStations = stationNames.filter((stationName) => stationName.includes(keyword.trim()))

  return (
    <div className="w-full h-full max-w-6xl mx-auto px-10 flex flex-col">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-3xl font-bold">一站一档</h2>
        <Button startIcon={<ArrowBack />} onClick={onBack} variant="outlined" size="large">
          返回
        </Button>
      </div>
      <div className="mb-4">
        <TextField
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          label="筛选站点"
          placeholder="输入站点名称关键字"
          fullWidth
        />
      </div>
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredStations.map((stationName) => (
            <Card key={stationName} className="hover:shadow-lg transition-shadow">
              <CardActionArea onClick={() => onNavigateStation(stationName)} className="h-full p-2">
                <CardContent className="flex items-center justify-center min-h-[88px]">
                  <Typography variant="h6" className="text-center font-semibold">
                    {stationName}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
