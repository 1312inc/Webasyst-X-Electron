const appConfig = require('./app.config')
const {
  app,
  BrowserWindow,
  BrowserView,
  ipcMain,
  shell,
  protocol
} = require('electron')
const http = require('http')
const path = require('path')
const { IPC_MESSAGES } = require('./utils/constants')
const { AuthProvider } = require('./utils/waidAuthProvider')

let win
let winLogin
let rendererUrl
let browserView
const authProvider = new AuthProvider()
const windowBounds = {
  width: 1400,
  height: 900,
  sidebarWidth: 80
}
const devServerHost = appConfig.devServerHost

async function createAppWindow () {
  const rendererDevServerOn = await new Promise((resolve) => {
    http
      .get(devServerHost, () => {
        resolve(true)
      })
      .on('error', () => {
        resolve(false)
      })
  })

  rendererUrl =
    !app.isPackaged && rendererDevServerOn
      ? devServerHost
      : `file://${path.join(__dirname, '/renderer/index.html')}`

  win = new BrowserWindow({
    width: windowBounds.width,
    height: windowBounds.height,
    titleBarStyle: 'hidden',
    titleBarOverlay: true,
    trafficLightPosition: { x: 12, y: 12 },
    minWidth: 982 + windowBounds.sidebarWidth,
    minHeight: 600,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, '/renderer/api.js'),
      webSecurity: app.isPackaged
    }
  })

  browserView = new BrowserView({
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, '/app/api.js'),
      webSecurity: app.isPackaged
    }
  })

  // regiter custom protocol for the auth callback e.g. 'atom://callback'
  protocol.registerHttpProtocol('atom', (request, callback) => {})

  win.loadURL(rendererUrl)
  win.on('closed', () => {
    win = null
  })
}

app.setName(appConfig.appName)
app.on('ready', createAppWindow)
app.on('window-all-closed', () => {
  app.quit()
})

ipcMain.handle(IPC_MESSAGES.GET_TOKEN, async () => await authProvider.getToken())

ipcMain.on(IPC_MESSAGES.LOGIN, async () => {
  if (!winLogin) {
    winLogin = new BrowserWindow({
      width: 400,
      height: 800,
      title: 'Sign in with Webasyst ID'
    })
    winLogin.on('closed', () => {
      winLogin = null
    })
  } else {
    if (!winLogin.isFocused()) {
      winLogin.focus()
    }
  }

  await authProvider.login(winLogin)
  winLogin.destroy()
  win.loadURL(rendererUrl)
})

ipcMain.on(IPC_MESSAGES.LOGOUT, async () => {
  await authProvider.logout()

  // clear renderer localstorage
  await win.webContents.session.clearStorageData()

  win.setBrowserView(null)
  win.loadURL(rendererUrl)
})

ipcMain.on(IPC_MESSAGES.CREATE_VIEW, async (event, installation) => {
  // if browserView detached
  if (!win.getBrowserView()) {
    win.setBrowserView(browserView)
  }

  await browserView.webContents.loadFile(
    path.join(__dirname, '/app/index.html')
  )

  browserView.webContents.send('appLoaded', installation)

  // set BrowserView bounds related to the window
  const currentBounds = win.getBounds()
  browserView.setBounds({
    x: windowBounds.sidebarWidth,
    y: 0,
    width: currentBounds.width - windowBounds.sidebarWidth,
    height: currentBounds.height
  })

  browserView.setAutoResize({
    width: true,
    height: true
  })
})

ipcMain.on(IPC_MESSAGES.REMOVE_VIEW, () => {
  win.setBrowserView(null)
})

ipcMain.on(IPC_MESSAGES.EXTERNAL_LINK, (event, link) => {
  shell.openExternal(link)
})

ipcMain.on(IPC_MESSAGES.RELOAD, () => {
  win.setBrowserView(null)
  win.webContents.reload()
})
