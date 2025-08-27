import React from 'react'
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
  DialogTitle,
  FormControl
} from '@mui/material'
import { PersonAddAlt } from '@mui/icons-material'
import store from '@renderer/store'

interface AddUserButtonProps {
  onChange: () => void
  users: string[]
}

export default function AddUserButton({ onChange, users }: AddUserButtonProps): React.JSX.Element {
  const [newUsername, setNewUsername] = React.useState('')
  const [addUserDialogOpen, setAddUserDialogOpen] = React.useState(false)
  const [duplicate, setDuplicateTip] = React.useState(false)

  const handleAddUser = async (): Promise<void> => {
    if (newUsername) {
      if (users.includes(newUsername)) {
        setDuplicateTip(true)
        return
      }
      await store.set('users', [newUsername, ...users])
      onChange()
      setAddUserDialogOpen(false)
      setNewUsername('')
      setDuplicateTip(false)
    }
  }
  return (
    <React.Fragment>
      <Button onClick={() => setAddUserDialogOpen(true)} className="w-32" variant="outlined">
        <div className="flex items-center gap-2">
          <PersonAddAlt />
          <span>添加用户</span>
        </div>
      </Button>
      <Dialog open={addUserDialogOpen}>
        <DialogTitle>添加用户</DialogTitle>
        <DialogContent>
          {duplicate && <DialogContentText>禁止重复添加</DialogContentText>}
          <FormControl>
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              label="新用户名"
              fullWidth
              variant="standard"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            ></TextField>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleAddUser()}>确认</Button>
          <Button onClick={() => setAddUserDialogOpen(false)}>取消</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}
