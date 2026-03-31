import { ArrowBack } from '@mui/icons-material'
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography
} from '@mui/material'
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
const alertStations = new Map<string, string>([
  ['新河镇', '检测到今年需要进行电源屏年检和电子集中检修']
])

export default function StationArchivePage({
  onBack,
  onNavigateStation
}: StationArchivePageProps): React.JSX.Element {
  const [keyword, setKeyword] = React.useState('')
  const [alertDialogOpen, setAlertDialogOpen] = React.useState(alertStations.size > 0)

  const filteredStations = stationNames.filter((stationName) =>
    stationName.includes(keyword.trim())
  )

  return (
    <div className="w-full h-full max-w-6xl mx-auto px-10 flex flex-col">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-3xl font-bold">一站一档</h2>
        <Button startIcon={<ArrowBack />} onClick={onBack} variant="outlined" size="large">
          返回
        </Button>
      </div>
      <Dialog
        open={alertDialogOpen}
        onClose={() => setAlertDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5" className="font-bold">
            站点告警提示
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          {alertStations.size === 0 ? (
            <Typography variant="body1">当前无站点告警。</Typography>
          ) : (
            <>
              <Typography variant="subtitle1" className="mb-3 font-semibold">
                当前存在以下站点告警：
              </Typography>
              <ul className="list-disc list-inside space-y-1 pl-1">
                {Array.from(alertStations.entries()).map(([name, detail]) => (
                  <li key={name} className="text-base leading-relaxed">
                    <span className="font-semibold">{name}</span>
                    <span>：{detail}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAlertDialogOpen(false)}>我已知晓</Button>
        </DialogActions>
      </Dialog>
      <div className="mb-4 mt-2">
        <TextField
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          label="筛选站点"
          placeholder="输入站点名称关键字"
          fullWidth
        />
      </div>
      <div className="flex-1 overflow-y-auto pr-1 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredStations.map((stationName) => {
            const hasAlert = alertStations.has(stationName)
            return (
              <div
                key={stationName}
                className={`station-alert-wrapper ${hasAlert ? 'station-alert-glow' : ''}`}
              >
                <Card className="hover:shadow-lg transition-shadow h-full">
                  <CardActionArea
                    onClick={() => onNavigateStation(stationName)}
                    className="h-full p-2"
                  >
                    <CardContent className="flex items-center justify-center min-h-[88px]">
                      <Typography variant="h6" className="text-center font-semibold">
                        {stationName}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
