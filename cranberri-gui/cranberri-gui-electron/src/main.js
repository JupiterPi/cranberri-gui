const { app, BrowserWindow, ipcMain, shell } = require("electron")

const apiIn = require("./api-in")
const { createWindow, createMainWindow} = require("./windows")

app.whenReady().then(() => {
    for (const [funName, fun] of Object.entries(apiIn)) {
        ipcMain.handle(`api-${funName}`, (_, ...args) => fun(...args))
    }

    ipcMain.handle("openWindow", (_, route, width, height, resizable) => {
        createWindow(route, width, height, resizable)
    })
    ipcMain.handle("close", () => {
        app.quit()
    })

    createMainWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
