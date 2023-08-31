const { app, BrowserWindow, ipcMain } = require("electron")

const api = require("./api")
const path = require("path");
const isDev = require("electron-is-dev");

const createWindow = (route, width, height, resizable) => {
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
}
const createMainWindow = () => { createWindow(null, 740, 370, false) }

app.whenReady().then(() => {
    for (const [funName, fun] of Object.entries(api)) {
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

/* saved for later
https.get("https://api.github.com/repos/JupiterPi/cranberri/releases/latest", {
    headers: { "User-Agent": "Cranberri-GUI" }
}, res => {
    let data = []
    res.on("data", chunk => data.push(chunk))
    res.on("end", () => {
        const release = JSON.parse(Buffer.concat(data).toString())
        const downloadURL = release["assets"][0]["browser_download_url"]
        console.log(downloadURL)
    })
})*/
