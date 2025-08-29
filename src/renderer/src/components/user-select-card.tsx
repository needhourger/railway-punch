import { Card, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material'
import { AccountBox } from '@mui/icons-material'
import React from 'react'
import store from '@renderer/store'
import AddUserButton from './add-user-button'
import { ManageUserButton } from './manage-user-button'
import useAppContext from '@renderer/context/app-context'

export default function UserSelectCard(): React.JSX.Element {
  const { users, currentUser, setCurrentUser } = useAppContext()

  const handleOutput = async (): Promise<void> => {
    if (!currentUser) return
    const data = await store.get(`records.${currentUser}`)
    console.log(data)
    window.api.exportFile(data, 'test.json')
  }

  return (
    <Card className="w-full p-8 mb-4">
      <div className="flex items-center mb-8">
        <AccountBox fontSize="large" className="" />
        <span className="text-2xl font-bold  ml-2">用户选择</span>
      </div>
      <div className="flex gap-4">
        <FormControl className="w-1/3">
          <InputLabel id="user-select-label">选择用户</InputLabel>
          <Select
            value={currentUser}
            onChange={(e) => setCurrentUser(e.target.value)}
            labelId="user-select-label"
            label="选择用户"
            defaultValue=""
          >
            {users &&
              users.map((username, index) => (
                <MenuItem key={index} value={username}>
                  {username}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <AddUserButton />
        <ManageUserButton />
        <div className="ms-auto">
          <Button onClick={() => handleOutput()} size="large" disabled={!currentUser}>
            导出该用户本月记录
          </Button>
        </div>
      </div>
    </Card>
  )
}
