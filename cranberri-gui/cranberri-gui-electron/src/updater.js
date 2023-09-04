const fs = require("fs")
const https = require("https")
const {SERVER_ROOT, WORLDS_REGISTRY, PROJECTS_ROOT, ARCHIVED_WORLDS_DIR, PLUGIN_ROOT} = require("./paths")
const apiOut = require("./api-out")

function getIsInstalled() {
    return fs.existsSync(`${SERVER_ROOT}/paper-1.19.4-550.jar`)
}

async function install() {
    fs.mkdirSync(SERVER_ROOT, { recursive: true })
    await installPaper()
    fs.mkdirSync(PLUGIN_ROOT)
    await installPlugin()

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
        downloadFile("https://api.papermc.io/v2/projects/paper/versions/1.19.4/builds/550/downloads/paper-1.19.4-550.jar", `${SERVER_ROOT}/paper-1.19.4-550.jar`).then(() => resolve())
    })
}

function installPlugin() {
    return new Promise((resolve, _) => {
        https.get("https://api.github.com/repos/JupiterPi/cranberri/releases/latest", {
            headers: { "User-Agent": "cranberri-gui" }
        }, res => {
            let data = []
            res.on("data", chunk => data.push(chunk))
            res.on("end", () => {
                const release = JSON.parse(Buffer.concat(data).toString())
                const fileName = release["assets"][0]["name"]
                const downloadURL = release["assets"][0]["browser_download_url"]
                downloadFile(downloadURL, `${PLUGIN_ROOT}/${fileName}`).then(() => resolve())
            })
        })
    })
}

function updatePlugin() {
    return new Promise((resolve, _) => {
        const pluginFiles = fs.readdirSync(PLUGIN_ROOT).filter(file => /^cranberri-server-plugin-v.+\.jar$/.test(file))
        if (pluginFiles.length !== 1) console.error("Invalid pluginFiles:", pluginFiles)
        const pluginFileName = pluginFiles[0]

        fs.unlinkSync(`${PLUGIN_ROOT}/${pluginFileName}`)
        installPlugin().then(() => {
            resolve()
            apiOut.handleUpdateInfo(getUpdateInfo())
        })
    })
}

function downloadFile(url, file) {
    return new Promise((resolve, _) => {
        const stream = fs.createWriteStream(file)
        https.get(url, function(response) {
            if (response.statusCode === 302) {
                downloadFile(response.headers.location, file).then(() => resolve())
            } else {
                response.pipe(stream)
                stream.on("finish", () => {
                    stream.close()
                    resolve()
                })
            }
        })
    })
}

function getUpdateInfo() {
    const root = __dirname.substring(0, __dirname.length - "/src".length)
    const packageDefinition = JSON.parse(fs.readFileSync(`${root}/package.json`, {encoding: "utf-8"}))
    const cranberriGuiVersion = packageDefinition["version"]

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
    updatePlugin,
}