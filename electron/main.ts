import { app, BrowserWindow, ipcMain, powerMonitor } from 'electron'
import path from 'node:path'

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
    webPreferences: {
      preload: path.join(MAIN_DIST, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: true,
      sandbox: true
    },
  })
  
  // 设置 CSP
  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: https:",
          "font-src 'self'",
          "connect-src 'self'",
          "base-uri 'self'",
          "form-action 'self'"
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

app.whenReady().then(() => {
  initIpc()
  createWindow()
})
