import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import AppRouter from './AppRouter'



const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode >
)

// Use contextBridge
window.ipcRenderer.on('console-log-message', (_event, response) => {
  console.log("Log from Main Process: ", response)
})

window.ipcRenderer.on('alert-message', (_event, response) => {
  alert(response)
})

window.ipcRenderer.invoke('auth:instance-init')