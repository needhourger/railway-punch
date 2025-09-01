import { Close } from '@mui/icons-material'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material'
import useAppContext from '@renderer/context/app-context'
import React from 'react'

export function ManageUserButton(): React.JSX.Element {
  const [visible, setVisible] = React.useState(false)
  const { users, deleteStoreUser } = useAppContext()

  const handleRemoveUser = async (username: string): Promise<void> => {
    deleteStoreUser(username)
  }

  return (
    <React.Fragment>
      <Button onClick={() => setVisible(true)} variant="outlined">
        管理用户
      </Button>
      <Dialog open={visible}>
        <DialogTitle>用户管理</DialogTitle>
        <DialogContent className="flex gap-2 w-120 flex-wrap">
          <DialogContentText>
            <span className="text-red-500">警告：删除用户意味着删除用户所有的对应记录</span>
          </DialogContentText>
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
