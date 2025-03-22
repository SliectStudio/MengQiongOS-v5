import { app, BrowserWindow, ipcMain, powerMonitor } from 'electron'
import path from 'node:path'
import fs from 'node:fs/promises'
import { exec } from 'child_process'

// 添加这个函数到文件开头
function showTouchKeyboard() {
  if (process.platform === 'win32') {
    // 尝试多种方法来启动触摸键盘
    const methods = [
      'C:\\Windows\\System32\\cmd.exe /c "C:\\Program Files\\Common Files\\Microsoft Shared\\ink\\TabTip.exe"',
      'C:\\Windows\\System32\\cmd.exe /c "start C:\\Windows\\System32\\osk.exe"'
    ]

    for (const method of methods) {
      try {
        exec(method, (error) => {
          if (error) {
            console.log(`Method ${method} failed:`, error)
          } else {
            console.log(`Successfully launched keyboard using: ${method}`)
          }
        })
      } catch (err) {
        console.log(`Failed to execute ${method}:`, err)
      }
    }
  }
}

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js
// │ ├─┬ preload
// │ │ └── index.js
// │ ├─┬ renderer
// │ │ └── index.html
process.env.APP_ROOT = path.join(__dirname, '../')

export const MAIN_DIST = path.join(path.join(process.env.APP_ROOT, 'dist-electron'))
// 修改输出目录路径
export const RENDERER_DIST = process.env.VITE_DEV_SERVER_URL
    ? path.join(__dirname, '..', '.output', 'public')
    : path.join(app.getAppPath(), '.output', 'public')

process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(MAIN_DIST, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false, // 允许加载本地资源
      sandbox: true,
      // 添加以下配置
      partition: 'persist:mengqiongos'
    },
  })
  
  // 设置 CSP
  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          
        ].join('; ')
      }
    })
  })

  win.setFullScreen(true)

  // 修改文件加载逻辑
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    // 添加路径调试输出
    console.log('Production path:', path.join(RENDERER_DIST, 'index.html'))
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))  // 确保使用path.join
  }
  win.webContents.openDevTools()
}

function getAccountsPath(): string {
  if (app.isPackaged) {
    const userDataPath = app.getPath('userData');
    console.log('用户数据目录:', userDataPath); // 添加这行来显示具体路径
    return path.join(userDataPath, 'data', 'accounts.json')
  }
  return path.join(app.getAppPath(), 'data', 'accounts.json')
}

// 添加确保数据目录存在的函数
async function ensureDataFile() {
  const dataDir = path.dirname(getAccountsPath())
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
  
  try {
    await fs.access(getAccountsPath())
  } catch {
// 如果文件不存在，创建默认文件
    const defaultContent = {
      accounts: []
    }
    await fs.writeFile(getAccountsPath(), JSON.stringify(defaultContent, null, 2))
  }
}

function initIpc() {
  ipcMain.handle('app-start-time', () => (new Date).toLocaleString())
  
  ipcMain.handle('get-power-status', async () => {
    const onBattery = powerMonitor.onBatteryPower
    if (!onBattery) {
      return { type: 'AC', charging: true }
    }
    
    if (!win) {
      throw new Error('Window is not initialized');
    }
    
    const batteryLevel = await win.webContents.executeJavaScript(`
      navigator.getBattery().then(battery => battery.level * 100)
    `)
    const isCharging = await win.webContents.executeJavaScript(`
      navigator.getBattery().then(battery => battery.charging)
    `)
    
    return {
      type: 'Battery',
      level: batteryLevel,
      charging: isCharging
    }
  })

  // 添加账户文件操作处理
  ipcMain.handle('read-accounts', async () => {
    try {
      const data = await fs.readFile(getAccountsPath(), 'utf8')
      return JSON.parse(data)
    } catch (error) {
      console.error('读取accounts.json失败:', error)
      return { accounts: [] }
    }
  })

  ipcMain.handle('write-accounts', async (_, data) => {
    try {
      await fs.writeFile(getAccountsPath(), JSON.stringify(data, null, 2))
      return true
    } catch (error) {
      console.error('写入accounts.json失败:', error)
      return false
    }
  })

  // 修改现有的ipcMain处理函数
  ipcMain.handle('show-keyboard', () => {
    console.log('Attempting to show keyboard...')
    showTouchKeyboard()
    return true
  })
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(async () => {
  await ensureDataFile() // 添加这一行
  initIpc()
  createWindow()
})
