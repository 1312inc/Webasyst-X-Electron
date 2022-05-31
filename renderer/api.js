const {
  waidRequestScopes,
  apiClientId,
  cloudBundle,
  cloudPlanId,
  sidebarBackgroundColor
} = require('../app.config')
const { contextBridge, ipcRenderer } = require('electron')
const { IPC_MESSAGES } = require('../utils/constants')
const i18n = require('./locale/i18n')

const lang = navigator.language.split('-')[0]

contextBridge.exposeInMainWorld('appState', {
  SETTINGS: {
    API_SCOPE: waidRequestScopes.replace('token:', '').replaceAll('.', ','),
    API_CLIENT_ID: apiClientId,
    CLOUD_BUNDLE: cloudBundle,
    CLOUD_PLAN_ID: cloudPlanId,
    SIDEBAR_BACKGROUND_COLOR: sidebarBackgroundColor
  },
  locale: {
    lang: i18n[lang] ? lang : 'en',
    messages: i18n[lang] || i18n.en
  },
  token: () => ipcRenderer.invoke(IPC_MESSAGES.GET_TOKEN),
  login: () => ipcRenderer.send(IPC_MESSAGES.LOGIN),
  logout: () => ipcRenderer.send(IPC_MESSAGES.LOGOUT),
  openAppInView: (installation) =>
    ipcRenderer.send(IPC_MESSAGES.CREATE_VIEW, installation),
  removeAppInView: () => ipcRenderer.send(IPC_MESSAGES.REMOVE_VIEW),
  openExternalLink: (link) => ipcRenderer.send(IPC_MESSAGES.EXTERNAL_LINK, link),
  reload: () => ipcRenderer.send(IPC_MESSAGES.RELOAD)
})
