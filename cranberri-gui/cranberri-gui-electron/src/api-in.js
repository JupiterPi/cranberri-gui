const fs = require("fs")
const path = require("path")
const child_process = require("child_process")
const YAML = require("yaml")

const updater = require("./updater")
const {SERVER_ROOT, WORLDS_REGISTRY, WORLDS_DIR, ACTIVE_WORLD_DIRS, ACTIVE_WORLD_ROOT, ARCHIVED_WORLDS_DIR, PROJECTS_ROOT} = require("./paths")
const {root} = require("./util");

function readWorlds() {
    return JSON.parse(fs.readFileSync(WORLDS_REGISTRY, "utf-8"))
}
function writeWorlds(worlds) {
    fs.writeFileSync(WORLDS_REGISTRY, JSON.stringify(worlds, null, 2))
}

module.exports = {
    getIsInstalled: () => updater.getIsInstalled(),
    getUpdateInfo: () => updater.getUpdateInfo(),

    install: async () => await updater.install(),
    updatePlugin: async () => await updater.updatePlugin(),
    getWorlds: () => readWorlds()["worlds"],
    getActiveWorldId: () => readWorlds()["activeWorldId"],
    renameWorld: (id, name) => {
        let worlds = readWorlds()
        worlds["worlds"].forEach(world => {
            if (world.id === id) world.name = name
        })
        writeWorlds(worlds)
        return worlds["worlds"]
    },
    archiveWorld: (id) => {
        let worlds = readWorlds()
        const worldName = worlds["worlds"].filter(world => world.id === id)[0].name.replaceAll(" ", "_")
        worlds["worlds"] = worlds["worlds"].filter(world => world.id !== id)
        fs.mkdirSync(`${ARCHIVED_WORLDS_DIR}/${id}-${worldName}`, { recursive: true })
        if (id === worlds["activeWorldId"]) {
            ACTIVE_WORLD_DIRS.forEach(dir => fs.renameSync(`${ACTIVE_WORLD_ROOT}/${dir}`, `${ARCHIVED_WORLDS_DIR}/${id}-${worldName}/${dir}`))
            worlds["activeWorld"] = null
        } else {
            fs.renameSync(`${WORLDS_DIR}/${id}`, `${ARCHIVED_WORLDS_DIR}/${id}-${worldName}`)
        }
        writeWorlds(worlds)
        return worlds["worlds"]
    },
    getProjects: () => {
        return fs.readdirSync(PROJECTS_ROOT).map(name => {
            const projectInfo = YAML.parse(fs.readFileSync(`${PROJECTS_ROOT}/${name}/project.yaml`, "utf-8"))
            return {name, type: projectInfo.projectType, language: projectInfo.language}
        })
    },
    openProjectsFolder: () => {
        child_process.exec(`start "" "${path.resolve(PROJECTS_ROOT)}"`)
        // see https://stackoverflow.com/a/35076582/13164753
    },
    openProjectFolder: (projectName) => {
        child_process.exec(`start "" "${path.resolve(path.join(PROJECTS_ROOT, projectName))}"`)
    },
    openOtherFolder: (folderId) => {
        let folder = ""
        switch (folderId) {
            case "server": folder = SERVER_ROOT; break
            case "projects": folder = PROJECTS_ROOT; break
            case "worlds_archive": folder = ARCHIVED_WORLDS_DIR; break
        }
        child_process.exec(`start "" "${path.resolve(folder)}"`)
    },
    createProject: (name, type, language) => {
        fs.mkdirSync(`${PROJECTS_ROOT}/${name}/scripts`, { recursive: true })
        fs.writeFileSync(`${PROJECTS_ROOT}/${name}/project.yaml`, YAML.stringify({"projectType": type, "language": language}))

        const templateDir = `${root}/project_templates/${language}_${type}`
        for (const file of fs.readdirSync(templateDir)) {
            fs.cpSync(`${templateDir}/${file}`, `${PROJECTS_ROOT}/${name}/${file}`, {recursive: true})
        }
    },
    startServer: (worldId) => {
        let world

        const worlds = readWorlds()
        if (worldId !== worlds["activeWorldId"]) {
            if (worlds["activeWorldId"] != null) {
                fs.mkdirSync(`${WORLDS_DIR}/${worlds["activeWorldId"]}`, { recursive: true })
                ACTIVE_WORLD_DIRS.forEach(dir => fs.renameSync(`${ACTIVE_WORLD_ROOT}/${dir}`, `${WORLDS_DIR}/${worlds["activeWorldId"]}/${dir}`))
            }
            if (worldId != null) {
                ACTIVE_WORLD_DIRS.forEach(dir => {
                    fs.renameSync(`${WORLDS_DIR}/${worldId}/${dir}`, `${ACTIVE_WORLD_ROOT}/${dir}`);
                })
                worlds["activeWorldId"] = worldId
                world = worlds["worlds"].filter(world => world.id === worldId)[0]
            }
        }
        if (worldId == null) {
            const id = require("crypto").randomBytes(4).toString("hex")
            world = { id, name: "Unnamed World" }
            worlds["worlds"].push(world)
            worlds["activeWorldId"] = id
        }
        writeWorlds(worlds)

        child_process.exec(`start cmd.exe /c "cd ${SERVER_ROOT} && java -jar paper-1.19.4-550.jar nogui"`)

        return world
    },
}