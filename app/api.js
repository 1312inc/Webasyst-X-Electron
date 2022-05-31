const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('appState', {
  ready: (callback) => {
    ipcRenderer.on('appLoaded', (event, installation) => {
      callback(installation)
    })
  }
})
