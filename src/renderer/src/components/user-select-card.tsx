import { Card, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { AccountBox } from '@mui/icons-material'

export default function UserSelectCard(): React.JSX.Element {
  return (
    <Card className="w-full p-8">
      <div className="flex items-center mb-4">
        <AccountBox fontSize="large" className="" />
        <span className="text-2xl font-bold  ml-2">用户选择</span>
      </div>
      <FormControl className="w-1/3">
        <InputLabel id="user-select-label">选择用户</InputLabel>
        <Select labelId="user-select-label" label="选择用户" defaultValue="">
          <MenuItem value="">张三</MenuItem>
          <MenuItem value="">李四</MenuItem>
          <MenuItem value="">王五</MenuItem>
        </Select>
      </FormControl>
    </Card>
  )
}
