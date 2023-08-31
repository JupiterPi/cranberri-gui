const {BrowserWindow, shell} = require("electron");
const path = require("path")
const isDev = require("electron-is-dev")

const windows = [];

function createWindow(route, width, height, resizable) {
    const win = new BrowserWindow({
        title: "Cranberri",
        frame: false,
        width: width,
        height: height,
        resizable: resizable,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        },
    })

    const appendPath = route ? `/${route}` : ""
    if (isDev) win.loadURL(`http://localhost:4200${appendPath}`)
    else win.loadFile("dist/cranberri-gui-angular/index.html") //TODO ...

    win.setTitle("Cranberri")

    win.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url)
        return { action: 'deny' }
    })

    windows.push(win)
}

function createMainWindow() {
    createWindow(null, 740, 370, false)
}

module.exports = {
    windows,
    createWindow,
    createMainWindow,
}