import { join } from 'path'
import { app, shell, BrowserWindow, ipcMain, nativeTheme, dialog } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import icsFile from '../../resources/cn_zh.ics?asset'
import * as fs from 'node:fs'
import { convertIcsCalendar, IcsCalendar } from 'ts-ics'
import { Conf } from 'electron-conf/main'
import path from 'node:path'
import * as XLSX from 'xlsx'

const conf = new Conf()
conf.registerRendererListener()

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))
  // 暗色模式
  ipcMain.on('dark-mode:system', () => {
    nativeTheme.themeSource = 'system'
  })
  ipcMain.on('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'light'
    } else {
      nativeTheme.themeSource = 'dark'
    }
    return nativeTheme.shouldUseDarkColors
  })

  ipcMain.handle('export-file', async (event, data, filename) => {
    try {
      const result = await dialog.showSaveDialog({
        title: '导出记录',
        defaultPath: path.join(app.getPath('downloads'), filename),
        filters: [
          // { name: 'JSON', extensions: ['json'] },
          { name: 'excel', extensions: ['xls', 'xlsx'] },
          { name: '所有文件', extensions: ['*'] }
        ]
      })
      console.log(data, result)
      if (!result.canceled && result.filePath) {
        const templatePath = path.resolve('../../resources/template.xls?asset')
        const workbook = XLSX.readFile(templatePath)
        // XLSX.utils.book_append_sheet(workbook, worksheet, 'test')
        XLSX.writeFile(workbook, result.filePath, { compression: true })
        return { success: true, filePath: result.filePath }
      }
      return { success: false, message: '用户取消了保存' }
    } catch (err) {
      console.log(err)
      return { success: false, message: err }
    }
  })

  ipcMain.handle('load-ics', async (event): Promise<IcsCalendar | null> => {
    console.log(event)
    try {
      const data = fs.readFileSync(icsFile, 'utf-8')
      return convertIcsCalendar(undefined, data)
    } catch (error) {
      console.error('Error reading file:', error)
      throw error
    }
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
