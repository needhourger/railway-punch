import { Close } from '@mui/icons-material'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import store from '@renderer/store'
import React from 'react'

interface ManageUserButtonProps {
  onChange: () => void
  users: string[]
}
export function ManageUserButton({ onChange, users }: ManageUserButtonProps): React.JSX.Element {
  const [visible, setVisible] = React.useState(false)

  const handleRemoveUser = async (username: string): Promise<void> => {
    const newUsers = users.filter((i) => i !== username)
    await store.set('users', newUsers)
    onChange()
  }

  return (
    <React.Fragment>
      <Button onClick={() => setVisible(true)} variant="outlined">
        管理用户
      </Button>
      <Dialog open={visible}>
        <DialogTitle>用户管理</DialogTitle>
        <DialogContent className="flex gap-2 w-120 flex-wrap">
          {users &&
            users.map((item, index) => (
              <Button key={index} onClick={() => handleRemoveUser(item)} variant="outlined">
                <div className="flex items-center gap-2">
                  <span>{item}</span>
                  <Close />
                </div>
              </Button>
            ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVisible(false)}>关闭</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}
