import { CalendarMonth } from '@mui/icons-material'
import {
  Button,
  Card,
  CardActionArea,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  IconButton,
  Box
} from '@mui/material'
import { Add, Delete, Edit } from '@mui/icons-material'
import { ArrowBack } from '@mui/icons-material'
import useAppContext from '@renderer/context/app-context'
import { getMonthDays } from '@renderer/libs/month'
import { getDateString, getTagColor } from '@renderer/libs'
import store from '@renderer/store'
import React from 'react'

interface AnnualReportProps {
  onBack: () => void
}

export default function AnnualReport({ onBack }: AnnualReportProps): React.JSX.Element {
  const { currentYear, setCurrentYear, currentMonth, setCurrentMonth } = useAppContext()
  const [yearOptions, setYearOptions] = React.useState<number[]>([])
  const dayOfWeek = ['日', '一', '二', '三', '四', '五', '六']
  const [dayOfMonth, setDayOfMonth] = React.useState<Date[]>([])
  const [emptyDays, setEmptyDays] = React.useState<number>(0)
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null)
  const [selectedDateTags, setSelectedDateTags] = React.useState<string[]>([])
  const [newTagName, setNewTagName] = React.useState('')
  const [editingTagIndex, setEditingTagIndex] = React.useState<number | null>(null)
  const [editingTagName, setEditingTagName] = React.useState('')
  const [allTags, setAllTags] = React.useState<Set<string>>(new Set())

  React.useEffect(() => {
    const currentYear = new Date().getFullYear()
    const years: number[] = []
    for (let y = currentYear - 50; y <= currentYear; y++) {
      years.push(y)
    }
    setYearOptions(years)
  }, [])

  React.useEffect(() => {
    const days = getMonthDays(currentYear, currentMonth)
    const firstDay = days[0]
    setEmptyDays(firstDay.getDay())
    setDayOfMonth(days)
  }, [currentYear, currentMonth])

  const loadAllTags = React.useCallback(async (): Promise<void> => {
    const days = getMonthDays(currentYear, currentMonth)
    const tagSet = new Set<string>()
    for (const day of days) {
      const dateStr = getDateString(day)
      const tags = (await store.get(`annualReport.${dateStr}`)) as string[] | undefined
      if (tags) {
        tags.forEach((tag) => tagSet.add(tag))
      }
    }
    setAllTags(tagSet)
  }, [currentYear, currentMonth])

  React.useEffect(() => {
    loadAllTags()
  }, [loadAllTags])

  const loadDailyTags = React.useCallback(async (date: Date): Promise<string[]> => {
    const dateStr = getDateString(date)
    const tags = (await store.get(`annualReport.${dateStr}`)) as string[] | undefined
    return tags || []
  }, [])

  const saveDailyTags = React.useCallback(async (date: Date, tags: string[]): Promise<void> => {
    const dateStr = getDateString(date)
    if (tags.length === 0) {
      await store.delete(`annualReport.${dateStr}`)
    } else {
      await store.set(`annualReport.${dateStr}`, tags)
    }
  }, [])

  const handleDateClick = async (date: Date): Promise<void> => {
    setSelectedDate(date)
    const tags = await loadDailyTags(date)
    setSelectedDateTags(tags)
    setNewTagName('')
    setEditingTagIndex(null)
  }

  const handleCloseDialog = (): void => {
    setSelectedDate(null)
    setSelectedDateTags([])
    setNewTagName('')
    setEditingTagIndex(null)
  }

  const handleAddTag = async (): Promise<void> => {
    if (!selectedDate || !newTagName.trim()) return
    const trimmedName = newTagName.trim()
    if (selectedDateTags.includes(trimmedName)) {
      setNewTagName('')
      return
    }
    const newTags = [...selectedDateTags, trimmedName]
    setSelectedDateTags(newTags)
    await saveDailyTags(selectedDate, newTags)
    setNewTagName('')
    await loadAllTags()
  }

  const handleDeleteTag = async (index: number): Promise<void> => {
    if (!selectedDate) return
    const newTags = selectedDateTags.filter((_, i) => i !== index)
    setSelectedDateTags(newTags)
    await saveDailyTags(selectedDate, newTags)
    if (editingTagIndex === index) {
      setEditingTagIndex(null)
    }
    await loadAllTags()
  }

  const handleStartEdit = (index: number): void => {
    setEditingTagIndex(index)
    setEditingTagName(selectedDateTags[index])
  }

  const handleSaveEdit = async (): Promise<void> => {
    if (!selectedDate || editingTagIndex === null || !editingTagName.trim()) return
    const trimmedName = editingTagName.trim()
    if (trimmedName === selectedDateTags[editingTagIndex]) {
      setEditingTagIndex(null)
      return
    }
    if (
      selectedDateTags.includes(trimmedName) &&
      trimmedName !== selectedDateTags[editingTagIndex]
    ) {
      setEditingTagIndex(null)
      return
    }
    const newTags = [...selectedDateTags]
    newTags[editingTagIndex] = trimmedName
    setSelectedDateTags(newTags)
    await saveDailyTags(selectedDate, newTags)
    setEditingTagIndex(null)
    await loadAllTags()
  }

  const handleCancelEdit = (): void => {
    setEditingTagIndex(null)
    setEditingTagName('')
  }

  const locateCurrentMonth = (): void => {
    const today = new Date()
    setCurrentYear(today.getFullYear())
    setCurrentMonth(today.getMonth())
  }

  const getDayLabelClass = (day: string): string => {
    const isWeekEnd = day === '日' || day === '六'
    return (
      'font-bold text-xl flex items-center justify-center w-full' +
      ` ${isWeekEnd ? 'text-red-400' : ''}`
    )
  }

  const isToday = (date: Date): boolean => {
    const today = new Date()
    return (
      today.getFullYear() === date.getFullYear() &&
      today.getMonth() === date.getMonth() &&
      today.getDate() === date.getDate()
    )
  }

  const DayTagPreview: React.FC<{ date: Date }> = ({ date }) => {
    const [tags, setTags] = React.useState<string[]>([])

    React.useEffect(() => {
      const loadTags = async (): Promise<void> => {
        const dateStr = getDateString(date)
        const loadedTags = (await store.get(`annualReport.${dateStr}`)) as string[] | undefined
        setTags(loadedTags || [])
      }
      loadTags()
    }, [date])

    if (tags.length === 0) {
      return (
        <div className="flex items-start justify-between px-2 py-4 h-24">
          <div className={`text-xl font-extrabold ${isToday(date) ? 'text-blue-400' : ''}`}>
            {date.getDate()}
          </div>
        </div>
      )
    }

    return (
      <div className="flex flex-col items-start justify-between px-2 py-4 h-24">
        <div className={`text-xl font-extrabold ${isToday(date) ? 'text-blue-400' : ''}`}>
          {date.getDate()}
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {tags.slice(0, 3).map((tag, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: getTagColor(tag) }}
              title={tag}
            />
          ))}
          {tags.length > 3 && <div className="text-xs text-gray-400">+{tags.length - 3}</div>}
        </div>
      </div>
    )
  }

  const getContrastColor = (bgColor: string): string => {
    const hslMatch = bgColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/)
    if (!hslMatch) return '#000000'
    const lightness = parseInt(hslMatch[3])
    return lightness > 50 ? '#000000' : '#ffffff'
  }

  return (
    <div className="min-h-full overflow-y-auto px-10 pb-20">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-3xl font-bold">年度统计报告</h2>
        <Button startIcon={<ArrowBack />} onClick={onBack} variant="outlined" size="large">
          返回
        </Button>
      </div>
      <Card className="p-8 mb-10">
        <div className="w-full flex justify-between mb-4">
          <div className="flex items-center mb-4">
            <CalendarMonth fontSize="large" />
            <span className="text-2xl font-bold ml-2">日历</span>
          </div>
          <div className="flex items-baseline gap-2">
            <Button onClick={() => locateCurrentMonth()} size="large" variant="contained">
              跳转当月
            </Button>
            <FormControl>
              <InputLabel id="year-select-label">年份</InputLabel>
              <Select
                onChange={(e) => setCurrentYear(e.target.value as number)}
                value={currentYear}
                labelId="year-select-label"
                label="年份"
                className="w-36 mr-4"
              >
                {yearOptions.map((y) => (
                  <MenuItem key={y} value={y}>
                    {y}年
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel id="month-select-label">月份</InputLabel>
              <Select
                onChange={(e) => setCurrentMonth(e.target.value as number)}
                value={currentMonth}
                labelId="month-select-label"
                label="月份"
                className="w-36"
              >
                {Array.from({ length: 12 }, (_, i) => i).map((m) => (
                  <MenuItem key={m} value={m}>
                    {m + 1}月
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {dayOfWeek.map((day, index) => (
            <div key={index} className={getDayLabelClass(day)}>
              {day}
            </div>
          ))}
          {[...Array(emptyDays)].map((_, index) => (
            <div key={index}></div>
          ))}
          {dayOfMonth.map((day, index) => (
            <Card key={index} className="border flex flex-col items-center justify-center">
              <CardActionArea onClick={() => handleDateClick(day)}>
                <div className={`w-full ${isToday(day) ? 'bg-blue-400/50' : ''}`}>
                  <DayTagPreview date={day} />
                </div>
              </CardActionArea>
            </Card>
          ))}
        </div>
        {allTags.size > 0 && (
          <div className="mt-6 pt-6 border-t">
            <div className="text-lg font-bold mb-3">图例</div>
            <div className="flex flex-wrap gap-2">
              {Array.from(allTags)
                .sort()
                .map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    style={{
                      backgroundColor: getTagColor(tag),
                      color: getContrastColor(getTagColor(tag))
                    }}
                  />
                ))}
            </div>
          </div>
        )}
      </Card>

      <Dialog open={selectedDate !== null} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedDate
            ? `${selectedDate.getFullYear()}年${selectedDate.getMonth() + 1}月${selectedDate.getDate()}日`
            : ''}
        </DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-4 mt-2">
            <Box className="flex flex-wrap gap-2">
              {selectedDateTags.map((tag, index) => (
                <div key={index} className="flex items-center gap-1">
                  {editingTagIndex === index ? (
                    <div className="flex items-center gap-1">
                      <TextField
                        value={editingTagName}
                        onChange={(e) => setEditingTagName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSaveEdit()
                          } else if (e.key === 'Escape') {
                            handleCancelEdit()
                          }
                        }}
                        autoFocus
                        size="small"
                        variant="outlined"
                        className="w-32"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <IconButton size="small" onClick={handleSaveEdit} color="primary">
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={handleCancelEdit} color="error">
                        <Delete fontSize="small" />
                      </IconButton>
                    </div>
                  ) : (
                    <Chip
                      label={tag}
                      onDelete={() => handleDeleteTag(index)}
                      deleteIcon={<Delete />}
                      style={{
                        backgroundColor: getTagColor(tag),
                        color: getContrastColor(getTagColor(tag))
                      }}
                      icon={
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleStartEdit(index)
                          }}
                          style={{
                            color: getContrastColor(getTagColor(tag))
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      }
                    />
                  )}
                </div>
              ))}
            </Box>
            <div className="flex gap-2">
              <TextField
                fullWidth
                label="添加标签"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddTag()
                  }
                }}
                size="small"
              />
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddTag}
                disabled={!newTagName.trim()}
              >
                添加
              </Button>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>关闭</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
