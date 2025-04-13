import { ipcMain, shell } from 'electron'

export default function WinService(win: Electron.BrowserWindow) {
    ipcMain.on('win:resize', (_e, arg) => {
        win.setSize(arg.width, arg.height)
        win.center()
    })
    ipcMain.on('win:open-external', (_e, arg) => {
        shell.openExternal(arg)
    })
}