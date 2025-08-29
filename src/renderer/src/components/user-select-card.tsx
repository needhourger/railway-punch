import { Card, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { AccountBox } from '@mui/icons-material'
import React from 'react'
import store from '@renderer/store'
import AddUserButton from './add-user-button'
import { ManageUserButton } from './manage-user-button'
import useAppContext from '@renderer/context/app-context'

export default function UserSelectCard(): React.JSX.Element {
  const [users, setUsers] = React.useState<string[]>([])
  const { currentUser, setCurrentUser } = useAppContext()

  React.useEffect(() => {
    refreshUsers()
  }, [])

  const refreshUsers = async (): Promise<void> => {
    const tmp = await store.get('users')
    if (tmp) {
      setUsers(tmp as string[])
    } else {
      setUsers([])
    }
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
        <AddUserButton onChange={() => refreshUsers()} users={users} />
        <ManageUserButton onChange={() => refreshUsers()} users={users} />
      </div>
    </Card>
  )
}
