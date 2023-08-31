const fs = require("fs")
const https = require("https")
const {SERVER_ROOT, WORLDS_REGISTRY, PROJECTS_ROOT, ARCHIVED_WORLDS_DIR, PLUGIN_ROOT} = require("./paths")
const apiOut = require("./api-out")

function getIsInstalled() {
    return fs.existsSync(`${SERVER_ROOT}/paper-1.19.4-550.jar`)
}

async function install() {
    await installPaper()
    installPlugin()
    fs.writeFileSync(`${SERVER_ROOT}/eula.txt`, "eula=true\n")
    setup()

    const isInstalled = getIsInstalled()
    apiOut.handleIsInstalled(isInstalled);
    if (isInstalled) {
        apiOut.handleUpdateInfo(getUpdateInfo());
    }
}

function setup() {
    if (!fs.existsSync(WORLDS_REGISTRY)) {
        fs.writeFileSync(WORLDS_REGISTRY, JSON.stringify({
            activeWorldId: null,
            worlds: []
        }, null, 2))
    }
    fs.mkdirSync(PROJECTS_ROOT, { recursive: true })
    fs.mkdirSync(ARCHIVED_WORLDS_DIR, { recursive: true })
}
if (getIsInstalled()) setup()

function installPaper() {
    return new Promise((resolve, _) => {
        fs.mkdirSync(SERVER_ROOT, { recursive: true })

        const file = fs.createWriteStream(`${SERVER_ROOT}/paper-1.19.4-550.jar`)
        https.get("https://api.papermc.io/v2/projects/paper/versions/1.19.4/builds/550/downloads/paper-1.19.4-550.jar", function(response) {
            response.pipe(file)
            file.on("finish", () => {
                file.close()
                resolve()
            })
        })
    })
}

function installPlugin() {
    //TODO tmp!
    fs.mkdirSync(PLUGIN_ROOT);
    fs.writeFileSync(`${PLUGIN_ROOT}/cranberri-server-plugin-v0.0.2.jar`, "mocked");
}

function getUpdateInfo() {
    const cranberriGuiVersion = "0.0.0" //TODO ...

    const paperFiles = fs.readdirSync(SERVER_ROOT).filter(file => /^paper-.+\.jar$/.test(file))
    if (paperFiles.length !== 1) console.error("Invalid paperFiles:", paperFiles)
    const paperVersion = /^paper-(.+)\.jar$/.exec(paperFiles[0])[1]

    const pluginFiles = fs.readdirSync(PLUGIN_ROOT).filter(file => /^cranberri-server-plugin-v.+\.jar$/.test(file))
    if (pluginFiles.length !== 1) console.error("Invalid pluginFiles:", pluginFiles)
    const pluginVersion = /^cranberri-server-plugin-v(.+)\.jar$/.exec(pluginFiles[0])[1]

    return { cranberriGuiVersion, paperVersion, pluginVersion }
}

module.exports = {
    getIsInstalled,
    getUpdateInfo,
    install,
}