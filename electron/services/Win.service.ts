import { ipcMain } from 'electron'

export default function WinService(win: Electron.BrowserWindow) {
    ipcMain.on('win:resize', (_e, arg) => {
        win.setSize(arg.width, arg.height)
        win.center()
    })
}