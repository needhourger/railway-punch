import { Card, TextField, Button, Alert } from '@mui/material'
import { Lock } from '@mui/icons-material'
import React, { useState } from 'react'

interface LoginProps {
  onLogin: (username: string, password: string) => boolean
}

export default function Login({ onLogin }: LoginProps): React.JSX.Element {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password.trim()) {
      setError('请输入用户名和密码')
      return
    }

    const success = onLogin(username.trim(), password.trim())
    if (!success) {
      setError('用户名或密码错误')
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="p-8">
        <div className="flex items-center mb-8 justify-center">
          <Lock fontSize="large" className="mr-2" />
          <span className="text-2xl font-bold">登录</span>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <TextField
            fullWidth
            label="用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
            autoFocus
          />
          <TextField
            fullWidth
            label="密码"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
          />
          {error && (
            <Alert severity="error" className="mt-4">
              {error}
            </Alert>
          )}
          <Button type="submit" variant="contained" fullWidth size="large" className="mt-6">
            登录
          </Button>
        </form>
      </Card>
    </div>
  )
}
