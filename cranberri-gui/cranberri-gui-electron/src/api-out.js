const {windows} = require("./windows");

function send(channel, ...values) {
    windows.forEach(win => {
        if (!win.isDestroyed()) {
            win.webContents.send(channel, ...values)
        }
    })
}

module.exports = {
    handleIsInstalled: (isInstalled) => send("api-handleIsInstalled", isInstalled),
    handleUpdateInfo: (updateInfo) => send("api-handleUpdateInfo", updateInfo),
}